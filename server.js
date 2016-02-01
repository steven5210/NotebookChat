var express = require('express');
var app = express();
var path = require('path');
app.get('/', function(req, res){
	res.render('index', {title: "Group Chat"});
})

app.use(express.static(path.join(__dirname, './assets')));

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
var port = process.env.PORT || 9000;
var server = app.listen(9000, function(){
	console.log('Listening on port over 9000!');
})


var users = {};
var messages = [];
var d = new Date();
var curr_date = d.getDate();
var curr_month = d.getMonth() + 1; //Months are zero based
var curr_year = d.getFullYear();
var date_stamp = curr_month + "/" + curr_date + "/" + curr_year;

var io = require('socket.io').listen(server)
io.sockets.on('connection', function(socket){

	socket.on('a_new_user', function(name){
		users[socket.id] = name
		io.emit('new_user', users, messages)
		io.emit('show_users', users)
	})
	socket.on('post_message', function(message){
		messages.push("<div class='chat-box-left'>" + message.message + "<br>" + " -" + date_stamp + "</div>" + "<div class='chat-box-name-left'>" + users[socket.id] + "</div><hr class='hr-clas'/>")
		io.emit('new_message', users[socket.id], message)
	})
	socket.on('disconnect', function(){
		if (users[socket.id]) {
		io.emit('user_dis', users[socket.id])
		delete users[socket.id]
		io.emit('show_users', users)
		}
	})

})