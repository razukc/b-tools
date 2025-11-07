import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { Logger } from '../../../src/utils/logger.js';

describe('Logger', () => {
  let logger: Logger;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let consoleLogSpy: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let consoleErrorSpy: any;

  beforeEach(() => {
    logger = new Logger();
    consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleLogSpy.mockRestore();
    consoleErrorSpy.mockRestore();
    delete process.env.DEBUG;
  });

  describe('info', () => {
    it('should log an info message', () => {
      logger.info('Test info message');

      expect(consoleLogSpy).toHaveBeenCalledOnce();
      expect(consoleLogSpy.mock.calls[0][0]).toContain('ℹ');
      expect(consoleLogSpy.mock.calls[0][1]).toBe('Test info message');
    });
  });

  describe('success', () => {
    it('should log a success message', () => {
      logger.success('Test success message');

      expect(consoleLogSpy).toHaveBeenCalledOnce();
      expect(consoleLogSpy.mock.calls[0][0]).toContain('✓');
      expect(consoleLogSpy.mock.calls[0][1]).toBe('Test success message');
    });
  });

  describe('warn', () => {
    it('should log a warning message', () => {
      logger.warn('Test warning message');

      expect(consoleLogSpy).toHaveBeenCalledOnce();
      expect(consoleLogSpy.mock.calls[0][0]).toContain('⚠');
      expect(consoleLogSpy.mock.calls[0][1]).toBe('Test warning message');
    });
  });

  describe('error', () => {
    it('should log an error message', () => {
      logger.error('Test error message');

      expect(consoleErrorSpy).toHaveBeenCalledOnce();
      expect(consoleErrorSpy.mock.calls[0][0]).toContain('✗');
      expect(consoleErrorSpy.mock.calls[0][1]).toBe('Test error message');
    });
  });

  describe('debug', () => {
    it('should log a debug message when DEBUG is set', () => {
      process.env.DEBUG = 'true';
      logger.debug('Test debug message');

      expect(consoleLogSpy).toHaveBeenCalledOnce();
      expect(consoleLogSpy.mock.calls[0][0]).toContain('🐛');
      expect(consoleLogSpy.mock.calls[0][1]).toBe('Test debug message');
    });

    it('should not log a debug message when DEBUG is not set', () => {
      logger.debug('Test debug message');

      expect(consoleLogSpy).not.toHaveBeenCalled();
    });
  });

  describe('spinner', () => {
    it('should start and stop spinner with success', () => {
      logger.startSpinner('Loading...');
      logger.stopSpinner(true, 'Done!');

      // Spinner methods are called internally, just verify no errors
      expect(true).toBe(true);
    });

    it('should start and stop spinner with failure', () => {
      logger.startSpinner('Loading...');
      logger.stopSpinner(false, 'Failed!');

      // Spinner methods are called internally, just verify no errors
      expect(true).toBe(true);
    });

    it('should handle stopSpinner when no spinner is active', () => {
      logger.stopSpinner(true, 'Done!');

      // Should not throw error
      expect(true).toBe(true);
    });

    it('should stop existing spinner when starting a new one', () => {
      logger.startSpinner('First spinner');
      logger.startSpinner('Second spinner');

      // Should not throw error
      expect(true).toBe(true);
    });
  });

  describe('box', () => {
    it('should display a formatted box with title and content', () => {
      logger.box('Test Title', ['Line 1', 'Line 2', 'Line 3']);

      expect(consoleLogSpy).toHaveBeenCalled();
      const calls = consoleLogSpy.mock.calls.map((call) => call.join(' '));
      const output = calls.join('\n');

      expect(output).toContain('Test Title');
      expect(output).toContain('Line 1');
      expect(output).toContain('Line 2');
      expect(output).toContain('Line 3');
      expect(output).toContain('┌');
      expect(output).toContain('└');
      expect(output).toContain('│');
    });

    it('should handle empty content array', () => {
      logger.box('Empty Box', []);

      expect(consoleLogSpy).toHaveBeenCalled();
      const calls = consoleLogSpy.mock.calls.map((call) => call.join(' '));
      const output = calls.join('\n');

      expect(output).toContain('Empty Box');
      expect(output).toContain('┌');
      expect(output).toContain('└');
    });

    it('should handle content with varying line lengths', () => {
      logger.box('Title', ['Short', 'Much longer line here', 'Mid']);

      expect(consoleLogSpy).toHaveBeenCalled();
      const calls = consoleLogSpy.mock.calls.map((call) => call.join(' '));
      const output = calls.join('\n');

      expect(output).toContain('Title');
      expect(output).toContain('Short');
      expect(output).toContain('Much longer line here');
      expect(output).toContain('Mid');
    });
  });
});
