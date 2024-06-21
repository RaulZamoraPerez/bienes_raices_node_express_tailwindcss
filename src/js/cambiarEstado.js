(function(){
    const cambiarEstado = document.querySelectorAll('.cambiar-estado')//del publciado
    const token = document.querySelector('meta[name="csrf-token"]').getAttribute('content')
    cambiarEstado.forEach(boton=>{
        boton.addEventListener('click' , cambiarEstadoPropiedad)
    })

    async function cambiarEstadoPropiedad(e){

        const {propiedadId: id}= e.target.dataset

        const url = `/propiedades/${id}`;

      try {
        const respuesta = await fetch(url, {
            method: 'PUT',      //put para actualizar
            headers:{         //l header pq es lo primero que se envia y lelga antes
                'CSRF-Token': token //
            }
       })
       const {resultado} = await respuesta.json()//la respuesta es true or falase 
    //    console.log(resultado)

       if(resultado){
           if( e.target.classList.contains('bg-yellow-100')){//clases de no publicado
                e.target.classList.add('bg-green-100', 'text-green-800')
                e.target.classList.remove('bg-yellow-100', 'text-yellow-800')
                e.target.textContent = 'Publicado'
           }else{
                e.target.classList.remove('bg-green-100', 'text-green-800')
                e.target.classList.add('bg-yellow-100', 'text-yellow-800')
                e.target.textContent = 'No Publicado'
           }
       }

       console.log(respuesta)

      } catch (error) {
         console.log(error)
      }

    }
})()