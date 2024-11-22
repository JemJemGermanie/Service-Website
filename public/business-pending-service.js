async function fetchOrders(clientID, status) {
    const response = await fetch(`/orders/${clientID}/${status}`);
    if (!response.ok) {
        throw new Error('Error fetching orders');
    }
    return response.json();
}

async function renderServices() {
    const PendingServicesList = document.getElementById("PendingServicesList");
    const UnpaidServicesList = document.getElementById("UnpaidServicesList");

    PendingServicesList.innerHTML = '';
    UnpaidServicesList.innerHTML = '';

    const clients = await fetch('/clients').then(response => response.json());
    console.log('Fetched clients:', clients);

    for (const client of clients) {
        try {
            const upcomingServices = await fetchOrders(client.id, 1);
            const unpaidServices = await fetchOrders(client.id, 2);

            console.log(`Client: ${client.name}, Upcoming Services:`, upcomingServices);
            console.log(`Client: ${client.name}, Unpaid Services:`, unpaidServices);

            if (upcomingServices.length > 0) {
                PendingServicesList.innerHTML += `<h2>${client.name}</h2><ul>`;
                upcomingServices.forEach((service) => {
                    const formattedDate = new Date(service.order_date).toLocaleDateString();
                    console.log(`Upcoming Service: ${service.name}, Status: ${service.status}`);
                    PendingServicesList.innerHTML += `
                        <li>
                            ${service.name} - $${service.price} - Order Date: ${formattedDate}
                            <button onclick="moveCompletedService(${service.id})">Completed Service</button>
                        </li>
                    `;
                });
                PendingServicesList.innerHTML += `</ul>`;
            }

            if (unpaidServices.length > 0) {
                UnpaidServicesList.innerHTML += `<h2>${client.name}</h2><ul>`;
                unpaidServices.forEach((service) => {
                    const formattedDate = new Date(service.completion_date).toLocaleDateString();
                    console.log(`Unpaid Service: ${service.name}, Status: ${service.status}`);
                    UnpaidServicesList.innerHTML += `
                        <li>
                            ${service.name} - $${service.price} - Completion Date: ${formattedDate}
                            <button onclick="notifyCustomer('${client.name}', '${service.name}')">Notify Customer</button>
                        </li>
                    `;
                });
                UnpaidServicesList.innerHTML += `</ul>`;
            }
        } catch (error) {
            console.error('Error rendering services:', error);
        }
    }
}

function moveCompletedService(orderID) {
    fetch(`/orders/${orderID}/status`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: 2 })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error updating order status');
        }
        renderServices();
    })
    .catch(error => {
        console.error('Error updating order status:', error);
    });
}

function notifyCustomer(clientName, serviceName) {
    alert(`Customer ${clientName} has been notified about unpaid service: ${serviceName}`);
}

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOMContentLoaded event fired');
    renderServices();
});
