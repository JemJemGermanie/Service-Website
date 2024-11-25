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
        fetch('/orders/' + `${client.id}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error fetching orders');
                }
                return response.json();
            })
            .then(orders => {
              console.log('Orders:', JSON.stringify(orders, null, 2));
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
        ${order.service} - $${order.price.toFixed(2)} - ${new Date(order.completion_date).toISOString().split('T')[0]}
        <button class="action-button cancel-button" onclick="removeUpcomingService(${index})">Cancel Service</button>
      </li>
    `).join('');

    // Render Unpaid Services
    UnpaidServicesList.innerHTML = UnpaidServices.map((order, index) => `
      <li class="service-item">
        ${order.service} - $${order.price.toFixed(2)} - ${new Date(order.completion_date).toISOString().split('T')[0]}
        <div class="action-buttons">
          <button class="action-button pay-button" onclick="payForService(${index})">Pay Now</button>
            <button class="action-button view-bill-button" onclick="viewBill(${index})">View Invoice</button>
          </div>
      </li>
    `).join('');

    // Render Completed Services
    CompletedServicesList.innerHTML = CompletedServices.map((order, index) => `
      <li class="service-item">
        ${order.service} - $${order.price.toFixed(2)} - ${new Date(order.completion_date).toISOString().split('T')[0]}
        <div class="action-buttons">
            <button class="action-button view-receipt-button" onclick="viewReceipt(${index})">View Receipt</button>
          </div>
        </li>
    `).join('');
  }
}

function filterServices() {
  const query = document.getElementById('searchInput').value.toLowerCase();
  const criteria = document.getElementById('filterCriteria').value;

  // Filter each category based on the query and criteria
  const filteredUpcoming = UpcomingServices.filter(service =>
      criteria === 'name'
          ? service.service.toLowerCase().includes(query)
          : service.completion_date.includes(query)
  );
  const filteredUnpaid = UnpaidServices.filter(service =>
      criteria === 'name'
          ? service.service.toLowerCase().includes(query)
          : service.completion_date.includes(query)
  );
  const filteredCompleted = CompletedServices.filter(service =>
      criteria === 'name'
          ? service.service.toLowerCase().includes(query)
          : service.completion_date.includes(query)
  );

  // Render the filtered lists
  renderFilteredServices(filteredUpcoming, filteredUnpaid, filteredCompleted);
}

function renderFilteredServices(filteredUpcoming, filteredUnpaid, filteredCompleted) {
  const UpcomingServicesList = document.getElementById("UpcomingServicesList");
  const UnpaidServicesList = document.getElementById("UnpaidServicesList");
  const CompletedServicesList = document.getElementById("CompletedServicesList");

  // Render Upcoming Services
  UpcomingServicesList.innerHTML = filteredUpcoming.map((order, index) => `
    <li class="service-item">
      ${order.service} - $${order.price.toFixed(2)} - ${new Date(order.completion_date).toISOString().split('T')[0]}
      <button class="action-button cancel-button" onclick="removeUpcomingService(${index})">Cancel Service</button>
    </li>
  `).join('');

  // Render Unpaid Services
  UnpaidServicesList.innerHTML = filteredUnpaid.map((order, index) => `
    <li class="service-item">
      ${order.service} - $${order.price.toFixed(2)} - ${new Date(order.completion_date).toISOString().split('T')[0]}
      <div class="action-buttons">
        <button class="action-button pay-button" onclick="payForService(${index})">Pay Now</button>
        <button class="action-button view-bill-button" onclick="viewBill(${index})">View Invoice</button>
      </div>
    </li>
  `).join('');

  // Render Completed Services
  CompletedServicesList.innerHTML = filteredCompleted.map((order, index) => `
    <li class="service-item">
      ${order.service} - $${order.price.toFixed(2)} - ${new Date(order.completion_date).toISOString().split('T')[0]}
      <div class="action-buttons">
        <button class="action-button view-receipt-button" onclick="viewReceipt(${index})">View Receipt</button>
      </div>
    </li>
  `).join('');
}


// Function to view bill details
function viewBill(index) {
    if (client) {
        const service = UnpaidServices[index];
        const bill = {
          id: service.id,
          client: client,
          service: service.service,
          price: service.price,
          order_date: service.order_date,
          completion_date: service.completion_date
      }

        fetch('/session-details-bill', {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(bill)
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error fetching bill details');
                }
                return response.json();
              });
                window.open('client-bill.html', '_blank');
              
    }
    else {
        alert('Client not found. Please log in again.');
        window.location.href = 'client-login.html';
    }
}

function viewReceipt(index) {
  if (client) {
      const service = CompletedServices[index];
      const bill = {
        id: service.id,
        client: client,
        service: service.service,
        price: service.price,
        order_date: service.order_date,
        completion_date: service.completion_date
    }

      fetch('/session-details-bill', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(bill)
      })
          .then(response => {
              if (!response.ok) {
                  throw new Error('Error fetching bill details');
              }
              return response.json();
            });
              window.open('client-receipt.html', '_blank');
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
          alert('Payment successful!');
          window.location.reload();
        })
    }

    else {
        alert('Client not found. Please log in again.');
        window.location.href = 'client-login.html';
    }
}

//Function to cancel upcoming service
function removeUpcomingService(index) {
  if (client) {
      const service = UpcomingServices[index];
      fetch('/orders/'+`${service.id}`, {
          method: 'DELETE',
          headers: {
              'Content-Type': 'application/json'
          }
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Error canceling service');
        }
        alert('Cancelation successful!');
        window.location.reload();
      })
  }

  else {
      alert('Client not found. Please log in again.');
      window.location.href = 'client-login.html';
  }
}