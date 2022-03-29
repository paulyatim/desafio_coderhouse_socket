const express = require('express');
const { Server: HttpServer } = require('http');
const { Server: IOServer } = require('socket.io');

const app = express();
const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);

const handlebars = require('express-handlebars');
const router = express.Router();
const Productos = require("./Productos.js");
app.use(express.urlencoded({extended: true}));
app.use('/productos', router);
app.use(express.static("public"));
const fs = require('fs');

const productos = new Productos();

app.engine('hbs', handlebars.engine({
    extname: '.hbs',
    defaultLayout: 'index.hbs',
    layoutsDir: __dirname + '/views/layouts',
    partialsDir: __dirname + '/views/partials'
}));

app.set('views', './views');
app.set('view engine', 'hbs');

router.get("/", (req, res) => {
    try {
        const prods = { productos: productos.getAll}
        res.render('main', prods)
        res.status(200)
    } catch(error) {
        res.status(500).render(error.message)
    }
});

httpServer.listen(8080, function() {
    console.log('Servidor corriendo en http://localhost:8080');
})

const messages = [];

function writeMessage(data) {
    fs.promises.writeFile('./messages.txt', JSON.stringify(data, null, 2));

}

io.on('connection', function(socket) {
    console.log('Un cliente se ha conectado');
    socket.emit('messages', messages);
    socket.on('new-message', data => {
        messages.push(data);
        writeMessage(messages);
        io.sockets.emit('messages', messages);
    })
    socket.emit('products', productos.getAll);
    socket.on('new-product', data => {
        productos.save(data);
        io.sockets.emit('products', productos.getAll);
    })
});

app.use(express.static('public'));