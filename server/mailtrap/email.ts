import { generatePasswordResetEmailHtml, generateResetSuccessEmailHtml, generateWelcomeEmailHtml, htmlContent } from "./htmlEmail.ts";
import { client, sender } from "./mailtrap.ts";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 587,
    auth: {
      user: "37e36c476a8f4b",
      pass: "8c6b0c40d4b3d9",
    },
  });
  

export const sendVerificationEmail = async (email: string, verificationToken: string) => {
    const recipient = [{ email }];
    console.log(recipient);
    // console.log("client",client);
    // console.log("sender",sender);
    console.log("verification Token:",verificationToken);
    // try {
    //     const res = await client.send({
    //         from: sender,
    //         to: recipient,
    //         subject: 'Verify your email',
    //         html:htmlContent.replace("{verificationToken}", verificationToken),
    //         category: 'Email Verification'
    //     });
    //     return res;
    // } catch (error) {
    //     console.log(error);
    //     throw new Error("Failed to send email verification")

    // }
//     client
//   .send({
//     from: sender,
//     to: recipient,
//     subject: "You are awesome!",
//     text: "Congrats for sending test email with Mailtrap!",
//     category: "Integration Test",
//   })
//   .then(console.log, console.error);
await transporter.sendMail({
    from: '"MadhukarEats" <madhukar@yourdomain.com>',
    to: email,
    subject: "Verify your email",
    html: `<p>Click <a href="https://yourdomain.com/verify?token=${verificationToken}">here</a> to verify.</p>`,
  });
}

export const sendWelcomeEmail = async (email: string, name: string) => {
    const recipient = [{ email }];
    // const htmlContent = generateWelcomeEmailHtml(name);
    // try {
    //     const res = await client.send({
    //         from: sender,
    //         to: recipient,
    //         subject: 'Welcome to MadhukarEats',
    //         html:htmlContent,
    //         template_variables:{
    //             company_info_name:"MadhukarEats",
    //             name:name
    //         }
    //     });
    // } catch (error) {
    //     console.log(error);
    //     throw new Error("Failed to send welcome email")
    // }
    await transporter.sendMail({
        from: '"MadhukarEats" <madhukar@yourdomain.com>',
        to: email,
        subject: "Verify your email",
        html: `<p>you are verified</p>`,
      });
}

export const sendPasswordResetEmail = async (email:string, resetURL:string) => {
    const recipient = [{ email }];
    const htmlContent = generatePasswordResetEmailHtml(resetURL);
    try {
        const res = await client.send({
            from: sender,
            to: recipient,
            subject: 'Reset your password',
            html:htmlContent,
            category:"Reset Password"
        });
    } catch (error) {
        console.log(error);
        throw new Error("Failed to reset password")
    }
}

export const sendResetSuccessEmail = async (email:string) => {
    const recipient = [{ email }];
    const htmlContent = generateResetSuccessEmailHtml();
    try {
        const res = await client.send({
            from: sender,
            to: recipient,
            subject: 'Password Reset Successfully',
            html:htmlContent,
            category:"Password Reset"
        });
    } catch (error) {
        console.log(error);
        throw new Error("Failed to send password reset success email");
    }
}
