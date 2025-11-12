export type AuthResult = {
    userId?:string,
    accessToken:string,
    refreshToken:string,
    role:string[],
    message:string,
}