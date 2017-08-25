

const APIAI_TOKEN = '82d460bc554c4fa4a3e698332c510aef';
const APIAI_SESSION_ID = '2432432';

var express = require('express');
var app = express();

// set middleware to serve static assets
app.use(express.static(__dirname));

app.get('/', function(req, res) {
  res.sendFile('index.html');
});

var server = app.listen(process.env.PORT || 5000, () => {
  console.log(`Express running on ${server.address().port} in ${app.settings.env}`);
});

const apiai = require('apiai')(APIAI_TOKEN);

const io = require('socket.io')(server);
io.on('connection', socket => {
  socket.on('voice message', message => {
    console.log(`**** Processing: '${message}' ****`);
    const request = apiai.textRequest(message, {
      sessionId: APIAI_SESSION_ID
    });

    request.on('response', res => {
      socket.emit('bot response', res.result.fulfillment.speech);
    });

    request.on('error', error => {
      console.log(error);
    });

    request.end();
  });
});