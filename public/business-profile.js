const services = JSON.parse(localStorage.getItem('services'));

document.addEventListener('DOMContentLoaded', () => {
    fetchBusinessInfo();
    renderServicesGuest();
    renderServicesAdmin(); // Render active services
    renderDiscontinuedServices(); // Render discontinued services
    const companyName = localStorage.getItem('companyName');
    const companyAddress = localStorage.getItem('companyAddress');
    const companyPhone = localStorage.getItem('companyPhone');
            document.getElementById('companyName').value = companyName;
            document.getElementById('companyAddress').value = companyAddress;
            document.getElementById('companyPhone').value = companyPhone;
            document.getElementById('businessInfoForm').addEventListener('submit', function(event) {
                event.preventDefault();
                updateBusinessInfo();
            });
    
});

function updateBusinessInfo(){
    const updatedName = document.getElementById('companyName').value.trim();
    const updatedAddress = document.getElementById('companyAddress').value.trim();
    const updatedPhone = document.getElementById('companyPhone').value.trim();
    localStorage.setItem('companyName',updatedName);
    localStorage.setItem('companyAddress',updatedAddress);
    localStorage.setItem('companyPhone',updatedPhone);

};

function renderServicesGuest() {
    fetch('/api/services/active')
        .then(response => {
            if (!response.ok) {
                throw new Error("Failed to fetch active services");
            }
            return response.json();
        })
        .then(services => {
            const servicesList = document.getElementById('servicesList');
            servicesList.innerHTML = ''; // Clear the list
            services.forEach(service => {
                const li = document.createElement('li');
                li.innerHTML = `
                    <span>${service.name}</span><br><span>$${service.price}</span><br>
                    <p>${service.description}</p>
                `;
                servicesList.appendChild(li);
            });
        })
        .catch(error => console.error("Error fetching active services:", error));
}

// Function to render services
function renderServicesAdmin() {
    fetch('/api/services')
        .then(response => response.json())
        .then(services => {
            const servicesList = document.getElementById('servicesList');
            servicesList.innerHTML = ''; // Clear the list
            services.forEach(service => {
                const li = document.createElement('li');
                li.className = 'service-item';
                li.innerHTML = `
                    <span>${service.name} ($${service.price})</span>
                    <div>
                        <button onclick="removeService(${service.id})">Remove</button>
                        <button onclick="updateService(${service.id}, '${service.name}', ${service.price})">Update</button>
                    </div>
                `;
                servicesList.appendChild(li);
            });
        })
        .catch(error => console.error('Error:', error));
}


function renderServicesClient() {
    const servicesList = document.getElementById('servicesList');
    servicesList.innerHTML = '';
    services.forEach((service, index) => {
        servicesList.innerHTML += `
            <li>
                ${service} 
                <button onclick="requestService(${index})">Request</button>
            </li>
        `;
    });
}

// Add a new service and update sessionStorage
function addService() {
    const newService = document.getElementById('newService').value;
    const price = prompt("Enter the price for the service:");
    const description = prompt("Enter a description for the service:");

    if (!newService || !price || !description) {
        alert("All fields are required.");
        return;
    }

    fetch('/api/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newService, price: price, description: description }),
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to add service');
            }
            alert('Service added successfully');
            renderServicesAdmin(); // Refresh the list
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function requestService(index){
    alert("You have requested the service");
}

// Remove (deactivate) a service
function removeService(serviceId) {
    if (!confirm("Are you sure you want to remove this service?")) {
        return;
    }

    fetch(`/api/services/${serviceId}/deactivate`, {
        method: 'PUT',
    })
        .then(response => {
            if (!response.ok) throw new Error('Failed to deactivate service');
            alert('Service moved to discontinued successfully');
            renderServicesAdmin(); // Refresh active services list
            renderDiscontinuedServices(); // Refresh discontinued services list
        })
        .catch(error => console.error('Error deactivating service:', error));
}

// Function to update sessionStorage with the current services array
function updateLocalStorage() {
    localStorage.setItem('services', JSON.stringify(services));
}

function updateService(serviceId, currentName, currentPrice, currentDescription) {
    const newName = prompt("Enter new name for the service:", currentName);
    const newPrice = prompt("Enter new price for the service:", currentPrice);
    const newDescription = prompt("Enter new description for the service:", currentDescription);

    if (!newName || !newPrice || !newDescription) {
        alert("All fields are required!");
        return;
    }

    fetch(`/api/services/${serviceId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newName, price: parseFloat(newPrice), description: newDescription }),
    })
        .then(response => {
            if (!response.ok) throw new Error('Failed to update service');
            alert('Service updated successfully');
            renderServicesAdmin(); // Refresh the list
        })
        .catch(error => console.error('Error:', error));
}

// Function to fetch and display discontinued services
function renderDiscontinuedServices() {
    fetch('/api/services/discontinued')
        .then(response => response.json())
        .then(services => {
            console.log("Discontinued services fetched:", services); // Debugging
            const discontinuedList = document.getElementById('discontinuedServicesList');
            discontinuedList.innerHTML = ''; // Clear the list
            services.forEach(service => {
                const li = document.createElement('li');
                li.className = 'service-item';
                li.innerHTML = `
                    <span>${service.name} ($${service.price})</span>
                    <button onclick="reactivateService(${service.id}, '${service.name}', ${service.price})">Reactivate</button>
                `;
                discontinuedList.appendChild(li);
            });
        })
        .catch(error => console.error('Error fetching discontinued services:', error));
}

function reactivateService(serviceId, name, price) {
    const newName = prompt("Update the service name:", name) || name;
    const newPrice = prompt("Update the service price:", price) || price;

    fetch(`/api/services/${serviceId}/reactivate`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newName, price: parseFloat(newPrice) }),
    })
        .then(response => {
            if (!response.ok) throw new Error('Failed to reactivate service');
            alert('Service reactivated successfully');
            renderDiscontinuedServices(); // Refresh discontinued list
            renderServicesAdmin(); // Refresh active services list
        })
        .catch(error => console.error('Error reactivating service:', error));
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

// Fetch business info and populate the form
function fetchBusinessInfo() {
    fetch('/api/business-info')
        .then(response => {
            if (!response.ok) throw new Error("Failed to fetch business info");
            return response.json();
        })
        .then(data => {
            console.log("Fetched business info:", data); // Debugging log
            document.getElementById('companyName').value = data.name;
            document.getElementById('companyAddress').value = data.address;
            document.getElementById('companyPhone').value = data.phone;
        })
        .catch(error => console.error("Error fetching business info:", error));
}

// Update business info
function updateBusinessInfo() {
    const name = document.getElementById('companyName').value.trim();
    const address = document.getElementById('companyAddress').value.trim();
    const phone = document.getElementById('companyPhone').value.trim();

    if (!name || !address || !phone || phone.length < 10 || isNaN(phone)) {
        alert("Invalid input. Please ensure all fields are filled correctly.");
        return;
    }

    fetch('/api/business-info', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, address, phone }),
    })
        .then(response => {
            if (!response.ok) throw new Error("Failed to update business info");
            return response.json();
        })
        .then(data => {
            alert("Business information updated successfully!");
        })
        .catch(error => console.error("Error updating business info:", error));
}

