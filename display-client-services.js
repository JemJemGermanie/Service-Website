function getClientsFromLocalStorage(){
    return JSON.parse(localStorage.getItem('clients')) || [];
}
function displayClientInfo(){
    const clients = getClientsFromLocalStorage();

    const currentPathURL = window.location.pathname;
    const client = clients.find(c => c.pageURL === currentPathURL);

    if(client){
        document.getElementById("clientInfo").innerHTML = `
            <h2>Services</h2>
            <ul>
                ${client.services.map(service => `<li>${service.name}: $${service.price}</li>`).join('')}
            </ul>
            <h2>Completed Services</h2>
            <ul>
                ${client.services_complete.map(service => `<li>${service.name}: $${service.price}</li>`).join('')}
            </ul>
            <h2>Upcoming Services</h2>
            <ul>
                ${client.services_upcoming.map(service => `<li>${service.name}: $${service.price}</li>`).join('')}
            </ul>
            `;
    }
    else {
        document.getElementById("clientInfo").innerHTML = `<p>Client information not found.</p>`;
    }
}