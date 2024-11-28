var PendingServices;
var UnpaidServices;

// Function to render services
function renderServices() {
  const PendingServicesList = document.getElementById("PendingServicesList");
  const UnpaidServicesList = document.getElementById("UnpaidServicesList");
  if (PendingServicesList) {
  PendingServicesList.innerHTML = PendingServices.map((order, index) => `
    <li>
      <div id='text-container'>
        Service Name: ${order.service} <br>
        Order ID: ${order.id} <br> 
        Client ID: ${order.clientID} <br>
      </div>
      <div id='button-container'>
        <button onclick="viewDetailsPending(${index})">View Details</button>
        <button onclick="confirmOrder(${order.id})">Confirm Order</button>
      </div>
      <div id='details-container'>
      </div>
    </li>
  `).join('');
  }
  if (UnpaidServicesList) {
  UnpaidServicesList.innerHTML = UnpaidServices.map((order, index) => `
    <li >
      <div id='text-container'>
        Service Name: ${order.service} <br>
        Order ID: ${order.id} <br> 
        Client ID: ${order.clientID} <br>
      </div>
      <div id='button-container'>
        <button onclick="viewDetailsUnpaid(${index})" style="background-color: green;">View Details</button>
        <button onclick="viewInvoice(${index})">View Invoice</button>
        <button onclick="notifyClient(${index})">Notify Client</button>
      </div>
      <div id='details-container'>
      </div>
    </li>
  `).join(''); 
  }
}

function viewDetailsPending(index) {
  order=PendingServices[index];
  fetch(`/clients/` + `${order.clientID}`)
  .then(response => {
    if (!response.ok) {
      throw new Error('Error fetching client');
    }
    return response.json();
  })
  .then(clients => {
    const clientName = clients.name
    const PendingServicesList = document.getElementById("PendingServicesList");
    const listItem = PendingServicesList.children[index];
    const detailsContainer = listItem.querySelector('#details-container');
    detailsContainer.innerHTML = `
      <div>
        Client Name: ${clientName} <br>
        Service: ${order.service} <br>
        Price: $${order.price} <br>
        Order Date: ${new Date(order.order_date).toISOString().split('T')[0]} <br>
        Completion Date: ${new Date(order.completion_date).toISOString().split('T')[0]} <br>
        <button onclick="clearDetailsPending(${index})" style="background-color: red;">Close</button>
      </div>
    `;
  })
}

function viewDetailsUnpaid(index) {
  order=UnpaidServices[index];
  fetch(`/clients/` + `${order.clientID}`)
  .then(response => {
    if (!response.ok) {
      throw new Error('Error fetching client');
    }
    return response.json();
  })
  .then(clients => {
    const clientName = clients.name
    const UnpaidServicesList = document.getElementById("UnpaidServicesList");
    const listItem = UnpaidServicesList.children[index];
    const detailsContainer = listItem.querySelector('#details-container');
    detailsContainer.innerHTML = `
      <div>
        Client Name: ${clientName} <br>
        Service: ${order.service} <br>
        Price: $${order.price} <br>
        Order Date: ${new Date(order.order_date).toISOString().split('T')[0]} <br>
        Completion Date: ${new Date(order.completion_date).toISOString().split('T')[0]} <br>
        <button onclick="clearDetailsPending(${index})" style="background-color: red;">Close</button>
      </div>
    `;
  })
}


function notifyClient(index) {
  order = UnpaidServices[index];
  fetch(`/clients/${order.clientID}`)
    .then(response => {
      if (!response.ok) {
        throw new Error('Error fetching client');
      }
      return response.json();
    })
    .then(client => {
      const to = client.email;
      const text = `The following order is outstanding, please log into your account to pay the invoice\nService ordered: ${order.service}\nPrice: $${order.price}\nCompletion date: ${new Date(order.order_date).toISOString().split('T')[0]}`;
      
      fetch('/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ to, subject: 'You have an unpaid invoice', text })
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Error sending email');
        }
        alert('Notification sent to client.');
      })
      .catch(error => {
        console.error('Error:', error);
        alert('Failed to send notification.');
      });
    });
}


function clearDetailsPending(index) {
  const PendingServicesList = document.getElementById("PendingServicesList");
  const listItem = PendingServicesList.children[index];
  const detailsContainer = listItem.querySelector('#details-container');
  detailsContainer.innerHTML = '';
}

function clearDetailsUnpaid(index) {
  const UnpaidServicesList = document.getElementById("UnpaidServicesList");
  const listItem = UnpaidServicesList.children[index];
  const detailsContainer = listItem.querySelector('#details-container');
  detailsContainer.innerHTML = '';
}

function confirmOrder(orderID) {
    fetch('/orders/'+`${orderID}`+'/status', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            status: 1,
        })
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Error paying for service');
      }
      alert('Order confirmed! Your client will be notified.');
      window.location.reload();
    })
}

function viewInvoice(index) {
    const service = UnpaidServices[index];
    fetch('/clients/'+`${service.clientID}`,{
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Error fetching client details');
      }
      return response.json();
    })
    .then(client => {
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
    });
  window.open('client-bill.html', '_blank');         
}

document.addEventListener('DOMContentLoaded', () => {
  fetch('/orders')
  .then(response => {
      if (!response.ok) {
          throw new Error('Error fetching orders');
      }
      return response.json();
  })
  .then(orders => {
    PendingServices = orders.filter(order => order.status === 0);
    UnpaidServices = orders.filter(order => order.status === 1);
    renderServices();
  })
});