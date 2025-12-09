// import { sendOtpEmail } from "@/shared/utils/sent-otp.util"
// import { Transporter } from "nodemailer"

// export class EmailProvider { // don't forgot to mention implement interface okey don't forget idot and bullshit
//     private _transporter: Transporter

//     constructor() {
//         this._transporter = sendOtpEmail()
//     }

//     async sendMail(email: string, otp: string) {
//         await this._transporter.sendMail({
//             from: `"DevCollab" <${process.env.USER}>`,
//             to: email,
//             subject: "Your OTP Code",
//             text: `Your OTP is: ${otp}. it expires in 3 minute`
//         })
//     }
// }