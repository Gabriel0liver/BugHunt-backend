const { NEW_CHAT, NEW_USER, MESSAGE_RECEIVED, TYPING, STOPPED_TYPING} = require('./events');

class SocketManager {
  constructor(){
  }
  initIO(io){
    this.io=io;
  }
  newChat({ from, to , chat}){
    this.connectToNamespace(to);
    this.socket.emit(NEW_CHAT, chat);
    this.socket.on('disconnection', function(){
    })
  }
  newUser(userId){
    this.connectToNamespace(userId);
  }
  messageReceived(message, toUserId, fromUserMail){
    this.connectToNamespace(toUserId);
    this.socket.emit(MESSAGE_RECEIVED, fromUserMail);
  }
  newMessages(userId, idChat){
    this.connectToNamespace(userId);
    this.socket.emit(NEW_MESSAGES, idChat);
  }
  connectToNamespace (nsp){
    this.socket = this.io.of('/'+nsp);
    this.socket.on('connection', (sk) => {
    });
    this.socket.on(TYPING, (msg) => {
    });
    this.socket.on(STOPPED_TYPING, (sk) => {
    });
   
    return;
  }
  userConnected (){

  }
  userDisconnected(){

  }
  socketConnected(socket){
    this.socket = socket;
  }
}

module.exports = new SocketManager();