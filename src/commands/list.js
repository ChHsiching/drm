import fs from "fs";
import path from 'path';
import axios from 'axios';
import chalk from 'chalk';
import { sources } from "../sources/sourceList.js";

/**
 * Checks if a source URL is available by making a simple HTTP reques url - The URL of the Docker mirror source.
 * @param {string} url - The URL of the Docker mirror source.
 * @returns {Promise<boolean>} - Resolves to true if the source is available, otherwise false.
 */
async function isSourceAvailable(url) {
  try {
    const response = await axios.head(url);
    return response.status >= 200 && response.status < 400;
  } catch (error) {
    return false;
  }
}

/**
 * Shows a spinning loader animation.
 * @param {number} [interval=100] - Interval in milliseconds to update the spinner.
 * @returns {function} - Function to clear the spinner animation.
 */
function showSpinner(interval = 100) {
  const spinnerChars = ['|', '/', '-', '\\'];
  let spinnerIndex = 0;

  const spinnerInterval = setInterval(() => {
    process.stdout.write(`\r${spinnerChars[spinnerIndex]} Checking...`);
    spinnerIndex = (spinnerIndex + 1) % spinnerChars.length;
  }, interval);

  return () => {
    clearInterval(spinnerInterval);
    process.stdout.write('\r');
  };
}

/**
 * Clears the spinner animation.
 * @param {number} spinnerInterval - The interval ID of the spinner animation.
 */
// function clearSpinner(spinnerInterval) {
//   clearInterval(spinnerInterval);
//   process.stdout.write('\rDone! \n');
// }

/**
 * Reads Docker's daemon.json file and returns the list of registry mirrors.
 * @returns {string[]} - An array of registry mirror URLs.
 */
function getConfiguredMirrors() {
  const daemonJsonPath = path.resolve('/etc/docker/daemon.json');

  if (!fs.existsSync(daemonJsonPath)) {
    return [];
  }

  const fileContent = fs.readFileSync(daemonJsonPath, 'utf-8');
  const config = JSON.parse(fileContent);
  return config['registry-mirrors'] || [];
}

/**
 * Handler for the 'list' command.
 */
export async function listCommand() {
  console.log('Available Docker mirror sources:');

  const sourceEntries = Object.entries(sources);
  const maxNameLength = Math.max(...sourceEntries.map(([name]) => name.length));

  const configuredMirrors = getConfiguredMirrors();

  for (const [name, url] of sourceEntries) {
    // Show spiner animation
    const clearSpinner = showSpinner();
    // Check if source is available
    const available = await isSourceAvailable(url);
    // Clear spinner animation
    clearSpinner();
    
    const status = available ? 'Available' : 'Unavailable';
    const isCurrentSource = configuredMirrors.includes(url);
    const nameColor = isCurrentSource ? chalk.cyan.bold : (available ? chalk.green : chalk.red);
    // const color = available ? chalk.green : chalk.red;
    const arrow = isCurrentSource ? chalk.cyan.bold('->  ') : '    ';

    // console.log(`- ${color(name)}: ${chalk.blue(url)} (${status})`);
    // console.log(`- ${color(name.padEnd(maxNameLength))}: ${chalk.blue(url)} (${status})`);
    
    // Print each source with its availability status
    console.log(`${arrow}${nameColor(name.padEnd(maxNameLength))}: ${chalk.blue(url)} (${status})`);
  }
}
