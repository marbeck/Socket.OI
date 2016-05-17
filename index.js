var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function (socket) {
  socket.on('chat message', function (msg) {
    console.log('message: ' + msg);

    // var encryptedMsg = encrypt(msg, password);
    io.emit('chat message', msg); //sends the message to everyone includind the sender

    //var decryptedMsg = decrypt(encryptedMsg, password);
    //io.emit('chat message', decryptedMsg); //sends the message to everyone includind the sender
  });
});

http.listen(3000, function () {
  console.log('listening on *:3000');
});


var crypto = require('crypto');

var encrypt = function encrypt(input, password) {
  var key = generateKey(password);
  var initializationVector = generateInitializationVector(password);

  var data = new Buffer(input.toString(), 'utf8').toString('binary');

  var cipher = crypto.createCipheriv('aes-256-cbc', key, initializationVector.slice(0, 16));
  var encrypted = cipher.update(data, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  var encoded = new Buffer(encrypted, 'binary').toString('base64');

  return encoded;
};

var decrypt = function decrypt(input, password) {
  var key = generateKey(password);
  var initializationVector = generateInitializationVector(password);

  var input = input.replace(/\-/g, '+').replace(/_/g, '/');
  var edata = new Buffer(input, 'base64').toString('binary');

  var decipher = crypto.createDecipheriv('aes-256-cbc', key, initializationVector.slice(0, 16));
  var decrypted = decipher.update(edata, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  var decoded = new Buffer(decrypted, 'binary').toString('utf8');

  return decoded;
};

var generateKey = function generateKey(password) {
  var cryptographicHash = crypto.createHash('md5');
  cryptographicHash.update(password);
  key = cryptographicHash.digest('hex');

  return key;
}
var generateInitializationVector = function generateInitializationVector(password) {
  var cryptographicHash = crypto.createHash('md5');
  cryptographicHash.update(password + key);
  initializationVector = cryptographicHash.digest('hex');

  return initializationVector;
}

var password = 'MyPassword';
var originalStr = 'hello world!';

var encryptedStr = encrypt(originalStr, password);
var decryptedStr = decrypt(encryptedStr, password);