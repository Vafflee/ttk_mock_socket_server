import { WebSocketServer } from "ws";
import { EVENTS, SEVERITY } from "./constants.js";

Array.prototype.random = function () {
  return this[Math.floor((Math.random()*this.length))];
}

const server = new WebSocketServer({ port: 5000}, () => {
  console.log('Server is listening on port 5000')
});

server.on('connection', onConnect);

function onConnect(socket) {
  console.log('Client connected: ' + socket.id);

  socket.send(JSON.stringify({
    type: 'init',
    payload: {
      message: 'Connected',
      dataFormat: {
        date: 'date',
        location: 'string',
        event: 'string',
        severity: 'string',
        msg: 'string',
        reserved: 'string'
      }
    }
  }))

  const interval = setInterval(() => {

    const data = {
      date: Date.now(),
      location: 'Location #' + Math.ceil(Math.random() * 10),
      event: EVENTS[Math.floor(Math.random()*EVENTS.length)],
      severity: SEVERITY[Math.floor(Math.random()*SEVERITY.length)],
      msg: 'Message with random number - ' + Math.ceil(Math.random() * 100),
      reserved: 'true'
    };

    socket.send(JSON.stringify({
      type: 'event',
      payload: {
        message: 'New event emitted',
        data
      }
    }))
  }, 7000);

  socket.on('message', (data) => {
    console.log('Recieved message: ' + data)
  })

  socket.on('close', () => {
    clearInterval(interval);
  })

}