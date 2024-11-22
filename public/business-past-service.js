async function fetchOrders(clientID, status) {
    const response = await fetch(`/orders/${clientID}/${status}`);
    if (!response.ok) {
        throw new Error('Error fetching orders');
    }
    return response.json();
}

async function renderServices() {
    const PastServicesList = document.getElementById("pastServicesList");

    PastServicesList.innerHTML = '';

    const clients = await fetch('/clients').then(response => response.json());
    console.log('Fetched clients:', clients);

    for (const client of clients) {
        try {
            const pastServices = await fetchOrders(client.id, 3);

            if (pastServices.length > 0) {
                PastServicesList.innerHTML += `<h2>${client.name}</h2><ul>`;
                pastServices.forEach((service) => {
                    const formattedDate = new Date(service.completion_date).toLocaleDateString();
                    PastServicesList.innerHTML += `
                        <li>
                            ${service.name} - $${service.price} - Completion Date: ${formattedDate}
                        </li>
                    `;
                });
                PastServicesList.innerHTML += `</ul>`;
            }
        } catch (error) {
            console.error('Error rendering services:', error);
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOMContentLoaded event fired');
    renderServices();
});
