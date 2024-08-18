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
 * Handler for the 'list' command.
 */
export async function listCommand() {
  console.log('Available Docker mirror sources:');

  for (const [name, url] of Object.entries(sources)) {
    const clearSpinner = showSpinner();
    
    const available = await isSourceAvailable(url);

    clearSpinner();
    
    const status = available ? 'Available' : 'Unavailable';
    const color = available ? chalk.green : chalk.red;
    console.log(`- ${color(name)}: ${chalk.blue(url)} (${status})`);
  }
}
