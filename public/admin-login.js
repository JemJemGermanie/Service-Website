function handleLogin(event) {
    event.preventDefault(); // Prevent form submission

    const name = document.getElementById('name').value.trim();
    const password = document.getElementById('password').value.trim();
    const errorMessage = document.getElementById('error-message');

    const admins = JSON.parse(localStorage.getItem('admins')) || [];

    // Check if the entered credentials match any client
    const admin = admins.find(client => client.name === name && client.password === password);

    if (admin) {
        // Store the logged-in admin's name in localStorage for session management
        localStorage.setItem('adminName', admin.name);
        // Redirect to the admins's homepage upon successful login
        window.location.href = 'admin-homepage.html';
    } else {
        // Show an error message if login fails
        errorMessage.textContent = "Invalid name or password. Please try again.";
    }
}

function checkLog(){
    if (localStorage.getItem("logFl")==1){
        window.location.href = 'client-homepage.html';
    }
    else if (localStorage.getItem("logFl")==2){
        window.location.href = 'admin-homepage.html';
    }
}