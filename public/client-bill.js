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

document.addEventListener('DOMContentLoaded', () => {
    
    fetch('/session-details')
      .then(response => {
        if (!response.ok) {
          throw new Error('No active session');
        }
        return response.json();
      })
      .then(response => {
          client = response.user;
          bill = response.bill;
            document.getElementById('clientName').textContent = bill.client;
      })
      .catch(error => {
        console.error('Error fetching session details:', error);
        alert('You need to log in first.');
        window.location.href = '/client-login.html';
      });
  });