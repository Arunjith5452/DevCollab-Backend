import { validate } from "deep-email-validator";

export async function validateEmail(email: string) {
  const { valid } = await validate({
    email,
    validateRegex: true, 
    validateMx: true,    
    validateTypo: true, 
    validateSMTP: false, 
  });

  return valid;
}
