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

          <!--<a href ="${process.env.BACKEND_URL}:${process.env.PORT ?? 3000}/auth/confirmar/${token}">confirmar cuenta</a>  local-->
           <a href ="${process.env.BACKEND_URL}/auth/confirmar/${token}">confirmar cuenta</a> 
          

        
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
<<<<<<< HEAD
      <a href ="${process.env.BACKEND_URL}:${process.env.PORT ?? 3000}/auth/olvide-password/${token}">restablecer password</a>      <!--      url de local-->
       <!--  <a href ="${process.env.BACKEND_URL}/auth/olvide-password/${token}">restablecer password</a>                                      url de hosting-->
=======
      <!-- local  <a href ="${process.env.BACKEND_URL}:${process.env.PORT ?? 3000}/auth/olvide-password/${token}">restablecer password</a>--> 
        <a class="hosting" href ="${process.env.BACKEND_URL}/auth/olvide-password/${token}">restablecer password</a> <!--hosting -->
>>>>>>> 79431af4dacb4751ade5fe45e31ba71527a760cf
        </p>

        <p>Si tu no solicitaste el cambio de password  puedes ignorar el mensaje</p>
        `
    })
}
export{
    emailRegistro,
    emailOlvidePassword
}
