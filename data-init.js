const services = ["Consulting", "Customer Support", "Software Development"];

function saveServicesToLocalStorage(){
    localStorage.setItem('services', services);
}

const companyName='Business'
const companyAddress="place"
const companyPhone=5145564632

function saveBusinessToLocalStorage() {
    localStorage.setItem('companyName', companyName);
    localStorage.setItem('companyAddress', companyAddress);
    localStorage.setItem('companyPhone', companyPhone);

}

const clients = [
    {
        name: "Alice Johnson", password: 'password1', 
        address: "1090 saint-laservices urent", phone : 5145145514,
        services: [
            { name: "Consulting", price: 150 },
            { name: "Software Development", price: 2000 }
        ],
        services_complete: [
            { name: "Consulting", price: 250 },
            { name: "Software Development", price: 2000 }
        ],
        services_upcoming: [
            { name: "Consulting", price: 25 },
            { name: "Software Development", price: 58 }
        ],
        pageURL: '/Service-Website/clients/alice-johnson.html'
    },
    
    {
        name: "Bob Smith", password: 'password2',
        address: "1090 saint-louis", phone : 5145145514,
        services: [
            { name: "Customer Support", price: 100 },
            { name: "Maintenance", price: 300 }
        ],
        services_complete: [
            { name: "Consulting", price: 250 },
            { name: "Software Development", price: 2000 }
        ],
        services_upcoming: [
            { name: "Consulting", price: 350 },
            { name: "Software Development", price: 2 }
        ],
             pageURL: '/Service-Website/clients/bob-smith.html'
    },
    {
        name: "Charlie Davis", password: 'password3',
        address: "1090 saint-treav", phone : 5146145514,
        services: [
            { name: "Consulting", price: 150 },
            { name: "Customer Support", price: 100 },
            { name: "Software Development", price: 2000 }
        ],
        services_complete: [
            { name: "Consulting", price: 250 },
            { name: "Software Development", price: 2000 }
        ],
        services_upcoming: [
            { name: "Consulting", price: 2 },
            { name: "Software Development", price: 200 }
        ],
            pageURL: '/Service-Website/clients/charlie-davis.html'
    }
];

function saveClientsToLocalStorage() {
    localStorage.setItem('clients', JSON.stringify(clients));
}

function getClientsFromLocalStorage() {
    return JSON.parse(localStorage.getItem('clients')) || [];
}

// Automatically save the services data when this script runs
saveServicesToLocalStorage();
// Automatically save the business data when this script runs
saveBusinessToLocalStorage();
// Automatically save the clients data when this script runs
saveClientsToLocalStorage();
