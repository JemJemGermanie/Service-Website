document.addEventListener("DOMContentLoaded", () => {
    fetchPastServices();
});

function fetchPastServices() {
    fetch('/api/orders/status/2') // Replace with your actual endpoint for orders
        .then(response => {
            if (!response.ok) {
                throw new Error("Failed to fetch past services");
            }
            return response.json();
        })
        .then(orders => {
            const sortedOrders = orders.sort((a, b) => new Date(b.order_date) - new Date(a.order_date)); // Sort by newest
            renderPastServices(sortedOrders);
        })
        .catch(error => console.error("Error fetching past services:", error));
}

function renderPastServices(orders) {
    const pastServicesList = document.getElementById("pastServicesList");
    pastServicesList.innerHTML = ""; // Clear the list

    orders.forEach(order => {
        const li = document.createElement("li");
        li.className = "service-item";
        li.innerHTML = `
            <span><strong>${order.name}</strong> (${order.price}$)</span>
            <p>Ordered On: ${new Date(order.order_date).toLocaleDateString()}</p>
            <p>Completed On: ${new Date(order.completion_date).toLocaleDateString()}</p>
        `;
        pastServicesList.appendChild(li);
    });
}
