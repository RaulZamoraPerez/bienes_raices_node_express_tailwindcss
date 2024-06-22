import { Sequelize } from 'sequelize'
import {Precio, Categoria, Propiedad} from '../models/index.js'

const inicio = async(req, res)=>{
  const categorias = await Categoria.findAll({raw:true})//el ultimo error segun
  const precios = await Precio.findAll({raw:true})
  
  const [casas, departamentos] = await Promise.all([
    // Categoria.findAll({raw: true}),// traerá la consulta mejor estructurada
    // Precio.findAll({raw: true}),
    Propiedad.findAll({
      limit:3,
      where: {
        categoriaId: 1
      },
      include:[
        {
          model: Precio,
          as:'precio'
        }
      ],
      order:[ 
        ['createdAt', 'DESC']
      ]
    }),
    Propiedad.findAll({
      limit:3,
      where: {
        categoriaId: 2
      },
      include:[
        {
          model: Precio,
          as:'precio'
        }
      ],
        order:[ 
          ['createdAt', 'DESC']
        ]
    })

  ])
  console.log(categorias)

  res.render('inicio',{
        pagina: "Inicio",
        categorias,
        precios,
        casas,
        departamentos,
        csrfToken: req.csrfToken()
  }) 
}
const categoria = async(req, res)=>{
    
  const {id}= req.params
    //comprobar que la categoria existe
    const categoria = await Categoria.findByPk(id)
    if(!categoria){
      return  res.redirect('/404')
    }
     //obtener las propiedades de  la categoria
     const propiedades = await Propiedad.findAll({
      where:{
      categoriaId:id
      }, include:[
        {model: Precio, as:'precio'}
      ]
     })
     res.render('categoria',{
       pagina:`${categoria.nombre}s en venta`,
       propiedades,
       csrfToken: req.csrfToken()

     })



}
const noEncontrado = (req, res)=>{
  res.render('404',{
    pagina: "Pagina no encontrada",
    csrfToken: req.csrfToken()
  })
}

const buscador =async(req, res)=>{
    const {termino}= req.body
    //validar que termine no esté vacío

    if(!termino.trim()){
      return res.redirect('back')
    }

    //consultar las propiedades

    const propiedades = await Propiedad.findAll({
      where:{
         titulo:{  //columanque quiero habiltar la busqueda
            [Sequelize.Op.like] : '%' + termino + '%' //busqueda por like
        }
      },
      include:[
        {model: Precio, as:'precio'},
      ]
    })
    
    res.render('busqueda',{
      pagina:'Resultados de la busqueda',
      propiedades,
      csrfToken: req.csrfToken()

    })
}
export{
    inicio,
    categoria,
    noEncontrado,
    buscador
}