import {DataTypes} from 'sequelize'

import bcrypt from 'bcrypt'//dependencia que ayuda a hashear un password

import db from '../config/db.js'

//define pa  definir un nuevo modelo 
//y el nombre del modelo,  es nombr de la tabla que se va a crear,
const Usuario =db.define('usuarios',{
        nombre:{
            type: DataTypes.STRING,
            allowNull: false,//este campo no pude ir vacio
        },
        email:{
            type: DataTypes.STRING,
            allowNull: false,
        },
        password:{
            type: DataTypes.STRING,
            allowNull: false,
        },
        token: DataTypes.STRING,//toknen que nosotros generaremos
        confirmado: DataTypes.BOOLEAN//VEREMOS CON MECANIZMO PARA CONFIRMAR AL USER
        
},{
    hooks:{
        beforeCreate: async function(usuario) {//hahsear password
           const salt = await bcrypt.genSalt(10)
           usuario.password = await bcrypt.hash(usuario.password, salt)
        }
    },
    scopes:{
        eliminarPassword:{//eliminar ciertos campos de una consulta o modelo
            attributes: {
                exclude: ['password', 'token', 'confirmado', 'createdAt', 'updatedAt']//elimina ciertos eleentos
            }
        }
    }
}) 

//metodos personalizados

//el primer
Usuario.prototype.verificarPassword=function(password){//
   return bcrypt.compareSync(password, this.password)//comprar el password con que esta hasejasdo
}


export default Usuario;