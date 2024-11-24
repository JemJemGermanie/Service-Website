document.addEventListener("DOMContentLoaded", () => {
    fetchPastServices();
});

function fetchPastServices() {
    fetch('/api/orders/status/2') // Fetch orders with status 2
        .then(response => {
            if (!response.ok) {
                throw new Error("Failed to fetch orders with status 2");
            }
            return response.json();
        })
        .then(orders => {
            renderPastServices(orders);
        })
        .catch(error => {
            console.error("Error fetching past services:", error);
        });
}

function renderPastServices(orders) {
    const pastServicesList = document.getElementById("pastServicesList");
    pastServicesList.innerHTML = ""; // Clear the list

    if (!orders || orders.length === 0) {
        pastServicesList.innerHTML = "<p>No past services found.</p>";
        return;
    }

    orders.forEach(order => {
        const li = document.createElement("li");
        li.className = "service-item";
        li.innerHTML = `
            <div class="service-content">
                <span><strong>Client:</strong> ${order.client_name}</span>
                <span><strong>Service:</strong> ${order.service_name} ($${order.price})</span>
                <span><strong>Order Date:</strong> ${new Date(order.order_date).toLocaleDateString()}</span>
                <span><strong>Completion Date:</strong> ${new Date(order.completion_date).toLocaleDateString()}</span>
            </div>
        `;
        pastServicesList.appendChild(li);
    });
}
