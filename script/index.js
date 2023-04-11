let nameUser = '';
const urlCreate = "https://mock-api.driven.com.br/api/vm/uol/participants";
const urlStatus = "https://mock-api.driven.com.br/api/vm/uol/status";
const token = "cshqAODWPkvCuVgNfgQB06EX";

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
        console.log(error);
    })
}

askName();


