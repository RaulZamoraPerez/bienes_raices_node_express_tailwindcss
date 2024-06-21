import multer from "multer";
import path from 'path';

import {generarId} from '../helpers/tokens.js'


const storage= multer.diskStorage({  //habilitas fiskStorage
    destination:function(req, file, cb){// donde se guardan las img
          cb(null, './public/uploads/')
    },
    filename: function(req, file, cb){
         cb(null, generarId()+path.extname(file.originalname))//
    }
}) 

const upload = multer({storage})//comentario abajo

export default upload


/*de nuevo si se ejecuta cb es porque salió bien el callback 
entonces le decumos que no hay ningún error con el null  
y despues viene el destino donde se va a guardar  la imagen que se suba
*/


/*
path // es una dependencia que hay interna en node
  la cual permite navegar sobre las diferentes carpetas,
   pero también permite leer el FILE existente-.....


extname //  nos va a traer la extensión de un archivo 

*/

/**
 * File.originalname  entonces eso va a tomar el nombre original del archivo  que pude ser hola,jpg y la función nos va a retornar únicamente ese jpg 
 */


/*
Creamos una variable mas de upload que será igual a multer y le pasas la 
configuración comon {}
Y le pasas store {storage}
Entonces usara multer  pero con la configuración que nosotros estamos 
apsando arriba en storage y la exportas

*/