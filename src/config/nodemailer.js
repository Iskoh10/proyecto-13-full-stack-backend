const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_ADDRESS,
    pass: process.env.EMAIL_PASSWORD
  }
});

const mailOptions = ({ email, password }) => {
  return {
    from: process.env.EMAIL_ADDRESS,
    to: email,
    subject: 'Nueva cuenta en Projects RTC',
    html: getHTML({ email, password })
  };
};

const getHTML = ({ email, password }) => {
  return `
  <div>
  <h2>Un administrador te ha creado una cuenta en la pagina comunitaria de Proyectos de RTC</h2>
  <h4>Tu usuario: ${email}</h4>
  <h4>Tu cotraseña: ${password}</h4>
    <a href="#"><p>Haz click aquí para ir a la página y cambiar tu contraseña</p>
  </div>
  `;
};

const sendEmail = ({ email, password }) => {
  transporter.sendMail(
    mailOptions({ email, password }),
    function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log('Correo electrónico enviado: ' + info.response);
      }
    }
  );
};

module.exports = { sendEmail };
