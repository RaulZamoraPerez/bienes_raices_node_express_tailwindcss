import categorias from "./categorias.js";
import usuarios from "./usuarios.js";

// import Categoria from "../models/Categoria.js"
// import Precio from "../models/Precio.js";

import precios from "./precios.js";  //modelos
import db from "../config/db.js";

import {Categoria, Precio, Usuario} from '../models/index.js'; //relaciones

import {exit} from "node:process";//el exist

const importarDatos = async ()=>{
    try {
        //AUTENTICAR EN LA BD, estar segurdo de que estoy autenticado y todo esta bien
          await db.authenticate()

        //gnerar las columnas antes de insertar en la bd
         await db.sync()


        //Insertar los datos en la bd
        //await Categoria.bulkCreate(categorias)//bulcreaate es para que isnerte los datos de categorias
        //await Precio.bulkCreate(precios)

        await Promise.all([
            Categoria.bulkCreate(categorias), 
            Precio.bulkCreate(precios),
            Usuario.bulkCreate(usuarios)        
        ])




        console.log("datos importados correctamente")

        exit(0) 

    } catch (error) {
        console.log(error)
        exit(1)//terminar los procesos  si hubiera un error 
    }
}



const eliminarDatos= async()=>{
    try {

        // await Promise.all([
        //     Categoria.destroy({where:{}, truncate:true}),//le pones truncate pq si borras registros y se quda en el 10 , si insertas el ultimo se llenara el 11 y debe inicar al 1
        //     Precio.destroy({where:{}, truncate:true})
        // ])

        await db.sync({force:true})

        console.log("eliminados correctamente")
        exit()

    } catch (error) {
        console.log(error)
        exit(1)
    }
}




if(process.argv[2]=="-i"){//process interno de node, y argv es interno de node, para oasar argumentos a un comando desde terminal 
    importarDatos();
}


if(process.argv[2]=="-e"){ 
    eliminarDatos();
}
