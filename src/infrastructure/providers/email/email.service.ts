import nodemailer, { Transporter } from 'nodemailer';
import { resolve4 } from 'dns/promises';
import { injectable } from 'inversify';
import { IEmailService } from '../interface/email.interface';
import { otpEmailTemplate } from '../templates/email/otp-email.template';
import { logger } from '../logs/logger.service';

@injectable()
export class EmailService implements IEmailService {
    private transporter: Transporter | null = null;
    private initPromise: Promise<void> | null = null;

    constructor() {
        // Start async initialization immediately but don't block the constructor
        this.initPromise = this.initTransporter();
    }

    /**
     * Resolve smtp.gmail.com to an IPv4 address and create the transporter.
     * This bypasses Render's broken IPv6 routing by giving nodemailer
     * a raw IPv4 address so it never attempts an IPv6 connection.
     */
    private async initTransporter(): Promise<void> {
        try {
            // Explicitly resolve to IPv4 only — bypasses all DNS/IPv6 issues
            const ipv4Addresses = await resolve4('smtp.gmail.com');
            const smtpHost = ipv4Addresses[0];
            logger.info(`Resolved smtp.gmail.com to IPv4: ${smtpHost}`);

            this.transporter = nodemailer.createTransport({
                host: smtpHost,          // Raw IPv4 address — no DNS lookup needed
                port: 587,
                secure: false,           // STARTTLS (upgrades after connect)
                requireTLS: true,
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS
                },
                tls: {
                    servername: 'smtp.gmail.com',  // Required for TLS certificate validation
                    rejectUnauthorized: true
                }
            });

            await this.transporter.verify();
            logger.info('Email service is ready to send emails');
        } catch (error) {
            logger.error('Email service configuration error:', error);
            // Don't throw — let individual email sends report the error
        }
    }

    /**
     * Get the transporter, waiting for initialization if needed
     */
    private async getTransporter(): Promise<Transporter> {
        await this.initPromise;
        if (!this.transporter) {
            // Retry initialization if the first attempt failed
            await this.initTransporter();
        }
        if (!this.transporter) {
            throw new Error('Email service is not available');
        }
        return this.transporter;
    }

    /**
     * Send OTP verification email
     * @param email - Recipient email address
     * @param otp - One-time password code
     * @param expiryMinutes - OTP expiry time in minutes (default: 3)
     */
    async sendOtpEmail(email: string, otp: number, expiryMinutes: number = 3): Promise<void> {
        try {
            const transporter = await this.getTransporter();
            const htmlContent = otpEmailTemplate(otp, expiryMinutes);

            await transporter.sendMail({
                from: `"DevCollab" <${process.env.EMAIL_USER}>`,
                to: email,
                subject: 'Your DevCollab Verification Code',
                html: htmlContent,
                text: `Your DevCollab verification code is: ${otp}. This code will expire in ${expiryMinutes} minutes. Never share this code with anyone.`
            });

            logger.info(`📧 OTP email sent successfully to ${email}`);
        } catch (error) {
            logger.error(`❌ Failed to send OTP email to ${email}:`, error);
            throw new Error('Failed to send verification email. Please try again later.');
        }
    }

    /**
     * Send welcome email to new users
     * @param email - Recipient email address
     * @param name - User's name
     */
    async sendWelcomeEmail(email: string, name: string): Promise<void> {
        try {
            const transporter = await this.getTransporter();
            await transporter.sendMail({
                from: `"DevCollab" <${process.env.EMAIL_USER}>`,
                to: email,
                subject: 'Welcome to DevCollab!',
                text: `Welcome ${name}! Thank you for joining DevCollab.`
            });

            logger.info(`Welcome email sent successfully to ${email}`);
        } catch (error) {
            logger.error(`Failed to send welcome email to ${email}:`, error);
        }
    }

    /**
     * Send password reset email
     * @param email - Recipient email address
     * @param resetLink - Password reset link
     */
    async sendPasswordResetEmail(email: string, resetLink: string): Promise<void> {
        try {
            const transporter = await this.getTransporter();
            await transporter.sendMail({
                from: `"DevCollab" <${process.env.EMAIL_USER}>`,
                to: email,
                subject: 'Reset Your DevCollab Password',
                text: `Click the following link to reset your password: ${resetLink}`
            });

            logger.info(`Password reset email sent successfully to ${email}`);
        } catch (error) {
            logger.error(`Failed to send password reset email to ${email}:`, error);
            throw new Error('Failed to send password reset email. Please try again later.');
        }
    }
}
