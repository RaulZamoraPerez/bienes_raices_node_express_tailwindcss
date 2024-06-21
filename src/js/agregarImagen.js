import {Dropzone} from 'dropzone';


const token= document.querySelector('meta[name="csrf-token"]').getAttribute('content')

Dropzone.options.imagen={ //acceder a opciones de dropzon
   dictDefaultMessage:'Sube tus imagenes aqui',
   acceptedFiles: '.png,.jpg,.jpeg',
   maxFilesize:5,//imagenes de 5 megas,
   maxFiles: 1, //solo una imagen
   parallelUploads:1, //  es la cantidad de archivos que estamos soportando si pones 10 arriba ponlos aqui igual
  autoProcessQueue: false, // cuand tu arrastras una imagen  y eso daba el error, lo hara dropzpn es tratar de subir la img en automaticco pero yo quiero que se suba hasta que el usuario precione en el boton 
   addRemoveLinks: true,  //Eliminar la img
   dictRemoveFile: 'Borrar archivo',
   dictMaxFilesExceeded: 'el limite es 1 archivo',
   headers:{
      'CSRF-Token':token
   },
   paramName:'imagen',
   init: function(){
      const dropzone = this
      const btnPublicar= document.querySelector('#publicar')
      btnPublicar.addEventListener('click', function(){
         dropzone.processQueue()//
      })

      dropzone.on('queuecomplete', function(){
           if(dropzone.getActiveFiles().length==0){
            window.location.href='/mis-propiedades'
           }
      })
   }
}