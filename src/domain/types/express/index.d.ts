
declare global {
    namespace Express {
        interface Request {
            user: {
                userId: string,
                email: string,
                username: string,
                role: string,
                iat?: number;
                exp?: number;
            }
        }
    }
}
export { }