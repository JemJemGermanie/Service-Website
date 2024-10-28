const admins = [
    {
        name: "boss", password: 'password1'
    },

    {
        name: "management", password: 'password2'
    },

    {
        name: "IT", password: 'password3'
    }
]
    

function saveAdminsToLocalStorage() {
    localStorage.setItem('admins', JSON.stringify(admins));
}

function getAdminsFromLocalStorage() {
    return JSON.parse(localStorage.getItem('admins')) || [];
}

// Automatically save the clients data when this script runs
saveAdminsToLocalStorage();
