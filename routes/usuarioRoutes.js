import express from 'express';
import {formularioLogin, 
    autenticar,
      cerrarSesion,
   formularioRegistro,
    registrar,confirmar, 
    formularioOlvidePassword,
     resetPassword,
     comprobarToken,
     nuevoPassword
   } from '../controllers/usuarioControllers.js'


const router = express.Router();

router.get('/login', formularioLogin  )
router.post('/login', autenticar  )

//cerrar sesion
router.post('/cerrar-sesion', cerrarSesion)

router.get('/registro', formularioRegistro)
router.post('/registro', registrar)

router.get('/olvide-password', formularioOlvidePassword)

router.post('/olvide-password', resetPassword)


router.get('/confirmar/:token', confirmar)//rottin finamico


//alamcena el nuevo password 

//dos rutas una mostrar el form y aotra de post 
router.get("/olvide-password/:token", comprobarToken)
router.post("/olvide-password/:token", nuevoPassword)


//para el url de mensajes 


/*

router.get('/login', (req, res)=>{
   res.render('auth/login',{
      autenticado: false
   }   
   )
});

*/
/*
router.post('/', (req, res)=>{
   res.send("hola")
})
*/
//casi no la uso solo en controllers
// router.route('/')
//    .get(function(req, res){
//          res.json({msg:"Hola mundo en express"})
//    })
//    .post(function(req, res){
//          res.json({msg:"hola tipo"})
//    })
export default router;