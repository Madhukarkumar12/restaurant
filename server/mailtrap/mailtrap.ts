import { MailtrapClient } from "mailtrap"
// import dotenv from "dotenv";

// dotenv.config();
 
// export const client = new MailtrapClient({token: process.env.MAILTRAP_API_TOKEN! });
const TOKEN = "a2cf61ece00275bdd504bca18de96813";
export const client = new MailtrapClient({
  token: TOKEN,
  testInboxId: 3637018,
});

export const sender = {
  email: "hello@demomailtrap.co",
  name: "MadhukarEats",
};