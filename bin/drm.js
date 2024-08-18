#!/usr/bin/env node

// commander - The complete solution for node.js command-line interfaces.
import { Command } from 'commander';
// chalk - Terminal string styling done right
import chalk from 'chalk';
// my custom commands
import { useCommand } from '../src/commands/use.js';
import { listCommand } from '../src/commands/list.js';


// Basic CLI setup
const program = new Command();

program
  .version('1.0.0', '-v, --version')
  .description('Docker Registry Manager (DRM)');

// Define a simple command
program
  .command('test')
  .description('Test command to verify setup')
  .action(() => {
    console.log(chalk.green('DRM setup is working!'));
  });

// Command to switch Docker mirror source
program
  .command('use <source-name>')
  .description('Switch Docker mirror source')
  .action(useCommand);

// Command to list available Docker mirror source
program
  .command('list')
  .description('List available Docker mirror sources')
  .alias('ls')
  .action(listCommand);

// Display help information on unknown commands
program
  .on('command:*', (commands) => {
    console.error(chalk.red(`Unknown command: ${commands[0]}`));
    console.error('See --help for a list of available commands.');
    program.help();
  });

// Parse command-line arguments
program.parse(process.argv);

// If no command was provided, display help information
if (process.argv.length === 2) {
  program.help();
}
