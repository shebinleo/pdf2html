// lib/CommandExecutor.js
const debug = require('debug')('pdf2html');
const { spawn } = require('child_process');
const { PDFProcessingError } = require('./errors');

/**
 * Command executor utility
 */
class CommandExecutor {
    static async execute(command, args, options = {}) {
        const fullCommand = `${command} ${args.join(' ')}`;
        debug(`Executing command: ${fullCommand} with options: ${JSON.stringify(options)}`);

        return new Promise((resolve, reject) => {
            const child = spawn(command, args, options);
            let stdout = '';
            let stderr = '';

            child.stdout.on('data', (data) => {
                stdout += data.toString();
            });

            child.stderr.on('data', (data) => {
                stderr += data.toString();
            });

            child.on('error', (error) => {
                reject(new PDFProcessingError(`Failed to spawn process: ${error.message}`, fullCommand));
            });

            child.on('close', (code, signal) => {
                if (code !== 0) {
                    let signalMsg = '';
                    if (signal) {
                        signalMsg = ` (signal: ${signal})`;
                    }

                    const errorMsg = stderr || `Process exited with code ${code}${signalMsg}`;
                    reject(new PDFProcessingError(errorMsg, fullCommand, code));
                    return;
                }

                resolve(stdout);
            });
        });
    }
}

module.exports = CommandExecutor;
