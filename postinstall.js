#!/usr/bin/env node

const https = require('https');
const fs = require('fs');
const path = require('path');
const { pipeline } = require('stream');
const { promisify } = require('util');
const constants = require('./constants');

const pipelineAsync = promisify(pipeline);
const fsAccess = promisify(fs.access);
const fsMkdir = promisify(fs.mkdir);

const DEPENDENCIES = {
    [constants.VENDOR_PDF_BOX_JAR]: {
        url: 'https://archive.apache.org/dist/pdfbox/2.0.34/pdfbox-app-2.0.34.jar',
        size: 12900000, // Approximate size in bytes for progress tracking
    },
    [constants.VENDOR_TIKA_JAR]: {
        url: 'https://archive.apache.org/dist/tika/3.2.0/tika-app-3.2.0.jar',
        size: 56200000, // Approximate size in bytes
    },
};

const CONCURRENT_DOWNLOADS = 2;
const RETRY_ATTEMPTS = 3;
const RETRY_DELAY = 1000; // milliseconds

/**
 * Formats bytes to human-readable string
 */
function formatBytes(bytes) {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)), 10);
    return `${Math.round((bytes / 1024 ** i) * 100) / 100} ${sizes[i]}`;
}

/**
 * Creates a progress bar string
 */
function createProgressBar(progress, width = 30) {
    const filled = Math.round(width * progress);
    const empty = width - filled;
    return `[${'='.repeat(filled)}${' '.repeat(empty)}] ${Math.round(progress * 100)}%`;
}

/**
 * Progress tracker for multiple downloads
 */
class ProgressTracker {
    constructor() {
        this.downloads = new Map();
        this.renderInterval = null;
    }

    addDownload(filename) {
        this.downloads.set(filename, {
            progress: 0,
            downloaded: 0,
            total: 0,
            status: 'pending',
        });
    }

    updateProgress(filename, downloaded, total) {
        const download = this.downloads.get(filename);
        if (download) {
            download.downloaded = downloaded;
            download.total = total;
            download.progress = total > 0 ? downloaded / total : 0;
            download.status = 'downloading';
        }
    }

    completeDownload(filename, success = true) {
        const download = this.downloads.get(filename);
        if (download) {
            download.status = success ? 'completed' : 'failed';
            download.progress = success ? 1 : download.progress;
        }
    }

    start() {
        // Clear console and hide cursor
        console.clear();
        process.stdout.write('\x1B[?25l');

        this.renderInterval = setInterval(() => this.render(), 100);
    }

    stop() {
        if (this.renderInterval) {
            clearInterval(this.renderInterval);
            this.renderInterval = null;
        }
        // Show cursor
        process.stdout.write('\x1B[?25h');
    }

    render() {
        // Move cursor to home position
        process.stdout.write('\x1B[H');

        console.log('📦 PDF2HTML Post-install Script');
        console.log('================================\n');
        console.log('Downloading dependencies:\n');

        const entries = Array.from(this.downloads.entries());
        entries.forEach(([filename, data]) => {
            const shortName = filename.length > 30 ? `...${filename.slice(-27)}` : filename.padEnd(30);

            if (data.status === 'completed') {
                console.log(`✓ ${shortName} [${createProgressBar(1, 20)}] Complete    `);
            } else if (data.status === 'failed') {
                console.log(`✗ ${shortName} [${createProgressBar(data.progress, 20)}] Failed      `);
            } else if (data.status === 'downloading') {
                const progressBar = createProgressBar(data.progress, 20);
                const stats = `${formatBytes(data.downloaded)}/${formatBytes(data.total)}`;
                console.log(`⬇ ${shortName} ${progressBar} ${stats}     `);
            } else {
                console.log(`⏳ ${shortName} [${' '.repeat(20)}] Waiting...  `);
            }
        });

        // Clear any remaining lines
        process.stdout.write('\x1B[J');
    }
}

/**
 * Ensures the vendor directory exists
 */
async function ensureVendorDirectory() {
    try {
        await fsMkdir(constants.DIRECTORY.VENDOR, { recursive: true });
    } catch (error) {
        if (error.code !== 'EEXIST') {
            throw error;
        }
    }
}

/**
 * Checks if a file already exists
 */
async function fileExists(filePath) {
    try {
        await fsAccess(filePath, fs.constants.F_OK);
        return true;
    } catch {
        return false;
    }
}

/**
 * Downloads a file with progress tracking
 */
function downloadFile(url, destination, expectedSize, progressCallback) {
    return new Promise((resolve, reject) => {
        const fileStream = fs.createWriteStream(destination);
        let downloadedBytes = 0;
        let lastProgressUpdate = 0;

        const request = https.get(url, { timeout: 30000 }, (response) => {
            if (response.statusCode === 302 || response.statusCode === 301) {
                // Handle redirects
                fileStream.destroy();
                downloadFile(response.headers.location, destination, expectedSize, progressCallback).then(resolve).catch(reject);
                return;
            }

            if (response.statusCode !== 200) {
                fileStream.destroy();
                reject(new Error(`HTTP ${response.statusCode}: ${response.statusMessage}`));
                return;
            }

            const totalSize = parseInt(response.headers['content-length'], 10) || expectedSize;

            response.on('data', (chunk) => {
                downloadedBytes += chunk.length;
                const now = Date.now();

                // Update progress every 100 ms to avoid too frequent updates
                if (now - lastProgressUpdate > 100) {
                    progressCallback(downloadedBytes, totalSize);
                    lastProgressUpdate = now;
                }
            });

            response.on('end', () => {
                // Final progress update
                progressCallback(downloadedBytes, totalSize);
            });

            pipelineAsync(response, fileStream)
                .then(() => resolve())
                .catch(reject);
        });

        request.on('error', (error) => {
            fileStream.destroy();
            reject(error);
        });

        request.on('timeout', () => {
            request.destroy();
            fileStream.destroy();
            reject(new Error('Download timeout'));
        });
    });
}

/**
 * Downloads a dependency with retry logic
 */
async function downloadDependency(filename, config, progressTracker, attempt = 1) {
    const filePath = path.join(constants.DIRECTORY.VENDOR, filename);

    // Check if the file already exists
    if (await fileExists(filePath)) {
        progressTracker.completeDownload(filename, true);
        return undefined;
    }

    try {
        await downloadFile(config.url, filePath, config.size, (downloaded, total) => progressTracker.updateProgress(filename, downloaded, total));
        progressTracker.completeDownload(filename, true);
        return undefined;
    } catch (error) {
        // Clean up partial download
        try {
            fs.unlinkSync(filePath);
        } catch {
            // Ignore cleanup errors
        }

        if (attempt < RETRY_ATTEMPTS) {
            await new Promise((resolve) => {
                setTimeout(resolve, RETRY_DELAY);
            });
            return downloadDependency(filename, config, progressTracker, attempt + 1);
        }

        progressTracker.completeDownload(filename, false);
        throw error;
    }
}

/**
 * Downloads dependencies in parallel with progress tracking
 */
async function downloadDependencies(progressTracker) {
    const entries = Object.entries(DEPENDENCIES);
    const results = [];

    // Add all downloads to the tracker
    entries.forEach(([filename]) => progressTracker.addDownload(filename));

    // Start progress rendering
    progressTracker.start();

    // Download all files in parallel (respecting concurrency limit)
    const downloadPromises = [];
    for (let i = 0; i < entries.length; i += CONCURRENT_DOWNLOADS) {
        const batch = entries.slice(i, i + CONCURRENT_DOWNLOADS);
        const batchPromises = batch.map(([filename, config]) =>
            downloadDependency(filename, config, progressTracker).catch((error) => ({
                filename,
                error,
            }))
        );

        downloadPromises.push(...batchPromises);
    }

    const allResults = await Promise.all(downloadPromises);
    results.push(...allResults.filter((result) => result !== undefined));

    // Stop progress rendering
    progressTracker.stop();

    return results;
}

/**
 * Main function
 */
async function main() {
    const progressTracker = new ProgressTracker();

    try {
        // Ensure vendor directory exists
        await ensureVendorDirectory();

        // Download dependencies with progress tracking
        const results = await downloadDependencies(progressTracker);

        // Move cursor below progress display
        console.log('\n');

        // Check for errors
        const errors = results.filter((result) => result?.error);

        if (errors.length > 0) {
            console.error('❌ Post-install completed with errors:');
            errors.forEach(({ filename, error }) => {
                console.error(`   - ${filename}: ${error.message}`);
            });
            process.exit(1);
        }

        console.log('✅ All dependencies downloaded successfully!');
    } catch (error) {
        progressTracker.stop();
        console.error('\n❌ Post-install failed:', error.message);
        process.exit(1);
    }
}

// Handle unhandled rejections
process.on('unhandledRejection', (error) => {
    console.error('\n❌ Unhandled error:', error);
    process.exit(1);
});

// Run the main function
if (require.main === module) {
    main().catch((error) => {
        console.error('\n❌ Fatal error:', error);
        process.exit(1);
    });
}
