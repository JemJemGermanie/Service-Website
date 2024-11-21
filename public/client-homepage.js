var client;
document.addEventListener('DOMContentLoaded', () => {
  fetch('/session-details')
    .then(response => {
      if (!response.ok) {
        throw new Error('No active session');
      }
      return response.json();x
    })
    .then(user => {
      client = user;
      clientInfo.innerHTML += `Welcome, ${client.name}`; // Update the DOM with the client's name
      //renderServices(); // Call the renderServices function to display services
    })
    .catch(error => {
      console.error('Error fetching session details:', error);
      alert('You need to log in first.');
      window.location.href = '/client-login.html';
    });
    
});

// Function to render services
function renderServices() {
  const clientName = localStorage.getItem('clientName');
  const clients = JSON.parse(localStorage.getItem('clients')) || [];
  const client = clients.find(c => c.name === clientName);
  localStorage.setItem('logFl', 1);
  console.log('Rendering services for client:', JSON.stringify(client, null, 2));

  if (client) {
    clientInfo.innerHTML += `
      <h2>
      Welcome, ${clientName}
      </h2>
    `;
    const UpcomingServicesList = document.getElementById("UpcomingServicesList");
    const UnpaidServicesList = document.getElementById("UnpaidServicesList");
    const CompletedServicesList = document.getElementById("CompletedServicesList");

    // Render Upcoming Services
    UpcomingServicesList.innerHTML = client.services_upcoming.map((service, index) => `
      <li class="service-item">
        ${service.name} - $${service.price.toFixed(2)}
        <button class="action-button cancel-button" onclick="removeUpcomingService(${index})">Cancel Service</button>
      </li>
    `).join('');

    // Render Unpaid Services
    UnpaidServicesList.innerHTML = client.services.map((service, index) => `
      <li class="service-item">
        ${service.name} - $${service.price.toFixed(2)}
        <div class="action-buttons">
          <button class="action-button pay-button" onclick="payForService(${index})">Pay Now</button>
        </div>
      </li>
    `).join('');

    // Render Completed Services
    CompletedServicesList.innerHTML = client.services_complete.map((service, index) => `
      <li class="service-item">
        ${service.name} - $${service.price.toFixed(2)}
      </li>
    `).join('');
  }
}

// Function to view bill details
function viewBill(index) {
    const clientName = localStorage.getItem('clientName');
    const clients = JSON.parse(localStorage.getItem('clients')) || [];
    const client = clients.find(c => c.name === clientName);

    if (client) {
        const service = client.services[index];
        localStorage.setItem('selectedService', JSON.stringify({
            clientName: client.name,
            service: service
        }));
        window.location.href = 'client-bill.html';
    } else {
        alert('Client not found. Please log in again.');
        window.location.href = 'client-login.html';
    }
}

// Function to remove an upcoming service
function removeUpcomingService(index) {
    const clientName = localStorage.getItem('clientName');
    const clients = JSON.parse(localStorage.getItem('clients')) || [];
    const client = clients.find(c => c.name === clientName);

    if (client) {
        client.services_upcoming.splice(index, 1);
        localStorage.setItem('clients', JSON.stringify(clients));
        renderServices();
    }
}

// Function to move a service from unpaid to completed services
function moveCompletedService(index) {
    const clientName = localStorage.getItem('clientName');
    const clients = JSON.parse(localStorage.getItem('clients')) || [];
    const client = clients.find(c => c.name === clientName);

    console.log('Before moving service:', JSON.stringify(client, null, 2));

    if (client) {
        const completedService = client.services.splice(index, 1)[0];
        client.services_complete.push(completedService);

        console.log('After moving service:', JSON.stringify(client, null, 2));
        localStorage.setItem('clients', JSON.stringify(clients));

        renderServices();
    } else {
        alert('Client not found. Please log in again.');
        window.location.href = 'client-login.html';
    }
}

// Function to view receipt details
function viewReceipt(index) {
    const clientName = localStorage.getItem('clientName');
    const clients = JSON.parse(localStorage.getItem('clients')) || [];
    const client = clients.find(c => c.name === clientName);
    const service = client.services_complete[index];

    localStorage.setItem('selectedService', JSON.stringify(service));
    window.location.href = 'clients-receipt.html';
}