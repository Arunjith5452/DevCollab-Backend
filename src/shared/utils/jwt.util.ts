import jwt from 'jsonwebtoken'


const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || "access_secret"
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || "refresh_secret"

export const generateAccessToken = (payload: object) => {
    return jwt.sign(payload, ACCESS_TOKEN_SECRET, { expiresIn: "15m" })
}

export const generateRefreshToken = (payload: object) => {
    return jwt.sign(payload, REFRESH_TOKEN_SECRET, { expiresIn: "7d" })
}


/**
 * Verifies a JWT token (access or refresh) and returns the decoded payload or null if invalid.
 * @param token 
 */

export const verifyToken = (token: string, type: "access" | "refresh")=>{
    try {

        const secret = type === "access" ? ACCESS_TOKEN_SECRET : REFRESH_TOKEN_SECRET
        return  jwt.verify(token, secret)

    } catch (err) {

        let error = err as Error

         if (error.name === "TokenExpiredError") {
        console.log("Token has expired");
    } else {
        console.log("Token is invalid", error.message);
    }
        return null
    }
}
