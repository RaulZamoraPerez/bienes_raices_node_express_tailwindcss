import {check, validationResult} from 'express-validator'
import Usuario from "../models/Usuario.js";

import { generarId , generarJWT} from '../helpers/tokens.js';
import {emailRegistro} from '../helpers/emails.js'
import { emailOlvidePassword } from '../helpers/emails.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt'
import { where } from 'sequelize';




const formularioLogin =(req, res)=>{

   res.render('auth/login',{
      pagina:'iniciar sesion',
      csrfToken:req.csrfToken()
    //autenticado:false
   })
}

const autenticar=async(req, res)=>{
 ///validacion 

 await check('email').isEmail().withMessage('Eso no parece un Email').run(req)//otra
 await check('password').notEmpty().withMessage('El password es obligatorio').run(req)

 
 let resultado  = validationResult(req)

 //verificar que el resultado este vacio

 if(!resultado.isEmpty()){
           //hay errores
        return  res.render('auth/login',{
            pagina:'iniciar sesion',
            csrfToken : req.csrfToken(),
            errores: resultado.array(),
          
         })
    }

    const {email, password}=req.body

    //comprobar si el usuario existe
     const usuario = await Usuario.findOne({where:{email}})
     if(!usuario){
      return  res.render('auth/login',{
         pagina:'iniciar sesion',
         csrfToken : req.csrfToken(),
         errores: [{msg: "el usuario no existe"}],
      })
     }

     //comprobar si el usuario esta confirmado

     if(!usuario.confirmado){
      return  res.render('auth/login',{
         pagina:'iniciar sesion',
         csrfToken : req.csrfToken(),
         errores: [{msg: "tu cuenta no ha sido confirmada"}],
      })
     }

     //revisar el password
     if(!usuario.verificarPassword(password)){//si retorna false es incorrecto el password
      return  res.render('auth/login',{
         pagina:'iniciar sesion',
         csrfToken : req.csrfToken(),
         errores: [{msg: "el password es incorrecto"}],
      })
     }


     //autenticar al usuario

     const token = generarJWT({id:usuario.id, nombre:usuario.nombre})
     console.log(token)


     //ALMACENAR EN UN COOKIE

     return res.cookie('_token',token,{//coookie con nombre _token, con valor de token
       httpOnly:true,// evitar ataques un cookie no se hace accesible desde la api de javascript
      // secure: true,    // epermite cookies en conexiones seguras
       //sameSite:true   
      // expires: 9000

     }).redirect('/mis-propiedades')
}


//cerrar sesion
const cerrarSesion=(req, res)=>{
     return res.clearCookie('_token').status(200).redirect('/auth/login')//status 200 es para decirle que todo esta bien
}

const formularioRegistro =(req, res)=>{
   
   res.render('auth/registro',{
      pagina: "crear cuenta",
      csrfToken : req.csrfToken()
   });
}

const registrar = async(req, res)=>{
  //console.log(req.body)

  //validacion
  await check('nombre').notEmpty().withMessage('el nombre no puede ir vacio').run(req)
  await check('email').isEmail().withMessage('Eso no parece un Email').run(req)//otra
  await check('password').isLength({min:6}).withMessage('El password debe ser mayor a 6 caracteres').run(req)//minimo de 6 caracteres
  await check('repetir_password').equals(req.body.password).withMessage('Los passwords deben ser iguales').run(req)


  let resultado  = validationResult(req)

    //verificar que el resultado este vacio

    if(!resultado.isEmpty()){
              //hay errores
           return  res.render('auth/registro',{
               pagina:'crear cuenta',
               csrfToken : req.csrfToken(),
               errores: resultado.array(),
               usuario: {
                  nombre: req.body.nombre,
                  email: req.body.email,

               }
            })
       }

       //extraer los datos
       const { nombre, email, password}=req.body


       //verificar que el usuario no est duplicado 
     
       const existeUsuario = await Usuario.findOne( { where:  { email } })
       if(existeUsuario){
         return  res.render('auth/registro',{
            pagina:'crear cuenta',  
            csrfToken : req.csrfToken(),
            errores: [{msg: 'el usuario ya esta registrado'}],//genera un arreglo al vuelo en es momento se va a crear y lo haces asi porque 
            usuario: {
               nombre: req.body.nombre,
               email: req.body.email
            }
         })
       }
      //macenar usuario
      const usuario = await Usuario.create({
         nombre,
         email,
         password,
         token:generarId()
      })


     //envia email de confimacaion
     emailRegistro({
      nombre: usuario.nombre,
      email: usuario.email,
      token: usuario.token
     })
      

  
    //mostrar mensaje de confirmacion 
    res.render('templates/mensaje',{
      pagina: 'cuenta creada correctamente',
      mensaje: 'hemos creado un email de confirmacion, preciona en el enlace'
     })
}

//funcion que compruba una cuenta
const confirmar = async(req, res)=>{
   const {token} = req.params
   
   //verificar si es token es valido
   const usuario = await Usuario.findOne({where :{token}})
 
   if(!usuario){//sino hay usuario, cuando no existe el token
       return res.render('auth/confirmar-cuenta',{
         pagina: 'error al confirmar tu cuenta',
         mensaje: 'hubo un error al confirmar cuenta intenta de nuevo',
         error: true
       })
   }
   //confirmar cuenta

    usuario.token = null; //eliminamos el tooken
    usuario.confirmado=true
    await usuario.save();
    console.log(usuario)

    res.render('auth/confirmar-cuenta',{
      pagina: 'cuenta confirmada',
      mensaje: 'la cuenta se confirmo'
    });

}



const formularioOlvidePassword =(req, res)=>{
   res.render('auth/olvide-password',{
      pagina: "Recupera tu acceso a vienes raices",
         csrfToken : req.csrfToken(),
   });

}

const resetPassword= async(req,res)=>{
    //validacion
  
  await check('email').isEmail().withMessage('Eso no parece un Email').run(req)//otra
 


  let resultado  = validationResult(req)

    //verificar que el resultado este vacio

    if(!resultado.isEmpty()){
              //hay errores
           return  res.render('auth/olvide-password',{
            pagina: "Recupera tu acceso a vienes raices",
            csrfToken : req.csrfToken(),
            errores:resultado.array()
            })
       }
       
       //sisi es email busca al usuario
       //generar un nuevo token
         const {email}= req.body
         const usuario = await Usuario.findOne({where:{email}})//buscar el email
         
         if(!usuario){//sino existe el usuario
            //hay errores
         return  res.render('auth/olvide-password',{
          pagina: "Recupera tu acceso a vienes raices",
          csrfToken : req.csrfToken(),
          errores: [{msg:"el email no pertenece a ningun usuario"}]
          })
     }  
         //generar el token y enviar el email
         usuario.token=generarId();
         await usuario.save();

         //enviar un email

            emailOlvidePassword({
               email:usuario.email,
               nombre:usuario.nombre,
               token:usuario.token
            })
         //renderizar un mensaje
         res.render('templates/mensaje',{
            pagina: 'restablece tu password',
            mensaje: 'hemos enviado un email con las insrtucciones'
           })
}


const comprobarToken = async(req,res)=>{
   const {token}=req.params;//params poeque esta en la urk


   //buscar token en la bd
   const usuario= await Usuario.findOne({where:{token}})
   if(!usuario){
      return  res.render('auth/confirmar-cuenta',{
         pagina: "Restablece tu password",
         mensaje:"hubo un error al validar tu informacion intenta de nuevo",
         error:true
         })
   }


   //mostrar formulario para modificar el password
      res.render('auth/reset-password',{
         pagina:"restablece tu password",
         csrfToken: req.csrfToken()
      })

}
const nuevoPassword =async(req,res)=>{

   //validadr password
    await check('password').isLength({min:6}).withMessage('El password debe ser mayor a 6 caracteres').run(req)//minimo de 6 caracteres
   
     
  let resultado  = validationResult(req)

  //verificar que el resultado este vacio

  if(!resultado.isEmpty()){
            //hay errores
         return  res.render('auth/reset-password',{
             pagina:'restablece tu password',
             csrfToken : req.csrfToken(),
             errores: resultado.array()
             
          })
     }

     const {token} = req.params
     const {password}= req.body
   
    //identificar quien hace el cambio
     const usuario = await Usuario.findOne({where:{token}})

   //hashear el password
   const salt = await bcrypt.genSalt(10)
   usuario.password = await bcrypt.hash(password, salt)
   usuario.token =null;
   await usuario.save();

   res.render('auth/confirmar-cuenta',{
      pagina: 'password restablecido',
      mensaje: 'el password se guardo correctamente'
   })
}

export {
   formularioLogin,
   autenticar,
   cerrarSesion,
   formularioRegistro,
   registrar,
   confirmar,
   formularioOlvidePassword,
   resetPassword,
   comprobarToken,
   nuevoPassword
}