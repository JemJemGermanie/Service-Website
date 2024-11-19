// Function to render services
function loadAccount() {
    const adminName = localStorage.getItem('adminName');
    const admins = JSON.parse(localStorage.getItem('admins')) || [];
    const admin = admins.find(c => c.name === adminName);

    localStorage.setItem('logFl',2);
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
