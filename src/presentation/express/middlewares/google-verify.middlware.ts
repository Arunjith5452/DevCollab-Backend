import { Request, Response, NextFunction } from "express";
import { OAuth2Client } from "google-auth-library";
import { logger } from "@/infrastructure/providers/logs/logger";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const verifyGoogleToken = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { token } = req.body;
        if (!token) {
            return res.status(400).json({ message: "Google token missing" });
        }

        // Verify using Google API
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        if (!payload) {
            return res.status(401).json({ message: "Invalid Google token" });
        }

        const { email, name, sub: googleId } = payload;

        // Attach to request for next layers
        req.body.email = email;
        req.body.name = name;
        req.body.googleId = googleId;

        next();

    } catch (error) {
        logger.error("Google verification failed:", error);
        return res.status(401).json({ message: "Google verification failed" });
    }
};
