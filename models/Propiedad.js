import { DataTypes } from "sequelize";

import db from "../config/db.js";

const Propiedad = db.define('propiedades',{
    id:{
        type:DataTypes.UUID,          //crea un id pero no 1,2,3, sino mas largo
        defaultValue: DataTypes.UUIDV4,     //que tenga UUID version 4
        allowNull:false,       // que no puede ir vacio
        primaryKey:true    //Este sera el primary key
    },
    titulo:{
        type: DataTypes.STRING(100),
        allowNull:false   //no puede ir vacio
    },
    descripcion:{
        type: DataTypes.TEXT,
        allowNull:false

    },
    habitaciones:{
        type:DataTypes.INTEGER,   //PORQUE VAMSOS A ALMACENAR LA REFERENCIA DE OTRA TABLA 
        allowNull:false
    },
    estacionamiento:{
        type:DataTypes.INTEGER,   //PORQUE VAMSOS A ALMACENAR LA REFERENCIA DE OTRA TABLA 
        allowNull:false
    },
    wc:{
        type:DataTypes.INTEGER,   //PORQUE VAMSOS A ALMACENAR LA REFERENCIA DE OTRA TABLA 
        allowNull:false
    },
    calle:{
        type:DataTypes.STRING(60),
        allowNull:false
    },
    lat:{
        type:DataTypes.STRING,
        allowNull:false
    },
    lng:{
        type:DataTypes.STRING,
        allowNull:false
    },

    imagen:{
        type:DataTypes.STRING,
        allowNull:false
    },
    publicado:{
        type:DataTypes.BOOLEAN,
        allowNull:false,
        defaultValue: false//por daful esta en falso, hasta que el usuario de click se pone que si
    }

});
export default Propiedad;