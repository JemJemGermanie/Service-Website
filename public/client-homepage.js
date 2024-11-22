var client;
var UpcomingServices;
var UnpaidServices;
var CompletedServices;

document.addEventListener('DOMContentLoaded', () => {
  fetch('/session-details')
    .then(response => {
      if (!response.ok) {
        throw new Error('No active session');
      }
      return response.json();
    })
    .then(user => {
        client = user;
        clientInfo.innerHTML += `Welcome, ${client.name}`; // Update the DOM with the client's name
        fetch('/orders/' + client.id)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error fetching orders');
                }
                return response.json();
            })
            .then(orders => {
                UpcomingServices = orders.filter(order => order.status === 0);
                UnpaidServices = orders.filter(order => order.status === 1);
                CompletedServices = orders.filter(order => order.status === 2);
                renderServices();
            })
    })
    .catch(error => {
      console.error('Error fetching session details:', error);
      alert('You need to log in first.');
      window.location.href = '/client-login.html';
    });
});

// Function to render services
function renderServices() {
  console.log('Rendering services for client:', JSON.stringify(client, null, 2));

  if (client) {
    const UpcomingServicesList = document.getElementById("UpcomingServicesList");
    const UnpaidServicesList = document.getElementById("UnpaidServicesList");
    const CompletedServicesList = document.getElementById("CompletedServicesList");

    // Render Upcoming Services
    UpcomingServicesList.innerHTML = UpcomingServices.map((order, index) => `
      <li class="service-item">
        ${order.service} - $${order.price.toFixed(2)}
        <button class="action-button cancel-button" onclick="removeUpcomingService(${index})">Cancel Service</button>
      </li>
    `).join('');

    // Render Unpaid Services
    UnpaidServicesList.innerHTML = UnpaidServices.map((order, index) => `
      <li class="service-item">
        ${order.service} - $${order.price.toFixed(2)}
        <div class="action-buttons">
          <button class="action-button pay-button" onclick="payForService(${index})">Pay Now</button>
            <button class="action-button view-bill-button" onclick="viewBill(${index})">View Bill</button>
          </div>
      </li>
    `).join('');

    // Render Completed Services
    CompletedServicesList.innerHTML = CompletedServices.map((order, index) => `
      <li class="service-item">
        ${order.service} - $${order.price.toFixed(2)}
      </li>
    `).join('');
  }
}

// Function to view bill details
function viewBill(index) {
    if (client) {
        const service = UnpaidServices[index];
        const bill = {
            client: client.name,
            service: service.service,
            price: service.price,
            order_date: service.order_date,
            completion_date: service.completion_date
        }
//        window.location.href = 'client-bill.html';   IMPLEMENT COOKIES TO PASS DATA TO THE NEXT PAGE
    }
    else {
        alert('Client not found. Please log in again.');
        window.location.href = 'client-login.html';
    }
}


function payForService(index) {
    if (client) {
        const service = UnpaidServices[index];
        fetch('/orders/'+`${service.id}`+'/status', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                status: 2,
            })
        })
        .then(response => {
          if (!response.ok) {
            throw new Error('Error paying for service');
          }
          return response.json();
        })
        .then(() => {
          alert('Payment successful!');
          window.location.reload();
          })
    }

    else {
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