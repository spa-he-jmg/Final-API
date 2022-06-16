const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const passport = require('passport');

const app = express();

require('./config/database');

require('./models/user');
require('./models/room');

require('./config/passport')(passport);

app.use(passport.initialize());

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());

app.use(cors({ credentials: true, origin: true }));

app.use(require('./routes'));

const server = app.listen(3000);

const io = require('socket.io')(server, {
    cors: {
        origin: 'http://localhost:3001'
    }
});

io.on('connection', (socket) => {
    console.log('Client connected');
    socket.emit('connection', null);

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });

    socket.on('join-room', ({ roomId }) => {
        console.log(roomId)

        socket.join(roomId);

        socket.on('send-message', async ({ message }) => {
            console.log(message);
            
            socket.to(roomId).emit('message-received', message);
        });
    });
});