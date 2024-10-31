const clients = JSON.parse(localStorage.getItem('clients'));

function renderClients() {
    const clientsList = document.getElementById('ClientList');
    clientsList.innerHTML = '';

    clients.forEach((client, index) => {
        // Create a container for each client
        const clientDiv = document.createElement('div');
        clientDiv.classList.add('client');

        // Client name and "View Services" button
        const clientHeader = document.createElement('div');
        clientHeader.classList.add('client-header');

        const clientName = document.createElement('h2');
        clientName.textContent = client.name;

        const viewServicesBtn = document.createElement('button');
        viewServicesBtn.textContent = 'View Services';
        viewServicesBtn.classList.add('view-services-btn');
        viewServicesBtn.dataset.clientIndex = index; // Store client index

        // Event listener for the button
        viewServicesBtn.addEventListener('click', (event) => {
            toggleServices(event);
        });

        const viewClientBtn = document.createElement('button');
        viewClientBtn.textContent = 'View Client';
        viewClientBtn.classList.add('view-client-btn');
        viewClientBtn.dataset.clientIndex = index;

        viewClientBtn.addEventListener('click', () => {
            window.location.href = client.pageURL;
        });

        clientHeader.appendChild(clientName);
        clientHeader.appendChild(viewServicesBtn);
        clientHeader.appendChild(viewClientBtn);
        clientDiv.appendChild(clientHeader);

        // Services list (initially hidden)
        const servicesList = document.createElement('ul');
        servicesList.classList.add('services-list');
        servicesList.style.display = 'none'; // Hide initially
        servicesList.dataset.clientIndex = index; // Store client index

        client.services.forEach(service => {
            const serviceItem = document.createElement('li');
            serviceItem.textContent = `${service.name} - $${service.price.toFixed(2)}`;
            servicesList.appendChild(serviceItem);
        });

        clientDiv.appendChild(servicesList);
        clientsList.appendChild(clientDiv);
    });
}

function toggleServices(event) {
    const button = event.target;
    const clientIndex = button.dataset.clientIndex;

    // Find the corresponding services list
    const servicesList = document.querySelector(`.services-list[data-client-index="${clientIndex}"]`);

    if (servicesList.style.display === 'none') {
        servicesList.style.display = 'block';
        button.textContent = 'Hide Services';
    } else {
        servicesList.style.display = 'none';
        button.textContent = 'View Services';
    }
}

