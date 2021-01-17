const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const usersList = document.getElementById('users');

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
    div.classList.add('message');
    div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
    <p class="text">
     ${message.text}
    </p>`;
    document.querySelector('.chat-messages').appendChild(div);
}

//Render user list
function renderUsersList(users) {
    usersList.innerHTML = '';
    users.forEach(user => {
        const list = document.createElement('li');
        list.innerHTML = user.username;
        usersList.appendChild(list);
    });
}