require('dotenv').config();

const express = require('express');
const app = express();
app.use(express.static(__dirname + '/views'));
app.use(express.static(__dirname + '/public'));

const APIAI_TOKEN = process.env.APIAI_TOKEN;
const APIAI_SESSION_ID = process.env.APIAI_SESSION_ID;

const server = app.listen(5000, () => {
  console.log('Listening on port 5000');
});

const apiai = require('apiai')(APIAI_TOKEN);
const io = require('socket.io')(server);

io.on('connection', () => {
  console.log('a user connected');
});

app.get('/', (req, res) => {ª
  res.sendFile('index.html');
});



io.on('connection', (socket) => {
  socket.on('chat message', (text) => {
    let apiaiReq = apiai.textRequest(text, {
      sessionId: APIAI_SESSION_ID
    });

    apiaiReq.on('response', (response) => {
      let aiText = response.result.fulfillment.speech;
      socket.emit('bot reply', aiText);
    });

    apiaiReq.on('error', (error) => {
      console.log(error);
    });
    apiaiReq.end();
  })
});
