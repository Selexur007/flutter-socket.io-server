
const {io} = require('../index');
const Band = require('../models/band');
const Bands = require('../models/bands');

const bands = new Bands();

bands.addBand(new Band('Queen'));
bands.addBand(new Band('Bon Jovi'));


console.log(bands);

//Mensajes de Sockets
io.on('connection', client => {
    
    console.log('Cliente conectado');
     client.emit('active-bands', bands.getBands());

    client.on('disconnect', () => {
        console.log('Cliente desconectado');
    });

    client.on('mensaje', (payload)=>{
        console.log('Mensaje!!', payload);
        
        io.emit('mensaje', {admin: 'Nuevo mensaje'});
    
    });

    //VOTOS 
      client.on('vote-band', (payload) =>{

       bands.voteBand(payload.id);
       //mensaje enviado a todos los que están conectados
       io.emit('active-bands', bands.getBands());

      });

      // AGREGAR NUEVAS BANDAS
      client.on('add-band', (payload) =>{
        const newBand =  new Band(payload.name);
        bands.addBand(newBand);
        //mensaje enviado a todos los que están conectados
        io.emit('active-bands', bands.getBands());
 
       });

       //ELIMINAR BANDAS
       client.on('delete-band', (payload) =>{

        bands.deleteBand(payload.id);
        //mensaje enviado a todos los que están conectados
        io.emit('active-bands', bands.getBands());
 
       });
 

   /*  client.on('emitir-mensaje',(payload) =>{
      //  io.emit('nuevo-mensaje', payload);
      client.broadcast.emit('nuevo-mensaje', payload);
    }) */

  });
