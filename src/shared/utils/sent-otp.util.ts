import nodemailer from 'nodemailer'

export async function sendOtpEmail(email:string,otp:Number){
    
    const transporter = nodemailer.createTransport({
        service:"Gmail",
        auth:{
          user:process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
    })

    await transporter.sendMail({
        from:`"DevCollab" <${process.env.USER}>`,
        to:email,
        subject:"Your OTP Code",
        text:`Your OTP is: ${otp}. it expires in 3 minute`
    })  

}