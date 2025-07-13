/**
 * Type definitions for pdf2html
 * Convert PDF files to HTML, extract text, generate thumbnails, and extract metadata
 */

/// <reference types="node" />

declare module 'pdf2html' {
    /**
     * Options for PDF processing operations
     */
    export interface ProcessingOptions {
        /**
         * Maximum buffer size in bytes for stdout/stderr
         * @default 2097152 (2MB)
         */
        maxBuffer?: number;
    }

    /**
     * Options for extracting pages
     */
    export interface PageOptions extends ProcessingOptions {
        /**
         * Extract text instead of HTML
         * @default false
         */
        text?: boolean;
    }

    /**
     * Options for generating thumbnails
     */
    export interface ThumbnailOptions extends ProcessingOptions {
        /**
         * Page number to generate thumbnail from
         * @default 1
         */
        page?: number;

        /**
         * Image format for the thumbnail
         * @default 'png'
         */
        imageType?: 'png' | 'jpg';

        /**
         * Width of the thumbnail in pixels
         * @default 160
         */
        width?: number;

        /**
         * Height of the thumbnail in pixels
         * @default 226
         */
        height?: number;
    }

    /**
     * PDF metadata structure
     */
    export interface PDFMetadata {
        'pdf:PDFVersion'?: string;
        'pdf:producer'?: string;
        'pdf:encrypted'?: string;
        'xmp:CreatorTool'?: string;
        'dc:creator'?: string;
        'dc:title'?: string;
        'dc:subject'?: string;
        'dc:description'?: string;
        'pdf:keywords'?: string;
        'pdf:created'?: string;
        'pdf:modified'?: string;
        'xmpTPg:NPages'?: string;
        'Content-Type'?: string;
        'Content-Length'?: string;
        resourceName?: string;
        [key: string]: any;
    }

    /**
     * Input type for all methods - can be a file path or Buffer
     */
    export type PDFInput = string | Buffer;

    /**
     * Convert PDF to HTML
     * @param input - Path to PDF file or PDF buffer
     * @param options - Processing options
     * @returns Promise resolving to HTML string
     * @throws Error if a file not found or processing fails
     */
    export function html(input: PDFInput, options?: ProcessingOptions): Promise<string>;

    /**
     * Extract text from PDF
     * @param input - Path to PDF file or PDF buffer
     * @param options - Processing options
     * @returns Promise resolving to extracted text
     * @throws Error if a file not found or processing fails
     */
    export function text(input: PDFInput, options?: ProcessingOptions): Promise<string>;

    /**
     * Extract pages from PDF as HTML or text
     * @param input - Path to PDF file or PDF buffer
     * @param options - Page extraction options
     * @returns Promise resolving to an array of page contents
     * @throws Error if a file not found or processing fails
     */
    export function pages(input: PDFInput, options?: PageOptions): Promise<string[]>;

    /**
     * Extract metadata from PDF
     * @param input - Path to PDF file or PDF buffer
     * @param options - Processing options
     * @returns Promise resolving to metadata object
     * @throws Error if a file not found or processing fails
     */
    export function meta(input: PDFInput, options?: ProcessingOptions): Promise<PDFMetadata>;

    /**
     * Generate thumbnail from PDF
     * @param input - Path to PDF file or PDF buffer
     * @param options - Thumbnail generation options
     * @returns Promise resolving to a path of generated thumbnail
     * @throws Error if a file not found or processing fails
     */
    export function thumbnail(input: PDFInput, options?: ThumbnailOptions): Promise<string>;

    /**
     * Extract images from PDF
     * @param input - Path to PDF file or PDF buffer
     * @param options - Image extraction options
     * @returns Promise resolving to an array of paths to extracted images
     * @throws Error if a file not found or processing fails
     */
    export function extractImages(input: PDFInput, options?: ProcessingOptions): Promise<string[]>;

    /**
     * PDF processing error class
     */
    export class PDFProcessingError extends Error {
        /**
         * The command that failed
         */
        command?: string;

        /**
         * The exit code of the failed process
         */
        exitCode?: number;

        constructor(message: string, command?: string, exitCode?: number);
    }

    /**
     * Main PDF processor class (for advanced usage)
     */
    export class PDFProcessor {
        static toHTML(input: PDFInput, options?: ProcessingOptions): Promise<string>;
        static toPages(input: PDFInput, options?: PageOptions): Promise<string[]>;
        static toText(input: PDFInput, options?: ProcessingOptions): Promise<string>;
        static extractMetadata(input: PDFInput, options?: ProcessingOptions): Promise<PDFMetadata>;
        static generateThumbnail(input: PDFInput, options?: ThumbnailOptions): Promise<string>;
    }

    /**
     * Utility classes (for advanced usage)
     */
    export namespace utils {
        export class CommandExecutor {
            static execute(command: string, args: string[], options?: any): Promise<string>;
        }

        export class ImageProcessor {
            static resize(sourceFilepath: string, targetFilepath: string, options: { width: number; height: number }): Promise<void>;
        }

        export class FileManager {
            static withTempFile<T>(sourceFile: string, tempDir: string, operation: (tempFilePath: string, uri: any) => Promise<T>): Promise<T>;
            static ensureDirectories(): Promise<void>;
            static createTempFileFromBuffer(buffer: Buffer, extension?: string): Promise<string>;
            static processInput<T>(input: PDFInput, processor: (filePath: string, isBuffer: boolean, tempPath?: string) => Promise<T>): Promise<T>;
        }

        export class HTMLParser {
            static extractPages(htmlContent: string, options?: { text?: boolean }): string[];
        }
    }
}
