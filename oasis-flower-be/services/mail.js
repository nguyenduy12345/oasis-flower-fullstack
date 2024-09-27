import nodemailer from "nodemailer";
import { GoogleApis } from "googleapis";

const sendEmail = async (email, newPassword) => {
  const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    secure: false, 
    auth: {
      user: process.env.MAIL_USERNAME,
      pass: process.env.MAIL_PASSWORD,
    },
  });
  let mailOptions = {
    from: process.env.MAIL_USERNAME,
    to: email,
    subject: "Mật khẩu của bạn Oasis Flower",
    html:
      `<h3>Mật khẩu mới của bạn là : ${newPassword}</h3>
      <p>Hãy sử dụng mật khẩu này đăng nhập lại tại <a href="#">Oasis Flower</a></p>`
  };
  transporter.sendMail(mailOptions, function (err, data) {
    if (err) {
      console.log(err);
    } else {
      console.log(data);
    }
  });
};
// let transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     type: "OAuth2",
//     user: process.env.MAIL_USERNAME,
//     pass: process.env.MAIL_PASSWORD,
//     clientId: process.env.CLIENT_ID,
//     clientSecret: process.env.CLIENT_SECRET,
//     refreshToken: process.env.REFRESH_TOKEN,
//   },
// });
// let mailOptions = {
//   from: process.env.MAIL_USERNAME,
//   to: email,
//   subject: "Mật khẩu của bạn Oasis Flower",
//   text:
//   `
//       <h3>Mật khẩu mới của bạn là : ${newPassword}</h3>
//       <p>Hãy sử dụng mật khẩu này đăng nhập lại tại <a href="#">Oasis Flower</a></p>
//   `,
// };
// transporter.sendMail(mailOptions, function (err, data) {
//   if (err) {
//     throw new Error(err);
//   }else{
//     console.log(data)
//   }
// });
// };

export default sendEmail;

// const transporter = nodemailer.createTransport({
//     host: "smtp.ethereal.email",
//     port: 587,
//     secure: false, // true for port 465, false for other ports
//     auth: {
//       user: "maddison53@ethereal.email",
//       pass: "jn7jnAPss4f63QBp6D",
//     },
//   });

//   // async..await is not allowed in global scope, must use a wrapper
//   async function main() {
//     // send mail with defined transport object
//     const info = await transporter.sendMail({
//       from: '"Maddison Foo Koch 👻" <maddison53@ethereal.email>', // sender address
//       to: "bar@example.com, baz@example.com", // list of receivers
//       subject: "Hello ✔", // Subject line
//       text: "Hello world?", // plain text body
//       html: "<b>Hello world?</b>", // html body
//     });

//     console.log("Message sent: %s", info.messageId);
//     // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
//   }

//   main().catch(console.error);
// const CLIENT_ID = process.env.CLIENT_ID;
// const CLIENT_SECRET = process.env.CLIENT_SECRET;
// const REDIRECT_URL = process.env.REDIRECT_URL;
// const REFRESH_TOKEN = process.env.REFRESH_TOKEN;

// const oAuth2Client = new google.auth.OAuth2(
//   CLIENT_ID,
//   CLIENT_SECRET,
//   REDIRECT_URL
// );
// oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });
// const accessToken = "ya29.a0AcM612yLB4fMU791ihYlLkE0L6N9A1AL3bjzpmTomUa2mDPG2GUmf0QZzX4R7ecz9_M4QJJV9NyAiUJhxzjAi3p0dMv_nMKcsBMdOA0RDM_rciQ6dKerWPjUJvyc0wRqfoTCn3Mr5t5NZVhf03cxXrJu3zxLqUaDLtwgUDXSaCgYKAY4SARISFQHGX2MiE4qieuMVcelISz0eNiW0zQ0175"
// const transport = nodemailer.createTransport({
//   service: "gmail",
//   host: "smtp.gmail.com",
//   port: 587,
//   auth: {
//     type: "OAUTH2",
//     user: "nguyenvanduy2121999@gmail.com",
//     clientId: CLIENT_ID,
//     clientSecret: CLIENT_SECRET,
//     refreshToken: REFRESH_TOKEN,
//     accessToken: accessToken,
//   },
// });
// let info = await transport.sendMail({
//   from: '"NODEMAILER API WEB" <nguyenvanduy2121999@gmail.com>',
//   to: "nguyenvanduy2121999@gmail.com",
//   subject: "New password",
//   text: "Hello,",
//   html: `Your current password : ${newPassword}`,
// });
