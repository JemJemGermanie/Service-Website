        // Example initial services
        let services = ["Consulting", "Customer Support", "Software Development"];

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
            services.forEach((service) => {
                servicesList.innerHTML += `
                    <li>
                        ${service} 
                    </li>
                `;
            });
        }

        // Add a new service
        function addService() {
            const newService = document.getElementById('newService').value;
            if (newService) {
                services.push(newService);
                document.getElementById('newService').value = ''; // Clear input field
                renderServicesAdmin();
            }
        }

        // Remove a service
        function removeService(index) {
            services.splice(index, 1); // Remove the selected service
            renderServicesAdmin();
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
