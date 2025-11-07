#!/usr/bin/env node

/**
 * CLI entry point
 * Parses command-line arguments and executes commands
 */

import { createProgram } from './program.js';
import { getExitCode, isBToolsError } from '../utils/errors.js';
import { logger } from '../utils/logger.js';

async function main() {
  try {
    const program = createProgram();
    await program.parseAsync(process.argv);
  } catch (error) {
    // Handle errors gracefully
    if (isBToolsError(error)) {
      logger.error(error.message);
      
      // Show context in debug mode
      if (process.env.DEBUG && error.context) {
        console.error('\nContext:', error.context);
      }
      
      process.exit(getExitCode(error));
    } else if (error instanceof Error) {
      logger.error(error.message);
      
      // Show stack trace in debug mode
      if (process.env.DEBUG) {
        console.error('\nStack trace:', error.stack);
      }
      
      process.exit(1);
    } else {
      logger.error('An unknown error occurred');
      process.exit(1);
    }
  }
}

main();
