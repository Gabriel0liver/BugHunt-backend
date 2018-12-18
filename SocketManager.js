
class SocketManager {
  constructor(){
  }
  initIO(io){
    this.io=io;
  }

  messageReceived(chatId){
    this.connectToNamespace(chatId);
    console.log(this.socket)
    this.socket.emit("NEW_MESSAGE");
  }
 
  connectToNamespace (nsp){
    this.socket = this.io.of('/'+nsp);
    this.socket.on('connection', (sk) => {
    });
    return;
  }

  socketConnected(socket){
    this.socket = socket;
  }
}

module.exports = new SocketManager();