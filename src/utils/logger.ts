import chalk from 'chalk';
import ora, { Ora } from 'ora';

/**
 * Logger utility for consistent terminal output with colors and spinners
 * Provides methods for different log levels and formatted output
 */
export class Logger {
  private spinner: Ora | null = null;

  /**
   * Log an informational message
   */
  info(message: string): void {
    console.log(chalk.blue('ℹ'), message);
  }

  /**
   * Log a success message
   */
  success(message: string): void {
    console.log(chalk.green('✓'), message);
  }

  /**
   * Log a warning message
   */
  warn(message: string): void {
    console.log(chalk.yellow('⚠'), message);
  }

  /**
   * Log an error message
   */
  error(message: string): void {
    console.error(chalk.red('✗'), message);
  }

  /**
   * Log a debug message
   */
  debug(message: string): void {
    if (process.env.DEBUG) {
      console.log(chalk.gray('🐛'), message);
    }
  }

  /**
   * Start a spinner with a message
   */
  startSpinner(message: string): void {
    if (this.spinner) {
      this.spinner.stop();
    }
    this.spinner = ora(message).start();
  }

  /**
   * Stop the spinner with a success or failure message
   */
  stopSpinner(success: boolean, message: string): void {
    if (!this.spinner) {
      return;
    }

    if (success) {
      this.spinner.succeed(message);
    } else {
      this.spinner.fail(message);
    }

    this.spinner = null;
  }

  /**
   * Display a formatted box with title and content
   */
  box(title: string, content: string[]): void {
    const maxLength = Math.max(
      title.length,
      ...content.map((line) => line.length)
    );
    const width = maxLength + 4;
    const horizontalLine = '─'.repeat(width - 2);

    console.log();
    console.log(chalk.cyan(`┌${horizontalLine}┐`));
    console.log(
      chalk.cyan('│') +
        ' ' +
        chalk.bold(title) +
        ' '.repeat(width - title.length - 2) +
        chalk.cyan('│')
    );
    console.log(chalk.cyan(`├${horizontalLine}┤`));

    for (const line of content) {
      console.log(
        chalk.cyan('│') +
          ' ' +
          line +
          ' '.repeat(width - line.length - 2) +
          chalk.cyan('│')
      );
    }

    console.log(chalk.cyan(`└${horizontalLine}┘`));
    console.log();
  }
}

/**
 * Default logger instance
 */
export const logger = new Logger();
