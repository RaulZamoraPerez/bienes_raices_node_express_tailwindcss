import { Sequelize}  from "sequelize";
import dotenv from 'dotenv';
dotenv.config({path:'.env'})
const db = new Sequelize(process.env.BD_NOMBRE, process.env.BD_USER, process.env.
    BD_PASS ?? '',{
    host: process.env.BD_HOST,
    port:3306,
    dialect:'mysql',//sequelize soporta muchas bd 
    define:{
        timestamps:true
    },
    pool:{
       max:5,//maximo de conexxiones
       min:0,//minimo de conexxion
       acquire:30000,//tiempo antes de marcar un error 
       idle:10000// tiempo que debe de transmitir  para finalizar una conexion a la bd para liberar espacio o recursos
    },
    operatorAliases:false// los aliases era algo que existia en versiones viejas de sequilize y no aseguramos de que no lo use
});

export default db;