const esVendedor = (usuarioId, propiedadUsuarioId) => {//uusario ath y user q creo la propiedad
  return usuarioId === propiedadUsuarioId;
}

const formatearFecha = (fecha) => {
    // console.log(fecha.toString());
    // console.log( new Date(fecha).toISOString().slice(0, 10));

    const nuevaFecha = new Date(fecha).toISOString().slice(0, 10);

    const opciones={
      weekday: 'long',//nombre del dia completo,
      year: 'numeric',//año
      month: 'long',//mes
      day: 'numeric'//dia
    }
    //lo pasas a tipo date otra vez para tener acceso a ese y le as oopciones
    return new Date(nuevaFecha).toLocaleDateString('es-ES',opciones);
}
export {
    esVendedor,
    formatearFecha
}