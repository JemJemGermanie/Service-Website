        // Example initial services
        let UpcomingServices = ["Consulting", "Customer Support", "Software Development"];
        let UnpaidServices = ["Consulting", "Customer Support", "Software Development"];
        let CompletedServices = [];

        // Function to render services
        function renderServices() {
            const UpcomingServicesList = document.getElementById('UpcomingServicesList');
            UpcomingServicesList.innerHTML = '';
            UpcomingServices.forEach((service, index) => {
                UpcomingServicesList.innerHTML += `
                    <li>
                        ${service} 
                        <button onclick="removeUpcomingService(${index})">Cancel Service</button>
                    </li>
                `;
            }
            );
            const UnpaidServicesList = document.getElementById('UnpaidServicesList');
            UnpaidServicesList.innerHTML = '';
            UnpaidServices.forEach((service, index) => {
                UnpaidServicesList.innerHTML += `
                    <li>
                        ${service} 
                        <button onclick="moveCompletedService(${index})">Pay Bill</button>
                    </li>
                `;
            }
            );
            const CompletedServicesList = document.getElementById('CompletedServicesList');
            CompletedServicesList.innerHTML = '';
            CompletedServices.forEach((service, index) => {
                CompletedServicesList.innerHTML += `
                    <li>
                        ${service} 
                    </li>
                `;
            }
            );
        }

        // Add a new service
        function addService() {
            const newService = document.getElementById('newService').value;
            if (newService) {
                UpcomingServices.push(newService);
                document.getElementById('newService').value = ''; // Clear input field
                renderServices();
            }
        }

        // Remove a service
        function removeUpcomingService(index) {
            UpcomingServices.splice(index, 1); // Remove the selected service
            renderServices();
        }
        
        function moveCompletedService(index){
            CompletedServices.push(UnpaidServices[index]);
            UnpaidServices.splice(index, 1);
            renderServices();
        }
