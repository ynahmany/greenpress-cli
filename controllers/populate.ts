import { askQuestion } from "../utils/question";
import { accept } from "../utils/acceptance";
import { populate } from "../services/populate";
import { blue } from "../utils/colors";

enum CredentialType {
	email = "email",
	password = "password"
}
const readCredential = async (
  credentialType: CredentialType,
  defaultValue: string
) => {
  const answer = await accept(`Would you like to select ${credentialType}?`);
  if (answer) {
		const input = await askQuestion(`Select new ${credentialType}: `, defaultValue);
		console.log(`Setting ${credentialType} to ${input}`);
		return input;
  }
  console.log(blue(`Using default ${credentialType} (${defaultValue})`));
  return defaultValue;
};

export const populateController = async() => {
  const email = await readCredential(CredentialType.email, "test@test.com");
  const password = await readCredential(CredentialType.password, "admin");

  populate(email, password);
};
