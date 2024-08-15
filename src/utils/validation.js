import axios from "axios";

/**
 * Validates if the Docker mirror URL is reachable.
 *
 * @param {stinrg} mirrorUrl - The URL of the Docker mirror to validate.
 * @returns {Promise<boolean>} - Returns true if the URL is reachable, otherwise false.
 */
export async function validateSource(mirrorUrl) {
  try {
    // Make a HEAD request to check if the URL is reachable
    await axios.head(mirrorUrl);
    return true;
  } catch (error) {
    // If there's an error (e.g., network issue, URL not reachable), return false
    return false;
  }
}
