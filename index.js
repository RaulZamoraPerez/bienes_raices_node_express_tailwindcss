//importar express hay dos formas 

//NOTA YA NO SE USA CONST = EXPRESS = REQUIERE Y ASI PQ CAMBIAMOS A MODULE

//extrae la dependencia que instalamos y en nodemodules busca la dependencia y la extrae en este archivo
//const express = require('express')//extrae y lo asigna

import express  from 'express';
import csrf from 'csurf';
import cookieParser from 'cookie-parser';
import   usuarioRoutes from './routes/usuarioRoutes.js';
import   propiedadesRoutes from './routes/propiedadesRoutes.js';
import   appRoutes from './routes/appRoutes.js';
import   apiRoutes from './routes/apiRoutes.js';
import db from './config/db.js';



//crear la app, es la intancia de espress
const app = express()//llamamos la funcion


//habilitar lectura de datos de formularios
app.use(express.urlencoded({extended:true}))

//habilitar el cookie parser
app.use(cookieParser())

//habilitar por CSRF
app.use(csrf({cookie:true}))

//conexion a la bd
try {
       await db.authenticate();//Al usar await, estás esperando a que esta promesa se resuelva antes de continuar ejecutando el código siguiente.
       db.sync()//generar la tabla creanla sino existe
       //console.log("conexion a la bd")
} catch (error) {
    console.log(error)
}


//habilirar Pug    set -es para agregar config
app.set("view engine", "pug")//decirle que tipo de view engine o cual usaremos
app.set("views", "./views")//que carpeta es la de view y que estaran en ./views




//Carpeta publica   ->la carpeta que pueden abrir las personas que visitan el sitio web, tambien es el contendor de archivos estaticos
app.use(express.static('public'))


//Roting   si quieres tener 
app.use('/', appRoutes)
app.use('/auth', usuarioRoutes)
app.use('/', propiedadesRoutes)
app.use('/api', apiRoutes)


//la ruta , el req es el request es lo que envias al servidor  de node y response es la respuesta





//definir el puerto y arrancar el proyecto

//defino el puerto y despues conecto la app
const port=  process.env.PORT || 3000;//conectate aqui
app.listen(port, ()=>{//esucha o conectate en este puerto y despues
    console.log(`el servidor esta funcionando en el puerto ${port}`)
});