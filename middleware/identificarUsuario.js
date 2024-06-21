import jwt from 'jsonwebtoken';
import Usuario from '../models/Usuario.js';

const identificarUsuario = async(req, res, next)=>{
   //identificar si hay token en las cookies   
   const {_token} = req.cookies
   if(!_token){
        req.usuario = null// decimos que no hay usuario
        return next()
   }

   //comprobar el token

   try {
    
    const  decoded = jwt.verify(_token, process.env.JWT_SECRET)
    //console.log(decoded)
    const usuario = await Usuario.scope('eliminarPassword').findByPk(decoded.id)
    
    if(usuario){
        req.usuario = usuario//guardamos usuario en el rq le pasas el objeto completo de usuario
    }
    return next();

   } catch (error) {
      console.log(error)

      return res.clearCookie('_token').redirect('/iniciar-sesion')//limpiamos la cookie si hay error y redirgire
   }
  
}
export default identificarUsuario;