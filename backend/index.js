const express = require('express')
const { createServer } = require('node:http');
const { join } = require('node:path');
const { Server } = require('socket.io');
const cors = require("cors")

const app = express()

app.use(cors())
// app.use((req, res, next) => {
//     res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5500');
//     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
//     res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
//     res.setHeader('Access-Control-Allow-Credentials', true);
//     // Помните, использование звёздочек в качестве маски может быть рискованным.
//     next();
// });
const server = createServer(app)
const io = new Server(server)
let y = 0
let x = 0;
let xdelta = x;
let ydelta = y;
let oldTime = Date.now();
let canvas = {
    width: 800,
    height: 800
}
function gameLoop() {
    let now = Date.now()
    let timeDelta = now - oldTime
    if (timeDelta >= 300) {
        // clear()
        oldTime = now
        x = x + xdelta
        y = y + ydelta
        if (x >= canvas.width) x = 0
        if (x < 0) x = canvas.width - 80
        if (y < 0) y = canvas.height - 80
        if (y > canvas.height - 80) y = 0

        // if(!(x == 800 && xdelta == 80)) {
        //     console.log(!(x >= canvas.width && xdelta == 80))

        // }

        // console.log(y);
        // drew(x, y, 'blue')
        console.log(x, y)
        io.emit('data', { x, y })
    }

}
setInterval(gameLoop, 0)

const PORT = 5000

app.get('/', (req, res) => {
    res.sendFile(join(__dirname, 'public', 'index.html'))
})


io.on('connection', (socket) => {
    socket.on('data', (msg) => {
        switch (msg) {
            case 'd':
                if (xdelta == -80 && ydelta == 0) {
                    return
                }
                xdelta = +80;
                ydelta = 0;
                break;
            case 'a':
                if (xdelta == +80 && ydelta == 0) {
                    return
                }
                xdelta = -80;
                ydelta = 0;
                break;
            case 'w':
                if (xdelta == 0 && ydelta == 80) {
                    return
                }
                xdelta = 0;
                ydelta = -80;
                break;
            case 's':
                if (xdelta == 0 && ydelta == -80) {
                    return
                }
                xdelta = 0;
                ydelta = 80;
                break;

            default:
                break;
        }
    })
    console.log('a user connectead');
});

server.listen(PORT, () => { console.log(`server work on ${PORT} port`) })