import Propiedad from './Propiedad.js';
import Precio from './Precio.js';
import Categoria from './Categoria.js';
import Usuario from './Usuario.js';
import Mensaje from './mensaje.js';

//Precio.hasOne(Propiedad)//hasOne se lee mas como dere, izq

Propiedad.belongsTo(Precio, {foreignKey: 'precioId'})//MAS NATURAL
Propiedad.belongsTo(Categoria, {foreignKey: 'categoriaId'})//MAS NATURAL
Propiedad.belongsTo(Usuario, {foreignKey: 'usuarioId'})//que usuario publico esa

Propiedad.hasMany(Mensaje,{foreignKey: 'propiedadId'})//una propiedad puede tener muchos mensajes

Mensaje.belongsTo(Propiedad, {foreignKey: 'propiedadId'})//que usuario publico esa
Mensaje.belongsTo(Usuario, {foreignKey: 'usuarioId'})//que usuario publico esa



export{
    Propiedad,
    Precio,
    Categoria,
    Usuario,
    Mensaje
}