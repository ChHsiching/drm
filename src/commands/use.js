import { setDockerMirror } from "../config/dockerConfig.js";
import { sources } from "../sources/sourceList.js";
import { validateSource } from "../utils/validation.js";

/**
 * Handler for the 'use' command.
 *
 * @param {string} sourceName - The name of the source to switch to.
 */
export async function useCommand(sourceName) {
  // Retrieve the URL for the specified source name
  const mirrorUrl = sources[sourceName];

  // Check if the source exists in the predefined list
  if (!mirrorUrl) {
    console.error(`Source ${sourceName} not found. Available sources: ${Object.keys(sources).join(', ')}`);
    return;
  }

  // Validate if the source URL is reachable
  const isValid = await validateSource(mirrorUrl);
  if (isValid) {
    // Update the Docker configuration with the new mirror URL
    setDockerMirror(mirrorUrl);
  } else {
    console.error(`Source ${mirrorUrl} is not reachable.`);
  }
}
