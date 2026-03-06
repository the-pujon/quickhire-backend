/// Live Server
import nodemailer from "nodemailer";
import AppError from "../errors/AppError";
import httpStatus from "http-status";
import fs from "fs";
import path from "path";
import config from "../config";

// Setup the transporter for sending emails
export const sendEmail = async (options: any) => {
  const host = config.email_host || "smtp.gmail.com";
  const port = Number(config.email_port) || 465;
  // Port 465 = direct SSL; port 587 = STARTTLS (secure must be false)
  const secure = port === 465;

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: {
      user: config.email_user,
      pass: config.email_pass,
    },
  });

  const mailOptions = {
    from: config.email_user,
    to: options.to,
    subject: options.subject,
    text: options.text,
    // html: options.html || options.text,
    html: options.html,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending email:", error);
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Email sending failed, something went wrong!",
    );
  }

  return {
    transporter,
    mailOptions,
  };
};

export const getEmailTemplate = (
  filePath: string,
  replacements: { [key: string]: any },
) => {
  try {
    const absolutePath = path.resolve(process.cwd(), "templates", filePath);
    let template = fs.readFileSync(absolutePath, { encoding: "utf-8" });
    for (const key in replacements) {
      template = template.replace(
        new RegExp(`{{${key}}}`, "g"),
        replacements[key],
      );
    }

    return template;
  } catch (error) {
    console.error("Error reading email template:", error);
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Email template loading failed.",
    );
  }
};
