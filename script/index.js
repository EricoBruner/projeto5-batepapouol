let nameUser = '';
let messages;

const urlCreate = "https://mock-api.driven.com.br/api/vm/uol/participants";
const urlStatus = "https://mock-api.driven.com.br/api/vm/uol/status";
const urlFetch = "https://mock-api.driven.com.br/api/vm/uol/messages";
const urlSend = "https://mock-api.driven.com.br/api/vm/uol/messages";
const urlCheck = "https://mock-api.driven.com.br/api/vm/uol/participants";
const token = "ZsXywYegbxnjAwhk1ftApevS";
axios.defaults.headers.common['Authorization'] = token;

function askName() {
    while(nameUser == '' || nameUser == null) {
        nameUser = prompt("Qual seu lindo nome?");
    }

    createConnection(nameUser);
}

function keepConnection() {
    axios.post(urlStatus, { 
        name: nameUser,
    })
    .then(function () {
        console.log(`logged in as ${nameUser}`);
    })  
    .catch(function (error) {
        console.log(`This name is already in use. Message: ${error}`);
        window.location.reload();
    })
}

async function createConnection(nameUser) {
    const response = await axios.get(urlCheck);
    let participants = response.data;
    let check = participants.find((participant) => {
        if(participant.name == nameUser) {            
            return participant;
        }
    })
    
    if(check) {
        console.log(`This name is already in use.`);
        window.location.reload();
    } else {   
        axios.post(urlCreate, { 
            name: nameUser,
        })
        .then(function () {
            setInterval(keepConnection, 5000);
            setInterval(fetchMessages, 3000);
        })  
        .catch(function (error) {
            console.log(`Error creating connection. Message: ${error}`);
            window.location.reload();
        })
    }
}

function fetchMessages() {
    axios.get(urlFetch, { 
        name: nameUser,
    })
    .then(function (response) {
        messages = response.data;
        loadMessages(messages);
    })  
    .catch(function (error) {
        console.log(`An error occurred while fetching messages. Message: ${error}`); 
        window.location.reload();
    })
}

function loadMessages(messages) {
    let chat = document.querySelector(".chat");
    chat.innerHTML = '';

    messages.map((message) => {
        let newMessage;
        let preposition = "para"
        if(message.type == "private_message") {preposition = "reservadamente para"}

        if(message.type == "status") {
            newMessage = `
                <div class="messages ${message.type}" data-test="message">
                    <p>
                        <time> (${message.time}) </time>
                        <strong> ${message.from} </strong>
                        ${message.text}
                    </p>
                </div>
            `;
        } else {
            newMessage = `
                <div class="messages ${message.type}" data-test="message">
                    <p>
                        <time> (${message.time}) </time>
                        <strong> ${message.from} </strong>
                        ${preposition}  
                        <strong> ${message.to}: </strong>
                        ${message.text}
                    </p>
                </div>
            `;
        }
       
        chat.innerHTML = chat.innerHTML + newMessage;
    })
}

function sendMessage() {
    axios.defaults.headers.common['Authorization'] = token;
    let message = document.getElementById("input");
    
    axios.post(urlSend, { 
        from: nameUser,
        to: "Todos",
        text: message.value,
        type: "message",
    })
    .then(function () {
        fetchMessages();
    })  
    .catch(function (error) {
        console.log(`An error occurred while send messages. Message: ${error}`);
        window.location.reload();
    })

    message.value = '';
}

askName();


