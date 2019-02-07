import nodemailer from "nodemailer";

export async function sendEmail(email: string, url: string) {
  // const account = await nodemailer.createTestAccount();

  // const transporter = nodemailer.createTransport({
  //   host: "smtp.ethereal.email",
  //   port: 587,
  //   secure: false, // true for 465, false for other ports
  //   auth: {
  //     user: account.user, // generated ethereal user
  //     pass: account.pass // generated ethereal password
  //   }
  // });
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "admin@socialslant.io",
      pass: "Jakeadelman1?"
    }
  });

  // setup email data with unicode symbols
  const mailOptions = {
    from: "Jake Adelman", // sender address
    to: email, // list of receivers
    subject: "Confirm your email ✔", // Subject line
    text: "Hello world?", // plain text body
    html: `<a href="${url}">${url}</a>` // html body
  };

  // send mail with defined transport object
  const info = await transporter.sendMail(mailOptions);

  console.log("Message sent: %s", info.messageId);
  // console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
}
