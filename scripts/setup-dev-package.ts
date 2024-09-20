/**
 *
 * setup-package.js
 *
 * This file is used by publish system to build a clean npm package with the compiled js files in the root of the package.
 * It will not be included in the npm package.
 *
 **/

import fs from 'fs';
import lodash from 'lodash';

// This script is called from within the build folder. It is important to include it in .npmignore, so it will not get published.
const sourceDirectory = __dirname + '/../';
const destinationDirectory = sourceDirectory + './dist';

function main() {
  // Generate publish-ready package.json
  const source = fs
    .readFileSync(sourceDirectory + "/package.json")
    .toString("utf-8");
  const sourceObj = JSON.parse(source);
  sourceObj.scripts = {};
  sourceObj.devDependencies = {};
  sourceObj.files = undefined;
  sourceObj.exports = Object.keys(sourceObj.exports).reduce((acc: any, key: string) => {
    if (lodash.isString(sourceObj.exports[key])) {
      acc[key] = sourceObj.exports[key].replace("dist/", "");
    } else if (lodash.isObject(sourceObj.exports[key])) {
      acc[key] = Object.keys(sourceObj.exports[key]).reduce((acc_nested: any, key_nested: string) => {
        if (lodash.isString(sourceObj.exports[key][key_nested])) {
          acc_nested[key_nested] = sourceObj.exports[key][key_nested].replace("dist/", "");
        } else {
          acc_nested[key_nested] = sourceObj.exports[key][key_nested];
        }
        return acc_nested;
      }, {});
    } else {
      acc[key] = sourceObj.exports[key];
    }
    return acc;
  }, {});
  fs.writeFileSync(
    `${destinationDirectory}/package.json`,
    Buffer.from(JSON.stringify(sourceObj, null, 2), "utf-8")
  );
}

main();
