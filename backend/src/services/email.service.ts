// EASY-TRACABILITY: backend/src/services/email.service.ts
import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendResetPasswordEmail = async (
  to: string,
  resetToken: string,
  username: string // 👈 Ajouté
) => {
  const resetUrl = `http://localhost:3000/reset-password/${resetToken}`;

  // Charger le template
  const templatePath = path.join(
    __dirname,
    "../templates/reset-password.template.html"
  );
  let htmlContent = fs.readFileSync(templatePath, "utf-8");

  // Remplacer les variables dynamiques
  htmlContent = htmlContent
    .replace("{{RESET_LINK}}", resetUrl)
    .replace("{{RESET_TOKEN}}", resetToken)
    .replace("{{USERNAME}}", username);

  const mailOptions = {
    from: '"Easy Tracability" <easytracability@gmail.com>',
    to,
    subject: "Réinitialisation de votre mot de passe",
    html: htmlContent,
  };

  await transporter.sendMail(mailOptions);
};
