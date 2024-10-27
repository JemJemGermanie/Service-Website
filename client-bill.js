document.addEventListener('DOMContentLoaded', () => {
    const selectedServiceData = JSON.parse(localStorage.getItem('selectedService'));

    if (selectedServiceData && selectedServiceData.clientName && selectedServiceData.service) {
        document.getElementById('clientName').textContent = selectedServiceData.clientName;
        document.getElementById('invoiceDate').textContent = new Date().toLocaleDateString();
        document.getElementById('serviceName').textContent = selectedServiceData.service.name;
        document.getElementById('serviceAmount').textContent = `$${selectedServiceData.service.price.toFixed(2)}`;
    } else {
        alert('Service details not found. Redirecting back to homepage.');
        window.location.href = 'client-homepage.html';
    }
});