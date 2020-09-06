const accept = require("../utils/acceptance");
const askQuestion = require("../utils/question");

/**
 * asks for an alternative frontend url
 * @param {*} defaultValue 
 * @returns {string|undefined}
 */
async function checkAltFront(defaultValue = undefined) {
  let changeAltFront = await accept(
    `Would you like to set alternative blog-front?`,
  );
  if (changeAltFront) {
    let altFront = await askQuestion(
      `Select alternative blog-front: `,
      defaultValue,
    );
    return altFront;
  } else {
    console.log(`Using default blog-front`);
    return undefined;
  }
}

module.exports = checkAltFront;
