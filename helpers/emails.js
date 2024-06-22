import nodemailer from 'nodemailer'
const emailRegistro = async (datos)=>{//
    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });

      const {nombre, email, token}= datos

      //enviar el email

      await transport.sendMail({
          from: 'BienesRaices.com',
          to: email,
          subject: 'confirma tu cuenta en bienesraices.com', //asunto
          text: 'confirma tu cuenta en bienesraices.com',   //es lo mismo 
          html: `<p> Hola ${nombre} comprueba tu cuenta en Bienesraices</p>
          <p>Tu cuenta esta lista solo debes confirmarla en el siguiente enlace:
          <a href ="${process.env.BACKEND_URL}:${process.env.PORT ?? 3000}/auth/confirmar/${token}">confirmar cuenta</a> //asi era pero no jala no se pq debes poner una url de backend esa falta 
          <a href ="${process.env.BACKEND_URL}:$auth/confirmar/${token}">confirmar cuenta</a> //asi era pero no jala no se pq debes poner una url de backend esa falta 
          <a href ="${process.env.BACKEND_URL}auth/confirmar/${token}">confirmar cuenta2</a> 
        
          </p>

          <p>Si tu no creaste esta cuenta puedes ignorar el mensaje</p>
          `
      })
}


const emailOlvidePassword = async (datos)=>{//
  const transport = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const {nombre, email, token}= datos

    //enviar el email

    await transport.sendMail({
        from: 'BienesRaices.com',
        to: email,
        subject: 'restablece tu password en bienesraices.com', //asunto
        text: 'restablece tu password en bienesraices.com',   //es lo mismo 
        html: `<p> Hola ${nombre} has solicitado restablecer tu password en bienesraices </p>
        <p>sigue el siguiente enlace para generar un password nuevo:
        <a href ="${process.env.BACKEND_URL}:${process.env.PORT ?? 3000}/auth/olvide-password/${token}">restablecer password</a> 
        </p>

        <p>Si tu no solicitaste el cambio de password  puedes ignorar el mensaje</p>
        `
    })
}
export{
    emailRegistro,
    emailOlvidePassword
}