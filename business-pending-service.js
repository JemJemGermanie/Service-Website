// Example initial services
let PendingServices = ["Consulting", "Customer Support", "Software Development"];
let UnpaidServices = [];

function renderServices() {
    const PendingServicesList = document.getElementById("PendingServicesList");
    PendingServicesList.innerHTML = '';
    PendingServices.forEach((service, index) => {
        PendingServicesList.innerHTML += `
        <li>
            ${service}
            <button onclick="moveCompletedService(${index})">Completed Service</button>
        </li>
        `;
    });
    const UnpaidServicesList = document.getElementById("UnpaidServicesList");
    UnpaidServicesList.innerHTML = '';
    UnpaidServices.forEach((service,index) => {
        UnpaidServicesList.innerHTML += `
            <li>
                ${service}
                <button onclick="displayConfirmation(${index})">Notify Customer</button>
            </li>
        `;
    });
}
function moveCompletedService(index){
    UnpaidServices.push(PendingServices[index]);
    PendingServices.splice(index, 1);
    renderServices();
}
function displayConfirmation(index){
    const service = UnpaidServices[index];
    alert(`Customer has been notified about unpaid service : ${service}`);
}