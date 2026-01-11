import nodemailer from 'nodemailer';

let transporterInstance = null;

async function initializeMailer() {
    if (transporterInstance) return; // Already initialized

    transporterInstance = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT),
        secure: false,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASSWORD,
        },
    });

    transporterInstance.verify((error, success) => {
        if (error) {
            console.error('\x1b[31m[MAILER ERROR]\x1b[0m SMTP connection failed:', error);
            process.exit(1);
        } else {
            console.log('\x1b[32m[MAILER CONNECTED]\x1b[0m SMTP is ready to send emails.');
        }
    });
}

function mailer() {
    if (!transporterInstance) {
        throw new Error('Mailer not initialized.');
    }
    return transporterInstance;
}

async function sendOtpEmail(to, otp) {
    const transporter = mailer();

    await transporter.sendMail({
        from: `"TEMMULEX" <${process.env.SMTP_USER}>`,
        to,
        subject: 'Your OTP Code',
        text: `Your OTP is: ${otp}`,
        html: `<p>Your OTP is: <strong>${otp}</strong></p>`,
    });
}

export {
    sendOtpEmail,
    initializeMailer
}