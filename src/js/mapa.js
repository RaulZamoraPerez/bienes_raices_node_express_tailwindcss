(function() {
 
    const lat = document.querySelector('#lat').value || 18.8154729;
    const lng = document.querySelector('#lng').value || -97.5095447;
    const mapa = L.map('mapa').setView([lat, lng ], 10);//1l 10 es el zoom
    let marker;

//utilizar provider y geocoder
const geocodeService = L.esri.Geocoding.geocodeService();//obtener nombre de calle por coordenadas


    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mapa);
  
    //El Pin
    marker = new L.marker([lat, lng],{
        draggable:true,// poderlo mover el pin 
        autoPan:true // una vez que muevas el pin se vuelve a centrar el mapa, va siguiendo el mapa
    })
    .addTo(mapa)//instancia del mapa, agregas el pin a ese mapa


    //detectar el movimiento del Pin

    marker.on('moveend',function(e){//evento llamado moveend cuando mueves y sueltas el pin
          marker = e.target  //el target el elemento que estamos moviendo
          console.log(marker)
           const posicion = marker.getLatLng();
           console.log(posicion)

           mapa.panTo(new L.LatLng(posicion.lat, posicion.lng))



           //oBtener informacion de las calles al soltar el pin
           geocodeService.reverse().latlng(posicion, 13).run(function(error, resultado){
                         //console.log(resultado)

                        marker.bindPopup(resultado.address.LongLabel)


                        //LENNAR LOS CAMPOS
                        document.querySelector('.calle').textContent=resultado?.address?.Address ?? '';
                        document.querySelector('#calle').value=resultado?.address?.Address ?? '';
                        document.querySelector('#lat').value=resultado?.latlng?.lat ?? '';
                        document.querySelector('#lng').value=resultado?.latlng?.lng ?? '';
           })
    })
})()