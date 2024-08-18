import axios from 'axios';
import chalk from 'chalk';
import { sources } from "../sources/sourceList.js";

/**
 * Checks if a source URL is available by making a simple HTTP reques url - The URL of the Docker mirror source.
 * @param {string} url - The URL of the Docker mirror source.
 * @returns {Promis<boolean>} - Resolves to true if the source is available, otherwise false.
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
 * Handler for the 'list' command.
 */
export async function listCommand() {
  console.log('Available Docker mirror sources:');

  for (const [name, url] of Object.entries(sources)) {
    const available = await isSourceAvailable(url);
    const status = available ? 'Available' : 'Unavailable';
    const color = available ? chalk.green : chalk.red;
    console.log(`- ${color(name)}: ${chalk.blue(url)} (${status})`);
  }
}
