const http = require('http');
const express = require('express');
const port = process.env.PORT || 8080;
const app = express();
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const {mysql, sqlite} = require('./db/db-config')
const Productos = require('./Productos.js');
const Chats = require('./Chat.js');

const Producto = new Productos(mysql);
const Chat = new Chats(sqlite)

app.use(express.json());
app.use(express.urlencoded());

const routes_back = require('./routes_back.js');
app.use("/api/productos", routes_back);

const routes_front = require('./routes_front.js');
app.use('', routes_front)

io.on('connection', function(socket) {
   const ProductosConst = Producto.getAll().then(result => {
      if (result !== undefined) {
         return socket.emit('listProducts', result);
      } else {
         return socket.emit('listProducts', []);
      }
   });

   const ChatConst = Chat.getAll().then(result => {
      if (result !== undefined) {
         return socket.emit('listMessages', result);
      } else {
         return socket.emit('listMessages', []);
      }
   })
   
   ProductosConst;
   ChatConst;

   socket.on('messages', data => {
      const ChatSave = Chat.save(data).then(result => {
         const ChatConst2 = Chat.getAll().then(result => {
            if (result !== undefined) {
               return socket.emit('listMessages', result);
            } else {
               return socket.emit('listMessages', []);
            }
         })
      });
   });

   //Guardar productos
   socket.on('newProduct', data => {
      const ProductosSave = Producto.save(data).then(result => {
         const ProductosConst2 = Producto.getAll().then(result => {
            if (result !== undefined) {
               return socket.emit('listProducts', result);
            } else {
               return socket.emit('listProducts', []);
            }
         });
     });
   });


});



server.listen(port, () => {
   console.log(`Aplicación ejecutandose en el puerto: ${port}`);
});
