async function fetchClientInfo(clientID){
    const response = await fetch(`/clients/${clientID}`);
    if(!response.ok){
        throw new Error('Error fetching client info');
    }
    return response.json();
}
async function fetchOrders(clientID, status) {
    const response = await fetch(`/orders/${clientID}/${status}`);
    if(!response.ok){
        throw new Error('Error fetching orders');
    }
    return response.json();
}

async function renderClientInfo(){
    const urlParams = new URLSearchParams(window.location.search);
    const clientID = urlParams.get('id');

    if(!clientID){
        console.error('Client ID not found');
        return;
    }
    try{
        const client = await fetchClientInfo(clientID);
        const upcomingServices = await fetchOrders(clientID,1);
        const unpaidServices = await fetchOrders(clientID,2);
        const completedServices = await fetchOrders(clientID,3);

        const clientInfo = document.getElementById('clientInfo');
        clientInfo.innerHTML = `
            <h2>${client.name}<h2>
            <h3>${client.address}<h3>
            <h3>${client.phone}<h3>
            <h3>${client.email}<h3>
        `;
        const UpcomingServicesList = document.getElementById('UpcomingServicesList');
        UpcomingServicesList.innerHTML = upcomingServices.map(service => `
            <li>${service.name} - $${service.price.toFixed(2)} - Ordered: ${new Date(service.order_date).toLocaleDateString()}</li>
            `).join('');
        
        const UnpaidServicesList = document.getElementById('UnpaidServicesList');
        UnpaidServicesList.innerHTML = unpaidServices.map(service => `
            <li>${service.name} - $${service.price.toFixed(2)} - Completion: ${new Date(service.completion_date).toLocaleDateString()}</li>
            `).join('');
        
        const CompletedServicesList = document.getElementById('CompletedServicesList');
        CompletedServicesList.innerHTML = completedServices.map(service => 
            `
            <li>${service.name} - $${service.price.toFixed(2)} - Completion: ${new Date(service.completion_date).toLocaleDateString()}</li>
            `).join('');
    }
    catch (error){
        console.error('Error rendering client info: ', error);
    }
}
document.addEventListener('DOMContentLoaded', renderClientInfo);