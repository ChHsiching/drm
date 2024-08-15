// fs - file system methods
import { promises as fs } from "fs";
// path - utilities for working with file and directory paths
import path from "path";

// Path to the Docker daemon configuration file
const DAEMON_JSON_PATH = '/etc/docker/daemon.json';

/**
 * Reads the current Docker configuration.
 *
 * @returns {object} - The current Docker configuration.
 */
export async function getDockerConfig() {
  try {
    // Check if the configuration file exists
    await fs.access(DAEMON_JSON_PATH);
    // Read and parse the existing Docker configuration file
    return JSON.parse(await fs.readFile(DAEMON_JSON_PATH, 'utf-8'));
  } catch (error) {
    if (error.code === 'ENOENT') {
      // If the file does not exist, return an empty object
      return {}
    }
  }
  // For other errors, log them and return an empty object
  console.error('Error reading Docker configuration:', error);
  return {};
}

/**
 * Creates a default Docker configuration file if it doesn't exist.
 */
async function createDefaultConfig() {
  try {
    const defaultConfig = {};
    await fs.writeFile(DAEMON_JSON_PATH, JSON.stringify(defaultConfig, null, 2), 'utf-8');
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
export function setDockerMirror(mirrorUrl) {
  // Get the current Docker configuration
  const config = getDockerConfig();
  // Update the 'registry-mirrors' field with the new mirror URL
  config['registry-mirrors'] = [mirrorUrl];
  // Write the updated configuration back to the file
  // stringify() :
  // 1. config : converts the JS object "config" into a formatted JSON string.
  // 2. null : not using a replacement function or array
  // 3. 2 : using two spaces for indentation
  fs.writeFileSync(DAEMON_JSON_PATH, JSON.stringify(config, null, 2), 'utf-8');
  console.log(`Docker mirror set to ${mirrorUrl}. Please restart Docker to apply changes.`);
}

