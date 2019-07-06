const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');

const { email } = require('../../config');

const transport = nodemailer.createTransport(
  smtpTransport({
    host: 'smtp.qq.com', // 主机
    secure: true, // 使用 SSL
    secureConnection: true, // 使用 SSL
    port: 465, // SMTP 端口
    auth: email,
  })
);

function sendMail({ subject, content = '程序中断', to = email.sendTo }) {
  const mailOptions = {
    from: `${email.userName}<${email.user}>`, // 发件地址
    to, // 收件列表
    subject, // 标题
    html: content, // html 内容
  };

  transport.sendMail(mailOptions, function(error) {
    if (error) throw error;
  });
}

exports.sendMail = sendMail;
