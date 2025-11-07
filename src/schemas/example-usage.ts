/**
 * Example usage of the Chrome manifest schema
 * This file demonstrates how to use the schema for validation
 */

import { chromeManifestSchema, getFieldDescription, getRequiredFields } from './index.js';

// Example 1: Get required fields
console.log('Required manifest fields:', getRequiredFields());
// Output: ['manifest_version', 'name', 'version']

// Example 2: Get field descriptions for helpful error messages
console.log('Description for "name":', getFieldDescription('name'));
// Output: "The name of the extension"

console.log('Description for "version":', getFieldDescription('version'));
// Output: "One to four dot-separated integers identifying the version of this extension."

// Example 3: Using with AJV (JSON Schema validator)
// Uncomment if you install ajv: npm install ajv
/*
import Ajv from 'ajv';

const ajv = new Ajv();
const validate = ajv.compile(chromeManifestSchema);

const manifest = {
  manifest_version: 3,
  name: "My Extension",
  version: "1.0.0",
  action: {
    default_popup: "popup.html"
  }
};

const valid = validate(manifest);
if (!valid) {
  console.error('Validation errors:', validate.errors);
} else {
  console.log('Manifest is valid!');
}
*/

// Example 4: Checking manifest version specific fields
const v2Fields = ['browser_action', 'page_action', 'background.page'];
const v3Fields = ['action', 'background.service_worker', 'host_permissions'];

console.log('\nManifest V2 specific fields:', v2Fields);
console.log('Manifest V3 specific fields:', v3Fields);

// Example 5: Schema metadata
console.log('\nSchema information:');
console.log('Schema ID:', chromeManifestSchema.$id);
console.log('Schema version:', chromeManifestSchema.$schema);
console.log('Supported manifest versions:', [2, 3]);
