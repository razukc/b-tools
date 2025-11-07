import { describe, it, expect } from 'vitest';
import {
  BToolsError,
  ValidationError,
  FileSystemError,
  BuildError,
  formatError,
  isBToolsError,
  getExitCode,
} from '../../../src/utils/errors.js';

describe('BToolsError', () => {
  it('should create an error with message, code, and context', () => {
    const error = new BToolsError('Test error', 'TEST_ERROR', { foo: 'bar' });

    expect(error).toBeInstanceOf(Error);
    expect(error.message).toBe('Test error');
    expect(error.code).toBe('TEST_ERROR');
    expect(error.context).toEqual({ foo: 'bar' });
    expect(error.name).toBe('BToolsError');
  });

  it('should create an error without context', () => {
    const error = new BToolsError('Test error', 'TEST_ERROR');

    expect(error.message).toBe('Test error');
    expect(error.code).toBe('TEST_ERROR');
    expect(error.context).toBeUndefined();
  });

  it('should have a stack trace', () => {
    const error = new BToolsError('Test error', 'TEST_ERROR');

    expect(error.stack).toBeDefined();
    expect(error.stack).toContain('BToolsError');
  });

  it('should be catchable as Error', () => {
    try {
      throw new BToolsError('Test error', 'TEST_ERROR');
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(BToolsError);
    }
  });
});

describe('ValidationError', () => {
  it('should create a validation error with VALIDATION_ERROR code', () => {
    const error = new ValidationError('Invalid input', { field: 'name' });

    expect(error).toBeInstanceOf(BToolsError);
    expect(error.message).toBe('Invalid input');
    expect(error.code).toBe('VALIDATION_ERROR');
    expect(error.context).toEqual({ field: 'name' });
    expect(error.name).toBe('BToolsError');
  });

  it('should create a validation error without context', () => {
    const error = new ValidationError('Invalid input');

    expect(error.message).toBe('Invalid input');
    expect(error.code).toBe('VALIDATION_ERROR');
    expect(error.context).toBeUndefined();
  });
});

describe('FileSystemError', () => {
  it('should create a file system error with FS_ERROR code', () => {
    const error = new FileSystemError('File not found', { path: '/test/file.txt' });

    expect(error).toBeInstanceOf(BToolsError);
    expect(error.message).toBe('File not found');
    expect(error.code).toBe('FS_ERROR');
    expect(error.context).toEqual({ path: '/test/file.txt' });
    expect(error.name).toBe('BToolsError');
  });

  it('should create a file system error without context', () => {
    const error = new FileSystemError('Permission denied');

    expect(error.message).toBe('Permission denied');
    expect(error.code).toBe('FS_ERROR');
    expect(error.context).toBeUndefined();
  });
});

describe('BuildError', () => {
  it('should create a build error with BUILD_ERROR code', () => {
    const error = new BuildError('Build failed', { step: 'compilation' });

    expect(error).toBeInstanceOf(BToolsError);
    expect(error.message).toBe('Build failed');
    expect(error.code).toBe('BUILD_ERROR');
    expect(error.context).toEqual({ step: 'compilation' });
    expect(error.name).toBe('BToolsError');
  });

  it('should create a build error without context', () => {
    const error = new BuildError('Build failed');

    expect(error.message).toBe('Build failed');
    expect(error.code).toBe('BUILD_ERROR');
    expect(error.context).toBeUndefined();
  });
});

describe('formatError', () => {
  it('should format error with message only', () => {
    const error = new BToolsError('Test error', 'TEST_ERROR');
    const formatted = formatError(error);

    expect(formatted).toBe('Error: Test error');
  });

  it('should format error with message and context', () => {
    const error = new BToolsError('Test error', 'TEST_ERROR', { foo: 'bar', count: 42 });
    const formatted = formatError(error);

    expect(formatted).toContain('Error: Test error');
    expect(formatted).toContain('Context:');
    expect(formatted).toContain('foo: "bar"');
    expect(formatted).toContain('count: 42');
  });

  it('should format error with empty context', () => {
    const error = new BToolsError('Test error', 'TEST_ERROR', {});
    const formatted = formatError(error);

    expect(formatted).toBe('Error: Test error');
  });
});

describe('isBToolsError', () => {
  it('should return true for BToolsError instances', () => {
    const error = new BToolsError('Test', 'TEST');
    expect(isBToolsError(error)).toBe(true);
  });

  it('should return true for ValidationError instances', () => {
    const error = new ValidationError('Test');
    expect(isBToolsError(error)).toBe(true);
  });

  it('should return true for FileSystemError instances', () => {
    const error = new FileSystemError('Test');
    expect(isBToolsError(error)).toBe(true);
  });

  it('should return true for BuildError instances', () => {
    const error = new BuildError('Test');
    expect(isBToolsError(error)).toBe(true);
  });

  it('should return false for regular Error instances', () => {
    const error = new Error('Test');
    expect(isBToolsError(error)).toBe(false);
  });

  it('should return false for non-error values', () => {
    expect(isBToolsError('string')).toBe(false);
    expect(isBToolsError(123)).toBe(false);
    expect(isBToolsError(null)).toBe(false);
    expect(isBToolsError(undefined)).toBe(false);
    expect(isBToolsError({})).toBe(false);
  });
});

describe('getExitCode', () => {
  it('should return 3 for ValidationError', () => {
    const error = new ValidationError('Test');
    expect(getExitCode(error)).toBe(3);
  });

  it('should return 2 for FileSystemError', () => {
    const error = new FileSystemError('Test');
    expect(getExitCode(error)).toBe(2);
  });

  it('should return 4 for BuildError', () => {
    const error = new BuildError('Test');
    expect(getExitCode(error)).toBe(4);
  });

  it('should return 1 for unknown BToolsError code', () => {
    const error = new BToolsError('Test', 'UNKNOWN_ERROR');
    expect(getExitCode(error)).toBe(1);
  });

  it('should return 1 for regular Error', () => {
    const error = new Error('Test');
    expect(getExitCode(error)).toBe(1);
  });

  it('should return 1 for non-error values', () => {
    expect(getExitCode('string')).toBe(1);
    expect(getExitCode(123)).toBe(1);
    expect(getExitCode(null)).toBe(1);
  });
});
