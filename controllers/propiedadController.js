import {Precio, Categoria, Propiedad, Mensaje, Usuario} from '../models/index.js'
import {unlink} from 'node:fs/promises';

import { validationResult } from "express-validator"
import {esVendedor, formatearFecha} from '../helpers/index.js'


const admin = async(req,res)=>{

   
    //leer el QueryString 
    const {pagina: paginaActual}= req.query
    
    const expression= /^[1-9]$/
    
    if(!expression.test(paginaActual)){
          return res.redirect('/mis-propiedades?pagina=1')
    }
    try {
        const {id}= req.usuario

        //LIMITES y offset para el pagina dor

        const limit = 10;//limite para ir paginando de 10 en 10
        const offset = (paginaActual*limit)-limit  

        const [propiedades, total] = await Promise.all([
                 Propiedad.findAll({
                limit:limit,
                offset:offset,//lo que va saltando
                where:
                {
                    usuarioId:id
                },
                include:[//En ssequelize puedes poner un inlcude // y eso seria un join  
                    {model:Categoria, as:'categoria'},//Es como un join de propiedades con categoriasy le das un alias a categoriaId a categoria
                    {model:Precio, as: 'precio'},
                    {model:Mensaje, as: 'mensajes'}
                ]
            }),
                Propiedad.count({  //cuenta cuantas propiedades hay de ese usuario
                    where:{
                        usuarioId:id
                    }
            })
        ])
       // console.log(total)
    
        res.render('propiedades/admin',{
            pagina:"mis propiedades",
            propiedades,
            csrfToken:req.csrfToken(),
            paginas: Math.ceil(total/limit),//redondea  arriba para btn d paginacion
            paginaActual: Number(paginaActual), //convertirlo a numero 
            total,
            offset,
            limit
    
           
        })
    } catch (error) {
        console.log(error)
    }
}
//formulario para crear nueva propiedad
const crear = async(req, res)=>{

    //consultar modelo de precio y categoria
        const [categorias, precios]= await Promise.all([
               Categoria.findAll(),//que traiga todas
               Precio.findAll()
        ])

    res.render('propiedades/crear',{
        pagina:"crear propiedad",
        csrfToken:req.csrfToken(),
        categorias,
        precios,
        datos:{}
    })
}

const guardar=async(req, res)=>{
    //Validacoion o resultado de la validadcion
    let resultado = validationResult(req)
     
    if(!resultado.isEmpty()){

        //consultar modelo de Precio y Categoria 
        const [categorias, precios]= await Promise.all([
            Categoria.findAll(),//que traiga todas
            Precio.findAll()
     ])
    return res.render('propiedades/crear',{
                pagina:"crear propiedad",
            
                csrfToken : req.csrfToken(),
                categorias,
                precios,
                errores:resultado.array(),//metodo de expressValidator
                datos: req.body
            })
    }

    //crear un registro
    const {titulo, descripcion, habitaciones, 
        estacionamiento, wc, calle, 
        lat, lng, precio: precioId, categoria: categoriaId } = req.body
      
        const {id :usuarioId} = req.usuario
 try {
    //console.log(req.body)
    const propiedadGuardada = await Propiedad.create({
        titulo,
        descripcion,
        habitaciones, 
        estacionamiento, 
        wc,
        calle, 
        lat, 
        lng,
        precioId,
        categoriaId,
        usuarioId,
        imagen:''
    })

    const {id} = propiedadGuardada
    res.redirect(`/propiedades/agregar-imagen/${id}`)
    
 } catch (error) {
  console.log(error)
 }
}

 const agregarImagen = async(req, res)=>{
       
    const {id}= req.params;

    //validar que la propiedad exista
     
    const propiedad = await Propiedad.findByPk(id)
    
    if(!propiedad){
        return res.redirect('/mis-propiedades')
    }

    //validar que la propiedad no este publicada                    //puedes ser que alguien publique una propiedad y luego regrese a agregr mas imagenes
      
    if(propiedad.publicado){
        return res.redirect('mis-propiedades')
    }

   //validar a que la propiedad pertence a quien visita esta pagina
        if(req.usuario.id.toString()!==propiedad.usuarioId.toString()){
            return res.redirect('mis-propiedades')
        }


    res.render('propiedades/agregar-imagen',{
        pagina: `agrega una imagen: ${propiedad.titulo}`,
        csrfToken : req.csrfToken(),
        propiedad,
    })
 }

 const almacenarImagen = async(req, res, next)=>{
         
    const {id}= req.params;

    //validar que la propiedad exista
     
    const propiedad = await Propiedad.findByPk(id)
    
    if(!propiedad){
        return res.redirect('/mis-propiedades')
    }

    //validar que la propiedad no este publicada                    //puedes ser que alguien publique una propiedad y luego regrese a agregr mas imagenes
      
    if(propiedad.publicado){
        return res.redirect('mis-propiedades')
    }

   //validar a que la propiedad pertence a quien visita esta pagina
        if(req.usuario.id.toString()!==propiedad.usuarioId.toString()){
            return res.redirect('mis-propiedades')
        }

        try { 
            console.log(req.file)
             //almacenar imagen y publicar propiedad 
                  propiedad.imagen = req.file.filename
 
                  //publicar propiedad
                  propiedad.publicado=1

                  await propiedad.save()

                 next()//LO REDIRECCIONAS AL SIGUIENTE MIDDLEWARE PARA REGRESARLO AL INICIO


        } catch (error) {{}
             console.log(error)            
        }
 }

 const editar =async(req, res)=>{

      const {id} = req.params;

      //validar que la propiedad exista
      const propiedad = await Propiedad.findByPk(id)//buscar por primary key el id

      //sino hay propiedad
      if(!propiedad){
           return res.redirect('/mis-propiedades')
      }
      
      //revisar que quien visita la url , es quien creo la propiedad
      if(propiedad.usuarioId.toString()!== req.usuario.id.toString()){
        return res.redirect('/mis-propiedades')
      }

      //consultar modelo de precio y categoria
            const [categorias, precios]= await Promise.all([
                Categoria.findAll(),//que traiga todas
                Precio.findAll()
        ])

        res.render('propiedades/editar',{
        pagina:`Editar propiedad: ${propiedad.titulo}`,
        csrfToken:req.csrfToken(),
        categorias,
        precios,
        datos:propiedad
        })

 }
 const guardarCambios =async(req, res)=>{

    //verificar la validacion
     
    let resultado = validationResult(req)
    if(!resultado.isEmpty()){

        const[categorias, precios] = await Promise.all([
            Categoria.findAll(),
            Precio.findAll()
        ])
        return res.render('propiedades/editar',{
            pagina:'Editar propiedad',
            csrfToken:req.csrfToken(),
            categorias,
            precios,
            errores: resultado.array(),
            datos: req.body//la ultima copia para no perder lo qeu escribiste
        })
    }



    const {id} = req.params;

    //validar que la propiedad exista
    const propiedad = await Propiedad.findByPk(id)//buscar por primary key el id

    //sino hay propiedad
    if(!propiedad){
         return res.redirect('/mis-propiedades')
    }
    
    //revisar que quien visita la url , es quien creo la propiedad
    if(propiedad.usuarioId.toString()!== req.usuario.id.toString()){
      return res.redirect('/mis-propiedades')
    }

    //rescribir el objeto de la propiedad y asignar los nuevos valores

    try {
       
        const {titulo, descripcion, habitaciones,  estacionamiento, wc, calle, 
            lat, lng, precio: precioId, categoria: categoriaId } = req.body

            propiedad.set({//metodo de sequelize para axtualizar
                titulo,
                descripcion,
                habitaciones,
                estacionamiento,
                wc,
                calle, 
                lat,
                lng,
                precioId,
                categoriaId
            })

            await propiedad.save();

            res.redirect('/mis-propiedades')
            
    } catch (error) {
        console.log(error)//debugear
    }
 }
 const eliminar =async(req, res)=>{
    const {id} = req.params;

    //validar que la propiedad exista
    const propiedad = await Propiedad.findByPk(id)//buscar por primary key el id

    //sino hay propiedad
    if(!propiedad){
         return res.redirect('/mis-propiedades')
    }
    
    //revisar que quien visita la url , es quien creo la propiedad
    if(propiedad.usuarioId.toString()!== req.usuario.id.toString()){
      return res.redirect('/mis-propiedades')
    }   

    //Eliminar la imagen
    await unlink(`public/uploads/${propiedad.imagen}`)//eliminar el archivo que deseas 

     console.log('se elimino la imagen'+ propiedad.imagen)
    //ELIminar la propiedad
    await propiedad.destroy();
    return res.redirect('/mis-propiedades')
 }


 //Modificar el estado de la propiedad
 const cambiarEstado = async(req, res)=>{
     const {id }= req.params; 
     //validar que la propiedad exista
     const propiedad = await Propiedad.findByPk(id)
     if(!propiedad){
        return res.redirect('/mis-propiedades')
     }

     //revisar que quien visita la url , es quien creo la propiedad
     if(propiedad.usuarioId.toString()!== req.usuario.id.toString()){
        return res.redirect('/mis-propiedades')

 }

 //actualizar el estado de la propiedad

//         if(propiedad.publicado){

//             propiedad.publicado=0
//         }
//         else{
//             propiedad.publicado=1
//         }

//otra forma 
   propiedad.publicado = !propiedad.publicado

   await propiedad.save()
   res.json({
        resultado: true
   })
}


 //muestra una propiedad
 const mostrarPropiedad =async(req, res)=>{

    const {id} = req.params;
    console.log(req.usuario)

    //comprobar que la propiedad exista
    const propiedad = await Propiedad.findByPk(id,{//findbyPk es para buscar por primary key el id sino encuentra devuelve null

        include:[
            {model:Precio, as: 'precio'},
            {model:Categoria, as: 'categoria'},
        ]
    })

    if(!propiedad  || !propiedad.publicado){
        return res.redirect('/404')
    }

   // console.log(esVendedor(req.usuario?.id, propiedad.usuarioId))

     res.render('propiedades/mostrar',{
        propiedad,
        pagina:propiedad.titulo,
        csrfToken:req.csrfToken(),
        usuario:req.usuario,//se le paso del middelare  de idetificar se le pasa el user
        esVendedor: esVendedor(req.usuario?.id, propiedad.usuarioId)
     })
 }
 const enviarMensaje =async(req, res)=>{

    const {id} = req.params;
    console.log(req.usuario)

    const propiedad = await Propiedad.findByPk(id,{
        include:[
            {model:Precio, as: 'precio'},
            {model:Categoria, as: 'categoria'},
        ]
    })

    if(!propiedad){
        return res.redirect('/404')
    }

     //renderizar los errores
     let resultado = validationResult(req)
     if(!resultado.isEmpty()){
            // console.log(esVendedor(req.usuario?.id, propiedad.usuarioId))
     return  res.render('propiedades/mostrar',{
            propiedad,
            pagina:propiedad.titulo,
            csrfToken:req.csrfToken(),
            usuario:req.usuario,//se le paso del middelare  de idetificar se le pasa el user
            esVendedor: esVendedor(req.usuario?.id, propiedad.usuarioId),
            errores:resultado.array()
     })
     }

    //  console.log(req.body)//lo que ingresa en el form
    //  console.log(req.params) //lo de la url
    //  console.log(req.usuario)// instancia local de usuario

    const {mensaje}= req.body
    const {id: propiedadId}= req.params
    const {id: usuarioId} = req.usuario


       //ALmacenar el mensaje
       await Mensaje.create({ 
              mensaje,
              propiedadId,
              usuarioId
       })
       res.render('propiedades/mostrar',{
        propiedad,
        pagina:propiedad.titulo,
        csrfToken:req.csrfToken(),
        usuario:req.usuario, //se le paso del middelare  de idetificar se le pasa el user
        esVendedor: esVendedor(req.usuario?.id, propiedad.usuarioId),
        enviado:true
       })

    //    res.redirect(`/`) esta ya no

 }

 //leer mensajes recibidos

 const verMensajes = async(req, res)=>{
    
    const {id} = req.params;

    //validar que la propiedad exista
    const propiedad = await Propiedad.findByPk(id,{//buscar por primary key el id
         include:[
            {model: Mensaje, as:'mensajes', 
                include:[
                    {model:Usuario.scope('eliminarPassword'), as:'usuario'}
                ]
            }
         ]

    })

    //sino hay propiedad
    if(!propiedad){
         return res.redirect('/mis-propiedades')
    }
    
    //revisar que quien visita la url , es quien creo la propiedad
    if(propiedad.usuarioId.toString()!== req.usuario.id.toString()){
      return res.redirect('/mis-propiedades')
    }   


     res.render('propiedades/mensajes',{
            pagina:"Mensajes" ,
            mensajes: propiedad.mensajes,
            formatearFecha
     })
 }
export {
    admin,
    crear,
    guardar,
    agregarImagen,
    almacenarImagen,
    editar,
    guardarCambios,
    eliminar,
    cambiarEstado,
    mostrarPropiedad,
    enviarMensaje,
    verMensajes
}