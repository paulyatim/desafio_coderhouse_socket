const socket = io.connect();

function showMessage(data) {
    const html = data.map((elem) => {
        return(`<div><span style="color:blue"><strong>${elem.email}</strong></span> <span style="color:brown">[${elem.datetime}]</span>: <span style="color:green"><em>${elem.text}</em></span></div>`)
    }).join(" ");
    document.getElementById('messages').innerHTML = html;
}
socket.on('messages', function(data) { showMessage(data) });

function addMessage(e) {
    const currentdate = new Date();
    const datetime = `${currentdate.getDate()}/${currentdate.getMonth()+1}/${currentdate.getFullYear()} ${currentdate.getHours()}:${currentdate.getMinutes()}:${currentdate.getSeconds()}`
    const mensaje = {
        email: document.getElementById('email').value,
        text: document.getElementById('texto').value,
        datetime: datetime
    };
    socket.emit('new-message', mensaje);
    return false;}




function showProduct(data) {
    const html = data.map((elem) => {
        return(`<tr>
                    <th scope="row">${elem.nombre}</th>
                    <td>${elem.precio}</td>
                    <td><img style="height: 40px;" src=${elem.imagen} alt="icon"></td>
                </tr>`)
    }).join(" ");
    document.getElementById('products').innerHTML = html;
}
socket.on('products', function(data) { showProduct(data) });

function addProduct(e) {
    const product = {
        nombre: document.getElementById('nombre').value,
        precio: document.getElementById('precio').value,
        imagen: document.getElementById('imagen').value
    };
    socket.emit('new-product', product);
    return false;}