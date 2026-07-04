import nodemailer from "nodemailer"




const transporter = nodemailer.createTransport({
    host:process.env.MAILTRAP_HOST,
    port:Number(process.env.PORT),
    auth:{
        user:process.env.MAILTRAP_USER,
        pass:process.env.MAILTRAP_PASS,
    },
})
export default transporter