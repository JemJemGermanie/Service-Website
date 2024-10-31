let services = JSON.parse(localStorage.getItem('services')) || ["Consulting", "Customer Support", "Software Development"];

document.addEventListener('DOMContentLoaded', () => {
    const companyName = localStorage.getItem('companyName');
    const companyAddress = localStorage.getItem('companyAddress');
    const companyPhone = localStorage.getItem('companyPhone');
            document.getElementById('companyName').value = companyName;
            document.getElementById('companyAddress').value = companyAddress;
            document.getElementById('companyPhone').value = companyPhone;
    
});

function updateBusinessInfo(){
    const updatedName = document.getElementById('companyName').value.trim();
    const updatedAddress = document.getElementById('companyAddress').value.trim();
    const updatedPhone = document.getElementById('companyPhone').value.trim();
    localStorage.setItem('companyName',updatedName);
    localStorage.setItem('companyAddress',updatedAddress);
    localStorage.setItem('companyPhone',updatedPhone);

};

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

// Add a new service and update localStorage
function addService() {
    const newService = document.getElementById('newService').value;
    if (newService) {
        services.push(newService); // Add new service to the array
        document.getElementById('newService').value = ''; // Clear input field
        updateLoaclStorage(); // Update local storage with the new services array
        renderServicesAdmin(); // Re-render the services list
    }
}

// Remove a service and update localStorage
function removeService(index) {
    services.splice(index, 1); // Remove the selected service from the array
    updateLocalStorage(); // Update local storage with the modified services array
    renderServicesAdmin(); // Re-render the services list
}

// Function to update localStorage with the current services array
function updateLocalStorage() {
    localStorage.setItem('services', JSON.stringify(services));
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
