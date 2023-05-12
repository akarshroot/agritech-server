require('dotenv').config();
const nodemailer = require('nodemailer')
const { google } = require('googleapis');
const OTP = require('../models/OTP');
const OAuth2 = google.auth.OAuth2;

const createTransporter = async () => {
    const oauth2Client = new OAuth2(
        process.env.CLIENT_ID,
        process.env.CLIENT_SECRET,
        "https://developers.google.com/oauthplayground"
    );

    oauth2Client.setCredentials({
        refresh_token: process.env.REFRESH_TOKEN
    });

    const accessToken = await new Promise((resolve, reject) => {
        oauth2Client.getAccessToken((err, token) => {
            if (err) {
                reject();
            }
            resolve(token);
        });
    });

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            type: "OAuth2",
            user: process.env.EMAIL,
            accessToken,
            clientId: process.env.CLIENT_ID,
            clientSecret: process.env.CLIENT_SECRET,
            refreshToken: process.env.REFRESH_TOKEN
        }
    });

    return transporter;
};

const generateOTP = async (userId) => {
    const otpDoc = await OTP({ user: userId }).save()
    return otpDoc.otp
}


const emailDetails = (userEmail, code) => {
    return {
        from: process.env.EMAIL,
        to: userEmail,
        subject: "AgriTech - Verification Code",
        html: `<!DOCTYPE html>
    <html>
    <head>
      <title>AgriTech - Verification Code</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          padding: 20px;
          background-color: #ffffff;
        }
        .container {
          background-color: #f5f5f5;
          max-width: 600px;
          margin: 0 auto;
          padding: 40px;
          border-radius: 10px;
        }
        h1 {
          color: #333333;
          text-align: center;
        }
        p {
          color: #666666;
          line-height: 1.5;
          margin-bottom: 20px;
        }
        .verification-code {
          text-align: center;
          font-size: 24px;
          font-weight: bold;
          color: #064635;
          margin-top: 30px;
        }
        .cta-button {
          display: block;
          width: 200px;
          margin: 30px auto;
          padding: 12px 20px;
          text-align: center;
          font-size: 16px;
          font-weight: bold;
          color: #ffffff;
          border-radius: 4px;
          border: none;
          text-decoration: none;
          transition-duration: 300ms;
          cursor: pointer;
          background-color: #198754;
        }
        .cta-button:hover {
          background-color: #064635;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>Welcome to AgriTech</h1>
        <p>Thank you for joining our platform. To complete your registration, please use the following verification code:</p>
        <div class="verification-code">${code}</div>
        <button class="cta-button" onclick="window.open({'https://20.127.145.31/dashboard', '_blank'})">Verify Account</button>
        <p>If the button does not work, <a href='https://20.127.145.31/dashboard'>click here</a> instead.</p>
      </div>
    </body>
    </html>    
    `
    }
}

async function sendMail(userEmail, code) {
    try {
        const email = emailDetails(userEmail, code)
        let emailTransporter = await createTransporter();
        await emailTransporter.sendMail(email);
    } catch (error) {
        console.log(error);
    }
}

module.exports = { sendMail, generateOTP }