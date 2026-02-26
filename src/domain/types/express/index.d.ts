
declare global {
    namespace Express {
        interface Request {
            user: {
                userId: string,
                email: string,
                username: string,
                profileImage:string,
                role: string,
                iat?: number;
                exp?: number;
            }
        }
    }
}
export { }