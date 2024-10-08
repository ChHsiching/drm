// exec - exec shell command such as call sudo permissions
import { exec } from 'child_process';
// promisify - convert function to return a promise
import { promisify } from 'util';
// fs - file system methods
import { promises as fs } from "fs";
// path - utilities for working with file and directory paths
import path from "path";
import chalk from 'chalk';

// Convert exec to return a promise
const execPromise = promisify(exec);

// Path to the Docker daemon configuration file
const DAEMON_JSON_PATH = '/etc/docker/daemon.json';
const TEMP_JSON_PATH = '/tmp/daemon.json.tmp';
const DAEMON_DIR_PATH = path.dirname(DAEMON_JSON_PATH);

/**
 * Executes a command with sudo privileges.
 *
 * @param {string} command - The command to execute.
 * @returns {Promise<void>}
 */
async function runWithSudo(command) {
  try {
    await execPromise(`sudo ${command}`);
  } catch (error) {
    console.error('Error executing command with sudo:', error);
  }
}

/**
 * Reads the current Docker configuration.
 *
 * @returns {object} - The current Docker configuration.
 */
// export async function getDockerConfig() {
//  try {
//    // Check if the configuration file exists
//    await fs.access(DAEMON_JSON_PATH);
//    // Read and parse the existing Docker configuration file
//    return JSON.parse(await fs.readFile(DAEMON_JSON_PATH, 'utf-8'));
//  } catch (error) {
//    if (error.code === 'ENOENT') {
//      // If the file does not exist, return an empty object
//      return {}
//    }
//  }
//  // For other errors, log them and return an empty object
//  console.error('Error reading Docker configuration:', error);
//  return {};
//}

/**
 * Creates the directory for Docker configuration if it doesn't exist.
 */
async function ensureConfigDirectory() {
  try {
    await runWithSudo(`mkdir -p ${DAEMON_DIR_PATH}`);
    // await fs.mkdir(DAEMON_DIR_PATH, { recursive: true });
    console.log(`Directory ${DAEMON_DIR_PATH} ensured.`);
  } catch (error) {
    console.error('Error creating Docker configuration directory:', error);
  }
}

/**
 * Creates a default Docker configuration file if it doesn't exist.
 */
async function createDefaultConfig() {
  try {
    await ensureConfigDirectory();
    const defaultConfig = {};
    await runWithSudo(`bash -c 'echo "${JSON.stringify(defaultConfig, null, 2)}" > ${DAEMON_JSON_PATH}'`);
    // await fs.writeFile(DAEMON_JSON_PATH, JSON.stringify(defaultConfig, null, 2), 'utf-8');
    console.log(`Default Docker configuration file created at ${DAEMON_JSON_PATH}`);
  } catch (error) {
    console.error('Error creating Docker configuration file:', error);
  }
}

/**
 * Sets the Docker mirror URL in the configuration file.
 *
 * @param {string} mirrorUrl - The URL of the Docker mirror to set.
 */
//export async function setDockerMirror(mirrorUrl) {
//  try {
//    let config = await getDockerConfig();
//
//    // If the configuration file does not exist, create a default one
//    if (Object.keys(config).length === 0) {
//      await createDefaultConfig();
//      config = await getDockerConfig(); // Re-read the config after creation
//    }
//
//    // Update the 'registry-mirrors' field with the new mirror URL
//    config['registry-mirrors'] = [mirrorUrl];
//    // Write the updated configuration back to the file
//    // stringify() :
//    // 1. config : converts the JS object "config" into a formatted JSON string.
//    // 2. null : not using a replacement function or array
//    // 3. 2 : using two spaces for indentation
//    await runWithSudo(`bash -c 'echo "${JSON.stringify(config, null, 2)}" > ${DAEMON_JSON_PATH}'`);
//    // await fs.writeFile(DAEMON_JSON_PATH, JSON.stringify(config, null, 2), 'utf-8');
//    console.log(`Docker mirror set to ${mirrorUrl}. Please restart Docker to apply changes.`);
//  } catch (error) {
//    console.error('Error setting Docker mirror:', error);
//  }
//}
export async function setDockerMirror(mirrorUrl) {
  try {
    await createDefaultConfig();
    const config = { 'registry-mirrors': [mirrorUrl] };
    const jsonString = JSON.stringify(config, null, 2);
    await fs.writeFile(TEMP_JSON_PATH, jsonString, 'utf-8');
    // const command = `printf '%s' '${jsonString.replace(/'/g, "'\\''")}' > ${DAEMON_JSON_PATH}`;
    const command = `sudo mv ${TEMP_JSON_PATH} ${DAEMON_JSON_PATH}`;
    await runWithSudo(command);
    // console.log(`Docker mirror set to ${mirrorUrl}. Please restart Docker to apply changes.`);  
    console.log(chalk.green(`Docker mirror set to ${chalk.cyan(mirrorUrl)}.`));
    console.log('\nTo apply the changes, you need to restart the Docker daemon. Use the following command to restart Docker:\n');
    console.log(chalk.blue(' $ sudo systemctl restart docker\n'));
    console.log(chalk.gray('If you are using a different init system or platform, use the appropriate command to restart Docker.'));
    console.log(chalk.yellow('Please note that restarting Docker will affect running containers. Ensure that you have saved all necessary work before restarting.'));
  } catch (error) {
    console.error('Error setting Docker mirror:', error);
  }
}

