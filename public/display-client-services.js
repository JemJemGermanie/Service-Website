async function getClients() {
    const response = await fetch('/clients');
    return response.json();
}

async function displayClientInfo() {
    const clients = await getClients();
    const currentPathURL = window.location.pathname;
    const client = clients.find(c => c.pageURL === currentPathURL);

    if (client) {
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
    } else {
        document.getElementById("clientInfo").innerHTML = `<p>Client information not found.</p>`;
    }
}