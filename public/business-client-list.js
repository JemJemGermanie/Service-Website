async function fetchOrders(clientID, status) {
    const response = await fetch(`/orders/${clientID}/${status}`);
    if (!response.ok) {
        throw new Error('Error fetching orders');
    }
    return response.json();
}

async function fetchClients() {
    const response = await fetch('/clients');
    if (!response.ok) {
        throw new Error('Error fetching clients');
    }
    return response.json();
}

async function renderClients() {
    const clientsList = document.getElementById('ClientList');
    clientsList.innerHTML = '';

    const clients = await fetchClients();

    for (const client of clients) {
        try {
            // Create a container for each client
            const clientDiv = document.createElement('div');
            clientDiv.classList.add('client');

            // Client name and "View Services" button
            const clientHeader = document.createElement('div');
            clientHeader.classList.add('client-header');

            const clientName = document.createElement('h2');
            clientName.textContent = client.name;

            const viewServicesBtn = document.createElement('button');
            viewServicesBtn.textContent = 'View Upcoming Services';
            viewServicesBtn.classList.add('view-services-btn');
            viewServicesBtn.dataset.clientIndex = client.id; // Store client ID

            // Event listener for the button
            viewServicesBtn.addEventListener('click', (event) => {
                toggleServices(event, client.id);
            });

            const viewClientBtn = document.createElement('button');
            viewClientBtn.textContent = 'View Client';
            viewClientBtn.classList.add('view-client-btn');
            viewClientBtn.dataset.clientIndex = client.id;

            viewClientBtn.addEventListener('click', () => {
                window.location.href = `client-info.html?id=${client.id}`;
            });

            clientHeader.appendChild(clientName);
            clientHeader.appendChild(viewServicesBtn);
            clientHeader.appendChild(viewClientBtn);
            clientDiv.appendChild(clientHeader);

            // Services list (initially hidden)
            const servicesList = document.createElement('ul');
            servicesList.classList.add('services-list');
            servicesList.style.display = 'none'; // Hide initially
            servicesList.dataset.clientIndex = client.id; // Store client ID

            clientDiv.appendChild(servicesList);
            clientsList.appendChild(clientDiv);
        } catch (error) {
            console.error('Error rendering services:', error);
        }
    }
}

async function toggleServices(event, clientID) {
    const button = event.target;
    const clientIndex = button.dataset.clientIndex;
    const servicesList = document.querySelector(`.services-list[data-client-index="${clientIndex}"]`);

    if (servicesList.style.display === 'none') {
        try {
            const upcomingServices = await fetchOrders(clientID, 1);
            servicesList.innerHTML = upcomingServices.map(service => `
                <li>${service.name} - $${service.price.toFixed(2)}</li>
            `).join('');
            servicesList.style.display = 'block';
            button.textContent = 'Hide Services';
        } catch (error) {
            console.error('Error fetching services:', error);
        }
    } else {
        servicesList.style.display = 'none';
        button.textContent = 'View Upcoming Services';
    }
}

document.addEventListener('DOMContentLoaded', renderClients);
