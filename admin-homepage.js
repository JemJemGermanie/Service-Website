function signOut() {
    localStorage.removeItem('adminName'); // Clear the stored client name
    localStorage.removeItem('clientName'); // Clear the stored client name
    localStorage.removeItem('selectedService'); // Clear any selected service data
    window.location.href = 'admin-login.html'; // Redirect to login page
}

// Function to render services
function loadAccount() {
    const adminName = localStorage.getItem('adminName');
    const admins = JSON.parse(localStorage.getItem('admins')) || [];
    const admin = admins.find(c => c.name === adminName);

    console.log('Saving admin info:', JSON.stringify(admin, null, 2));

    if (admin) {
        adminInfo.innerHTML += `
            <h2>
            Welcome, ${adminName}
            </h2>
        `;
    } else {
        alert('Admin not found. Please log in again.');
        window.location.href = 'admin-login.html';
    }
}
