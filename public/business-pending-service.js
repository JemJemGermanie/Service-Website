function getClientsFromLocalStorage() {
    // Get the data from localStorage and parse it, or return an empty array if no data is found
    return JSON.parse(localStorage.getItem('clients')) || [];
}


const clients = getClientsFromLocalStorage();


function renderServices() {

    const PendingServicesList = document.getElementById("PendingServicesList");
    const UnpaidServicesList = document.getElementById("UnpaidServicesList");

    PendingServicesList.innerHTML = '';
    UnpaidServicesList.innerHTML = '';


    clients.forEach(function(client) {

        if (client.services_upcoming && client.services_upcoming.length > 0) {
            PendingServicesList.innerHTML += `<h2>${client.name}</h2><ul>`;

            client.services_upcoming.forEach(function(service, index) {
                PendingServicesList.innerHTML += `
                    <li>
                        ${service.name} - $${service.price}
                        <button onclick="moveCompletedService('${client.name}', ${index})">Completed Service</button>
                    </li>
                `;
            });

            PendingServicesList.innerHTML += `</ul>`;
        }

        if (client.services && client.services.length > 0) {
            // Add client name as a heading
            UnpaidServicesList.innerHTML += `<h2>${client.name}</h2><ul>`;

            client.services.forEach(function(service) {
                UnpaidServicesList.innerHTML += `
                    <li>
                        ${service.name} - $${service.price}
                        <button onclick="displayConfirmation('${client.name}', '${service.name}')">Notify Customer</button>
                    </li>
                `;
            });

            // Close the list
            UnpaidServicesList.innerHTML += `</ul>`;
        }
    });
}

function moveCompletedService(clientName, serviceIndex) {
    // Find the client by name
    const client = clients.find(function(c) {
        return c.name === clientName;
    });

    const service = client.services_upcoming.splice(serviceIndex, 1)[0];
    client.services.push(service);

    localStorage.setItem('clients', JSON.stringify(clients));
    renderServices();
}

function displayConfirmation(clientName, serviceName) {
    alert(`Customer ${clientName} has been notified about unpaid service: ${serviceName}`);
}

renderServices();
