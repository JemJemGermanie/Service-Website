document.addEventListener('DOMContentLoaded', () => {
    const clientName = localStorage.getItem('clientName');
    if (clientName) {
        const clients = JSON.parse(localStorage.getItem('clients')) || [];
        const client = clients.find(c => c.name === clientName);
        
        if (client) {
            document.getElementById('clientName').value = client.name;
            document.getElementById('address').value = client.address || '';
            document.getElementById('phone').value = client.phone || '';
            document.getElementById('password').value = client.password || '';
        }
    } else {
        window.location.href = 'client-login.html'; // Redirect to login if not logged in
    }
});

document.getElementById('clientAccountForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const updatedName = document.getElementById('clientName').value.trim();
    const updatedAddress = document.getElementById('address').value.trim();
    const updatedPhone = document.getElementById('phone').value.trim();
    const updatedPassword = document.getElementById('password').value.trim();

    const clients = JSON.parse(localStorage.getItem('clients')) || [];
    const clientIndex = clients.findIndex(c => c.name === localStorage.getItem('clientName'));

    if (clientIndex !== -1) {
        clients[clientIndex].name = updatedName;
        clients[clientIndex].address = updatedAddress;
        clients[clientIndex].phone = updatedPhone;
        clients[clientIndex].password = updatedPassword;

        // Update the client's name in localStorage for session persistence
        localStorage.setItem('clientName', updatedName);
        localStorage.setItem('clients', JSON.stringify(clients));

        alert('Account information updated successfully.');
    } else {
        alert('Error: Client not found.');
    }
});
document.getElementById("deleteAccountButton").addEventListener("click", function(){
    alert('Account successfully deleted');
    window.location.href = "sign-out.html";
});