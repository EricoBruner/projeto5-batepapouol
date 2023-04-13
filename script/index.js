let nameUser = '';
let messages;

const urlCreate = "https://mock-api.driven.com.br/api/vm/uol/participants";
const urlStatus = "https://mock-api.driven.com.br/api/vm/uol/status";
const urlFetch = "https://mock-api.driven.com.br/api/vm/uol/messages";
const token = "cshqAODWPkvCuVgNfgQB06EX";

function askName() {
    nameUser = '';
    
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
        askName();
    })
}

function createConnection(nameUser) {
    axios.defaults.headers.common['Authorization'] = token;

    axios.post(urlCreate, { 
        name: nameUser,
    })
    .then(function (response) {
        setInterval(keepConnection, 5000);
        console.log(response);
    })  
    .catch(function (error) {
        console.log(`This name is already in use. Message: ${error}`);
        askName();
    })
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
        askName();
    })
}

function loadMessages(messages) {
    let chat = document.querySelector(".chat");

    messages.map((message) => {
        let newMessage;
        let preposition = "para"
        if(message.type == "private_message") {preposition = "reservadamente para"}

        if(message.type == "status") {
            newMessage = `
                <div class="messages ${message.type}">
                    <p>
                        <time> (${message.time}) </time>
                        <strong> ${message.from} </strong>
                        ${message.text}
                    </p>
                </div>
            `;
        } else {
            newMessage = `
                <div class="messages ${message.type}">
                    <p>
                        <time> (${message.time}) </time>
                        <strong> ${message.from} </strong>
                        ${preposition}  
                        <strong> ${message.to} </strong>
                        ${message.text}
                    </p>
                </div>
            `;
        }
       
        chat.innerHTML = chat.innerHTML + newMessage;
    })
}

askName();
fetchMessages();


