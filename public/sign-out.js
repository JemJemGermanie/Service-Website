function signOut() {
    localStorage.removeItem('adminName'); // Clear the stored client name
    localStorage.removeItem('clientName'); // Clear the stored client name
    localStorage.removeItem('selectedService'); // Clear any selected service data
    localStorage.setItem('logFl',0);
    window.location.href = 'home.html'; // Redirect to login page
}