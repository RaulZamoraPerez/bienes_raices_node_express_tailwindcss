import jwt  from "jsonwebtoken"
import { Usuario } from "../models/index.js"

const protegerRuta = async(req, res, next)=>{
       
    //verificar si hay un token
   
    const {_token} = req.cookies 
    if(!_token){
        return res.redirect('/auth/login')
    }

    //comprobar el token
      try {
        const  decoded = jwt.verify(_token, process.env.JWT_SECRET)
        //console.log(decoded)

        const usuario = await Usuario.scope('eliminarPassword').findByPk(decoded.id)



        //alamacenar el usuario al req

        //console.log(usuario)
        if(usuario){
            req.usuario = usuario//guardamos usuario en el rq le pasas el objeto completp de usuario
        }else{
            return res.redirect('/auth/login')
        } 
        return   next()

      } catch (error) {  //eliminar el token con el clearCookie
        return res.clearCookie('_token').redirect('/auth/login')
      }
      
  
}

export default protegerRuta