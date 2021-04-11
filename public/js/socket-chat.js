//cliente
var socket = io();

var params = new URLSearchParams(window.location.search);

if(!params.has('nombre') || !params.has('sala')){
    window.location = 'index.html';
    throw new Error('El nombre  y la sala son necesario');
}

var usuario = {
    nombre : params.get('nombre'),
    sala : params.get('sala'),
}

socket.on('connect', function() {
    console.log('Conectado al servidor');

    //cuando un usuario se conecta 
    socket.emit('entrarChat', usuario, function(resp) {
        console.log('Usuarios conectados', resp);
    })


});

// escuchar
socket.on('disconnect', function() {

    console.log('Perdimos conexión con el servidor');

});


// Enviar información
/* socket.emit('crearMensaje', {
    
    mensaje: 'Hola Mundo'
}, function(resp) {
    console.log('respuesta server: ', resp);
}); */

// Escuchar información de servidor
socket.on('crearMensaje', function(mensaje) {

    console.log('Servidor:', mensaje);

});

//Escuchar cambios de usuarios conecta/desconecta
socket.on('listaPersonas', function(personas){
    console.log(personas);
});

//Mensajes privados

socket.on('mensajePrivado', function(mensaje){
    console.log('Mensaje Privado '+ mensaje);
});



