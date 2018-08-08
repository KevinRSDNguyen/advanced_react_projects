const mailer = require("nodemailer");
const { welcome } = require("./welcome_template");
const { purchase } = require("./purchase_template");
const { resetPass } = require("./resetpass_template");

const { EMAIL_PASS } = require("./../../../config/keys");

const getEmailData = (to, name, type, actionData) => {
  let data = null;

  switch (type) {
    case "welcome":
      data = {
        from: "Kevin <kevintheviet@gmail.com>",
        to,
        subject: `Welcome to waves ${name}`,
        html: welcome()
      };
      break;
    case "purchase":
      data = {
        from: "Kevin <kevintheviet@gmail.com>",
        to,
        subject: `Thanks for shopping with us ${name}`,
        html: purchase(actionData)
      };
      break;
    case "reset_password":
      data = {
        from: "Kevin <kevintheviet@gmail.com>",
        to,
        subject: `Hey ${name}, reset your password`,
        html: resetPass(actionData)
      };
      break;
    default:
      data;
  }
  return data;
};

const sendEmail = (to, name, type, actionData = null) => {
  const smtpTransport = mailer.createTransport({
    service: "Gmail",
    auth: {
      user: "kevintheviet@gmail.com",
      pass: EMAIL_PASS
    }
  });

  const mail = getEmailData(to, name, type, actionData);

  smtpTransport.sendMail(mail, function(error, response) {
    if (error) {
      console.log(error);
    } else {
    }
    smtpTransport.close();
  });
};

module.exports = { sendEmail };
