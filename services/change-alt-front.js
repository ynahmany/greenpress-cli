const fs = require("fs");

/**
 * change the frontend blod front
 * @param {string} name 
 * @param {string} altFrontUrl 
 */
async function changeAltFront(name, altFrontUrl) {
  const projectPackagePath = `${process.env.PWD}/${name}/package.json`;
  const projectPackage = require(projectPackagePath);
  projectPackage.dependencies["@greenpress/blog-front"] = altFrontUrl;
  fs.writeFileSync(projectPackagePath, JSON.stringify(projectPackage, null, 2));
}

module.exports = changeAltFront;
