import { validate } from "deep-email-validator";

/**
 * Validates an email address using deep-email-validator.
 * @param email - The email address to validate.
 * @returns True if valid, otherwise false.
 */
export async function validateEmail(email: string): Promise<boolean> {
  const { valid } = await validate({
    email,
    validateRegex: true,
    validateMx: true,
    validateTypo: false,
    validateSMTP: false,
  });

  return valid;
}
