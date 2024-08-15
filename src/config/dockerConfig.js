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
export function getDockerConfig() {
  if (fs.existsSync(DAEMON_JSON_PATH)) {
    // Read and parse the existing Docker configuration file
    return JSON.parse(fs.readFileSync(DAEMON_JSON_PATH, 'utf-8'));
  }
  // Return an empty object if the file does not exist
  return {};
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

