import { validate } from "deep-email-validator"
export async function validateEmail(email: string) {
    const { valid } = await validate(email)
    return valid
}