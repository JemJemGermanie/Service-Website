function handleLogin(event) {
    event.preventDefault(); // Prevent form submission

    const name = document.getElementById('name').value.trim();
    const password = document.getElementById('password').value.trim();
    const errorMessage = document.getElementById('error-message');

    const clients = JSON.parse(localStorage.getItem('clients')) || [];

    // Check if the entered credentials match any client
    const client = clients.find(client => client.name === name && client.password === password);

    if (client) {
        // Store the logged-in client's name in localStorage for session management
        localStorage.setItem('clientName', client.name);
        // Redirect to the client's homepage upon successful login
        window.location.href = 'client-homepage.html';
    } else {
        // Show an error message if login fails
        errorMessage.textContent = "Invalid name or password. Please try again.";
    }
}