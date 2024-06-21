(function(){
    const lat =  18.8154729;
    const lng = -97.5095447;
    const mapa = L.map('mapa-inicio').setView([lat, lng ], 10);//1l 10 es el zoom

   let markers = new L.FeatureGroup().addTo(mapa)
  
   let  propiedades = [];

   //filttros de busqueda
     const filtros={
        categoria:"",
        precio:""
     }
     const categoriasSelect= document.querySelector('#categorias')
     const preciossSelect= document.querySelector('#precios')

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mapa);
  
       categoriasSelect.addEventListener('change', e=>{
        filtros.categoria = +e.target.value
        filtrarPropiedades();
      
       })
       
       preciossSelect.addEventListener('change', e=>{
        filtros.precio= +e.target.value
        filtrarPropiedades()
     
       })


    const obtenerPropiedes = async () => {
        try {
              const url = '/api/propiedades';
              const respuesta  = await fetch(url);
              console.log(respuesta)
              propiedades = await respuesta.json()
           
              mostrarPropiedades(propiedades)

        } catch (error) {
            console.log(error)
        }
    }

    const mostrarPropiedades = propiedades=>{
        //limpiar los markers previos
        markers.clearLayers()

        propiedades.forEach(propiedad => {
            //agregar un pin 
            const marker = new L.marker([propiedad?.lat, propiedad?.lng ], {
                autoPan: true// cuando de click en el marker  va a centrarse la vista
        })
        .addTo(mapa)
        .bindPopup(`
            <p class="text-indigo-600 font-bold">${propiedad.categoria.nombre}</p>
            <h1 class="text-xl font-extrabold uppercase my-2 ">${propiedad?.titulo}</h1>
            <img src="/uploads/${propiedad?.imagen}" alt="${propiedad?.titulo}">
            <p class="text-gray-600 font-bold">${propiedad.precio.nombre}</p>
            <a href="/propiedad/${propiedad.id}" class="bg-indigo-600 block p-2 text-center font-bold uppercase text-white ">Ver propiedad</a>
          
        `)


        markers.addLayer(marker)
        
    })
}
  const filtrarPropiedades = ()=>{
     const resultado = propiedades.filter(filtrarCategoria ).filter(filtrarPrecio)
     mostrarPropiedades(resultado)
  }

  const filtrarCategoria =propiedad=>filtros.categoria ? propiedad.categoriaId ===filtros.categoria : propiedad //retorna  

  const filtrarPrecio =propiedad=>filtros.precio ? propiedad.precioId ===filtros.precio : propiedad


    obtenerPropiedes()
})()

/**

el de filtrarcategoria sirve para 
Si tiene algo pues vamos a iterar sobre el objeto de propiedad, que recuerda es el que tenia aquí cda uno de los elementos del arreglo de propiedades

Asi que pones  eso , y pues si hay algo en el filtro pues vamos a a filtrar las propiedess que tengan esa categoríaId  por ejemplo que tengan el id 5

 */

/*
Si filtros.categoria tiene un valor (es decir, no es null o undefined o algún valor falsy):
La función comprueba si propiedad.categoriaId es igual a filtros.categoria.
Si la condición se cumple (es decir, propiedad.categoriaId === filtros.categoria es true), la propiedad se incluye en el resultado.
Si no se cumple, la propiedad se excluye del resultado.
Si filtros.categoria no tiene un valor (es falsy):
La función devuelve la propiedad tal cual, lo que en el contexto de filter significa que no se aplica ningún filtro y la propiedad se incluye en el resultado.
*/