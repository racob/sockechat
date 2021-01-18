const chatForm = document.getElementById('chat-form');
const chatMessages = document.getElementById('chat-messages');
const usersList = document.getElementById('users');
const messageBox = document.getElementById('msg');
const feedback = document.getElementById('feedback');

//Get username
const urlParams = new URLSearchParams(window.location.search);
const username = urlParams.get('username');

const socket = io();

//Join chat
socket.emit('joinChat', username);

//Get users
socket.on('usersList', (users) => {
    renderUsersList(users);
});

//Message from server
socket.on('message', message => {
    console.log(message);
    outputMessage(message);

    //Scroll to bottom when there's a new message
    chatMessages.scrollTop = chatMessages.scrollHeight;
})

//Wait for typing
messageBox.addEventListener('keypress', function(){
    socket.emit('typing', username);
});

//shows someone is typing...
socket.on('typing', (username) => {
    feedback.innerHTML = '<p><em>' + username + ' is typing a message...</em></p>';
});

// Message submit
chatForm.addEventListener('submit',(e) => {
    e.preventDefault();

    //Get message text
    const msg = e.target.elements.msg.value;

    //Emitting message to a server
    socket.emit('chatMessage',msg);

    //Clear input
    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();
});

//Output message to dom
function outputMessage(message) {
    const div = document.createElement('div');
    const messageContainer = document.getElementById('chat-messages');
    div.classList.add('px-4','mt-3','pb-0');
    if(message.username != 'SockeBot'){
        div.innerHTML = `<p class="text-success"><strong>${message.username}</strong> <span class="text-muted ml-1"><em>${message.time}</em></span></p>
        <p class="mb-2 mt-n2 text-light">
            ${message.text}
        </p>`;
    } else {
        div.innerHTML = `<p class="text-primary"><strong>${message.username}</strong> <span class="text-muted ml-1"><em>${message.time}</em></span></p>
        <p class="mb-2 mt-n2 text-muted">
            ${message.text}
        </p>`;
    }
    
    messageContainer.appendChild(div);
}

//Render user list
function renderUsersList(users) {
    usersList.innerHTML = '';
    users.forEach(user => {
        const list = document.createElement('li');
        list.innerHTML = `<strong>${user.username}</strong>`;
        usersList.appendChild(list);
    });
}