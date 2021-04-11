//servidor

const { io } = require('../server');
const {Usuario} = require('../classes/usuarios');

const {crearMensaje} = require('../utilidades/utilidades');

const usuario = new Usuario();

io.on('connection', (client) => {

    //escucha recibe la informacion 
    client.on('entrarChat', (data, callback) => {

        if(!data.nombre || !data.sala){
            return callback({
                err: true,
                mensaje: 'El nombre/sala es necesario'
            });
        } 

        //unir a una sala
        client.join(data.sala);

        usuario.agregarPersona(client.id, data.nombre, data.sala);

        //para saber cuando se conecta del chat
        client.broadcast.to(data.sala).emit('listaPersonas', usuario.getPersonasPorSala(data.sala));

        //retorna las personas conectadas al chat
        callback(usuario.getPersonasPorSala(data.sala));
    })

    //escuchar mensaje del cliente
    client.on('crearMensaje', (data) => {

        let persona = usuario.getPersona(client.id);
        let mensaje = crearMensaje(persona.nombre, data.mensaje);
        
        client.broadcast.to(persona.sala).emit('crearMensaje', mensaje);
    })

    client.on('disconnect', () => {
        let personaBorrada= usuario.borrarPersona(client.id);

        client.broadcast.to(personaBorrada.sala).emit('crearMensaje', crearMensaje('Administrador', `${personaBorrada.nombre} abondono el chat`));
        //para saber cuando se desconecta del chat
        client.broadcast.to(personaBorrada.sala).emit('listaPersonas', usuario.getPersonasPorSala(personaBorrada.sala));
    });

    //mensaje privado

    client.on('mensajePrivado', (data)=>{
        let persona = usuario.getPersona(client.id);

        client.broadcast.to(data.para).emit('mensajePrivado', crearMensaje(persona.id, data.mensaje));
    })

});