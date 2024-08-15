#!/usr/bin/env node

// commander - The complete solution for node.js command-line interfaces.
import { Command } from 'commander';
// chalk - Terminal string styling done right
import chalk from 'chalk';

// Basic CLI setup
const program = new Command();
program
  .version('1.0.0')
  .description('Docker Registry Manager (DRM)');

// Define a simple command
program
  .command('test')
  .description('Test command to verify setup')
  .action(() => {
    console.log(chalk.green('DRM setup is working!'));
  });

// Parse command-line arguments
program.parse(process.argv);
