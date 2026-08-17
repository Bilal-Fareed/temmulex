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
        from: `"TEMMLUXE" <${process.env.SMTP_USER}>`,
        to,
        subject: 'Your OTP Code',
        text: `Your OTP is: ${otp}`,
        html: `<p>Your OTP is: <strong>${otp}</strong></p>`,
    });
}

async function sendShopperAccountStatusChangeEmail(to) {
    const transporter = mailer();

    await transporter.sendMail({
        from: `"TEMMLUXE" <${process.env.SMTP_USER}>`,
        to,
        subject: 'Your OTP Code',
        text: `Your OTP is: ${otp}`,
        html: `<p>Your OTP is: <strong>${otp}</strong></p>`,
    });
}

const sendShopperProfileStatusEmail = async ({ toEmail, toName, status, reason = null }) => {
    const transporter = mailer();

    const isApproved = status === 'approved';

    const title = isApproved
        ? 'Shopper Profile Request Approved'
        : 'Shopper Profile Request Rejected';

    const message = isApproved
        ? 'Your shopper profile request has been reviewed and approved. You can now use your shopper profile.'
        : 'Your shopper profile request has been reviewed and unfortunately could not be approved at this time.';

    await transporter.sendMail({
        from: `"TEMMLUXE" <${process.env.SMTP_USER}>`,
        toEmail,
        subject: title,
        text: `${title}\n\n${message}`,
        html: `
            <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <h2>${title}</h2>
                <p>Hello, ${toEmail}</p>
                <p>${message}</p>
                <p>
                    If you have any questions, please contact our support team.
                </p>
                <p>
                    Regards,<br>
                    <strong>TEMMLUXE Team</strong>
                </p>
            </div>
        `,
    });
};

export {
    sendOtpEmail,
    initializeMailer,
    sendShopperProfileStatusEmail,
}