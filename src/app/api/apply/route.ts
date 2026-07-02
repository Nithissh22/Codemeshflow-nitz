import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { name, role, portfolio, sentence, why, availability } = data;

    if (!name || !role || !portfolio || !why) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Set up the Nodemailer transporter
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: Number(process.env.SMTP_PORT) || 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS, // Use an App Password for Gmail
      },
    });

    // The email content
    const mailOptions = {
      from: `"CodeMeshFlow Internships" <${process.env.SMTP_USER}>`,
      to: process.env.RECEIVER_EMAIL || process.env.SMTP_USER, // The email that should receive applications
      subject: `New Internship Application: ${name} - ${role}`,
      html: `
        <h2>New Internship Application</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Role:</strong> ${role}</p>
        <p><strong>Portfolio:</strong> <a href="${portfolio}">${portfolio}</a></p>
        <p><strong>In one sentence, I am:</strong> ${sentence || 'N/A'}</p>
        <p><strong>I want to join CodeMeshFlow because:</strong><br/> ${why}</p>
        <p><strong>I can start:</strong> ${availability || 'N/A'}</p>
      `,
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    return NextResponse.json({ message: 'Application sent successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error sending application email:', error);
    return NextResponse.json({ error: 'Error sending email' }, { status: 500 });
  }
}
