export const MESSAGES = {
    AUTH: {
        SUCCESS: {
            LOGIN: "Login successful",
            REGISTER: "Registration successful",
            LOGOUT: "Logout successful",
            OTP_SENT: "OTP sent successfully",
            OTP_VERIFIED: "OTP verified successfully",
        },
        ERROR: {
            INVALID_CREDENTIALS: "Invalid credentials",
            USER_NOT_FOUND: "User not found",
            EMAIL_ALREADY_EXISTS: "Email already exists",
            INVALID_OTP: "Invalid or expired OTP",
            UNAUTHORIZED: "Unauthorized access",
            REGISTRATION_FAILED: "Registration failed",
            OTP_VERIFICATION_FAILED: "Otp verification failed",
            FORGOT_OTP_VERIFICATION_FAILED: "VerifiyForgotOtp failed",
            LOGIN_FAILED: "Login failed",
            REFRESH_TOKEN_FAILED: "RefreshToken failed",
            RESEND_OTP_FAILED: "Resend otp failed",
            FORGOT_PASSWORD_FAILED: "forgotPassword failed",
            RESET_PASSWORD_FAILED: "reset password failed",
            GOOGLE_AUTH_FAILED: "Gogle Authentication failed",
            GITHUB_AUTH_FAILED: "GitHub Authentication failed",
            LOGOUT_FAILED: "Logout failed",
        }
    },
    USER: {
        SUCCESS: {
            PROFILE_UPDATED: "Profile updated successfully",
            AVATAR_UPLOADED: "Avatar uploaded successfully",
            GITHUB_CONNECTED: "GitHub account connected successfully",
        },
        ERROR: {
            NOT_FOUND: "User not found",
            PROFILE_ERROR: "userProfile error",
            UPDATE_FAILED: "updteUserProfile failed",
            GITHUB_TOKEN_REQUIRED: "GitHub access token is required",
            GITHUB_CONNECT_FAILED: "Failed to connect GitHub account",
        }
    },
    ADMIN: {
        SUCCESS: {
            USER_STATUS_UPDATED: "User status updated successfully",
        },
        ERROR: {
            FETCH_USERS_FAILED: "Failed to fetch users",
            UPDATE_USER_FAILED: "Failed to update users",
            FETCH_PROJECTS_FAILED: "Failed to fetch projects",
        }
    },
    MEETING: {
        SUCCESS: {
            SCHEDULED: "Meeting scheduled successfully",
            FETCHED: "Meetings fetched successfully",
            STATUS_UPDATED: "Meeting status updated successfully",
        },
        ERROR: {
            SCHEDULE_FAILED: "Failed to schedule meeting",
            FETCH_FAILED: "Failed to fetch meetings",
            UPDATE_STATUS_FAILED: "Failed to update meeting status",
        }
    },
    FILE: {
        ERROR: {
            SIGNED_URL_FAILED: "signedUrl went wrong",
        }
    },
    PROJECT: {
        SUCCESS: {
            CREATED: "Project created successfully",
            UPDATED: "Project updated successfully",
            DELETED: "Project deleted successfully",
            JOINED: "Joined project successfully",
            APPLICATIONS_FETCHED: "Pending applications fetched",
            MEMBERS_FETCHED: "Members fetched successfully",
        },
        ERROR: {
            NOT_FOUND: "Project not found",
            ALREADY_MEMBER: "Already a member of this project",
            CREATION_FAILED: "Project creation failed",
            EDIT_FAILED: "Edit Project failed",
            FETCH_EDIT_FAILED: "fetch Edit Project failed",
            USERS_FETCH_FAILED: "Failed to fetch users",
            DETAILS_FAILED: "Project details failed",
            APPLY_FAILED: "applyProject details failed",
            APPLICATIONS_FETCH_FAILED: "Failed to fetch applications",
            APPROVE_APPLICATION_FAILED: "Failed to approve application",
            REJECT_APPLICATION_FAILED: "Failed to reject application",
            LOAD_CREATED_FAILED: "Failed to load created project",
            LOAD_APPLIED_FAILED: "Failed to load applied projects",
            LOAD_MEMBERS_FAILED: "Failed to load project members",
            DISABLE_FAILED: "Failed to disable project",
        }
    },
    TASK: {
        SUCCESS: {
            CREATED: "Task created successfully",
            UPDATED: "Task updated successfully",
            DELETED: "Task deleted successfully",
            COMMENT_ADDED: "Comment added successfully",
            STARTED: "Task started successfully",
            SUBMITTED: "Task submited successfully",
            APPROVED: "Task approval successfull",
            REQUEST_IMPROVEMENT: "Task request-improvement successfull",
        },
        ERROR: {
            NOT_FOUND: "Task not found",
            CREATION_FAILED: "Task creation failed",
            FETCH_FAILED: "Failed to fetch tasks",
            CONTRIBUTORS_FETCH_FAILED: "Failed to fetch Project contributers",
            COMMENT_FAILED: "Failed to add comment",
            START_FAILED: "Failed to start task",
            SUBMIT_FAILED: "Failed to submit task",
            APPROVAL_FAILED: "Failed to task approval",
            REQUEST_IMPROVEMENT_FAILED: "Failed to task request-improvement",
        }
    },
    PAYMENT: {
        SUCCESS: {
            PROCESSED: "Payment processed successfully",
            CHECKOUT_SESSION_CREATED: "Checkout session created",
            WEBHOOK_RECEIVED: "Webhook received",
        },
        ERROR: {
            FAILED: "Payment failed",
            CHECKOUT_SESSION_FAILED: "Failed to create checkout session",
            WEBHOOK_FAILED: "Webhook processing failed",
            MISSING_SIGNATURE: "Missing stripe-signature header",
        }
    },
    COMMON: {
        ERROR: {
            INTERNAL_SERVER: "Internal server error",
            INVALID_INPUT: "Invalid input data",
            FORBIDDEN: "Forbidden access",
        }
    }
};
