import { sources } from "../sources/sourceList.js";

/**
 * Handler for the 'list' command.
 */
export function listCommand() {
  console.log('Available Docker mirror sources:');
  for (const [name, url] of Object.entries(sources)) {
    console.log(`- ${name}: ${url}`);
  }
}
