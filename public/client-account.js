document.addEventListener('DOMContentLoaded', () => {
    fetch('/session-details')
        .then(response => {
            if (!response.ok) throw new Error('No active session');
            return response.json();
        })
        .then(session => {
            const clientID = session.id;
            localStorage.setItem('clientID', clientID);

            // Fetch the client's current data
            return fetch(`/clients/${clientID}`);
        })
        .then(response => {
            if (!response.ok) throw new Error("Failed to fetch client data.");
            return response.json();
        })
        .then(client => {
            document.getElementById('clientName').value = client.name;
            document.getElementById('address').value = client.address || '';
            document.getElementById('phone').value = client.phone || '';
            document.getElementById('password').value = client.password || '';
        })
        .catch(error => {
            console.error("Error:", error);
            alert('Please log in first.');
            window.location.href = 'client-login.html'; // Redirect to login page
        });
});

document.getElementById('clientAccountForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const clientID = localStorage.getItem('clientID');
    const updatedName = document.getElementById('clientName').value.trim();
    const updatedAddress = document.getElementById('address').value.trim();
    const updatedPhone = document.getElementById('phone').value.trim();
    const updatedPassword = document.getElementById('password').value.trim();

    if (!updatedName || !updatedAddress || !updatedPhone || !updatedPassword) {
        alert('All fields are required.');
        return;
    }

    fetch(`/clients/${clientID}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            name: updatedName,
            address: updatedAddress,
            phone: updatedPhone,
            password: updatedPassword,
        }),
    })
        .then(response => {
            if (!response.ok) throw new Error("Failed to update account information.");
            alert('Account information updated successfully.');
            localStorage.setItem('clientName', updatedName); // Update localStorage
        })
        .catch(error => console.error("Error updating account:", error));
});

document.getElementById("deleteAccountButton").addEventListener("click", function() {
    const clientID = localStorage.getItem('clientID');
    if (confirm("Are you sure you want to delete your account?")) {
        fetch(`/clients/${clientID}`, {
            method: 'DELETE',
        })
            .then(response => {
                if (!response.ok) throw new Error("Failed to delete account.");
                alert('Account successfully deleted.');
                localStorage.removeItem('clientID'); // Clear localStorage
                window.location.href = "sign-out.html";
            })
            .catch(error => console.error("Error deleting account:", error));
    }
});
