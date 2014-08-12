var app = {};

app.username;
app.server = 'http://127.0.0.1:3000/classes/';
app.currentRoom = 'lobby';
app.rooms = [];
app.friends = [];
app.messages = [];
app.$chats;
app.messageTemplate = _.template("<tr><td class='username'>" +
    "<%= username %></td><td class='message'><%= message %></td></tr>");
app.roomTemplate = _.template('<option value="<%=room%>"><%=room%></option>');

app.init = function() {

  //message submit listener
  $('.messageForm').on('submit', function(event) {
    event.preventDefault();
    app.username = $('#username').val();
    app.message = $('#message').val();
    $('#message').val('');
    app.send({username: app.username,
              message: app.message,
              room: app.currentRoom });
  });

  //create room listener
  $('.roomForm').on('submit', function(event) {
    event.preventDefault();
    app.addRoom($('#room').val());
  });

  //change room listener
  $('#roomSelector').on('change', function(event) {
    app.currentRoom = $('#roomSelector').val();
  });

  //add friend listener
  $(document).on('click', '.username', function(event) {
    var friend = $(event.target).text();
    if (!_.contains(app.friends, friend)) {
      app.friends.push(friend);
    }
    app.render();
  });

  $('.refresh').on('click', function(event) {
    app.fetch();
  });

  app.addRoom('lobby');
};

app.clearMessages = function() {
  $('table').empty();
};

app.displayMessage = function(message) {
  var m = $(app.messageTemplate(message));
  if (_.contains(app.friends, message.username)) {
    m.css('font-weight', 'bold');
  }
  $('table').prepend(m);
};

app.addRoom = function(room) {
  if (!_.contains(app.rooms, room)) {
    app.rooms.push(room);
    $('#roomSelector').append(app.roomTemplate({room: room}));
    $('#room').val('');
  }
};

app.render = function(room) {
  app.clearMessages();
  app.messages.forEach(function(message) {
      app.displayMessage(message);
  });
};

app.send = function(message) {
  message = JSON.stringify(message);
  $.ajax({
    url: app.server + app.currentRoom,
    type: 'POST',
    contentType: 'application/json',
    data: message,
    error: function(data) { console.log('Error:', data)},
    success: function(data) { }
  });
};

app.fetch = function() {
  $.ajax({
    url: app.server + app.currentRoom,
    type: 'GET',
    contentType: 'application/json',
    success: app.handleNewData
  });
}

app.handleNewData = function(data) {
  data = JSON.parse(data).results;
  console.log(data)
  app.messages = data;
  app.render();
};

app.init();
