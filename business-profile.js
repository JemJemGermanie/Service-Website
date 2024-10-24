let services = JSON.parse(sessionStorage.getItem('services')) || ["Consulting", "Customer Support", "Software Development"];

// Function to render services
function renderServicesAdmin() {
    const servicesList = document.getElementById('servicesList');
    servicesList.innerHTML = '';
    services.forEach((service, index) => {
        servicesList.innerHTML += `
            <li>
                ${service} 
                <button onclick="removeService(${index})">Remove</button>
            </li>
        `;
    });
}

function renderServicesClient() {
    const servicesList = document.getElementById('servicesList');
    servicesList.innerHTML = '';
    services.forEach((service, index) => {
        servicesList.innerHTML += `
            <li>
                ${service} 
                <button onclick="removeService(${index})">Request</button>
            </li>
        `;
    });
}

// Add a new service and update sessionStorage
function addService() {
    const newService = document.getElementById('newService').value;
    if (newService) {
        services.push(newService); // Add new service to the array
        document.getElementById('newService').value = ''; // Clear input field
        updateSessionStorage(); // Update session storage with the new services array
        renderServicesAdmin(); // Re-render the services list
    }
}

// Remove a service and update sessionStorage
function removeService(index) {
    services.splice(index, 1); // Remove the selected service from the array
    updateSessionStorage(); // Update session storage with the modified services array
    renderServicesAdmin(); // Re-render the services list
}

// Function to update sessionStorage with the current services array
function updateSessionStorage() {
    sessionStorage.setItem('services', JSON.stringify(services));
}
function renderServicesGuest() {
    const servicesList = document.getElementById('servicesList');
    servicesList.innerHTML = '';
    services.forEach((service) => {
        servicesList.innerHTML += `
            <li>
                ${service} 
            </li>
        `;
    });
}

        // Handle form submission for business info
        document.getElementById('businessInfoForm').addEventListener('submit', function(event) {
            event.preventDefault(); // Prevent page reload

            const companyName = document.getElementById('companyName').value;
            const address = document.getElementById('address').value;
            const phone = document.getElementById('phone').value;

            // Show updated info in console (for now)
            console.log("Business Information Updated:");
            console.log("Company Name:", companyName);
            console.log("Address:", address);
            console.log("Phone:", phone);
            
            alert("Business information updated successfully!");
        });

        document.getElementById("company").innerHTML=companyName;        
