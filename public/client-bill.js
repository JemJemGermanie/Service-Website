var client;
var bill;

var companyName = document.getElementById('companyName');
var companyAddress = document.getElementById('companyAddress');
var companyPhone = document.getElementById('companyPhone');

var clientName = document.getElementById('clientName');
var clientAddress = document.getElementById('clientAddress');
var clientPhone = document.getElementById('clientPhone');

var orderID = document.getElementById('orderID');
var serviceName = document.getElementById('serviceName');
var price = document.getElementById('price');
var order_date = document.getElementById('order_date');
var completion_date = document.getElementById('completion_date');

document.addEventListener('DOMContentLoaded', () => {
    
    fetch('/api/business-info')
    .then(response => {
      if (!response.ok) {
        throw new Error('No active session');
      }
      return response.json();
    })
    .then(data => {
        companyName.innerHTML = data.name;
        companyAddress.innerHTML = data.address;
        companyPhone.innerHTML = data.phone;
    });

      fetch('/session-details-bill')
      .then(response => {
        if (!response.ok) {
          throw new Error('No active session');
        }
        return response.json();
      })
      .then(response => {
        const bill = response;
        orderID.innerHTML = bill.id;
        clientName.innerHTML = bill.client.name;
        clientAddress.innerHTML = bill.client.address;
        clientPhone.innerHTML = bill.client.phone;        
        serviceName.innerHTML = bill.service;
        price.innerHTML = bill.price;
        order_date.innerHTML = bill.order_date;
        completion_date.innerHTML = bill.completion_date;
      })
      .catch(error => {
        console.error('Error fetching session details:', error);
        alert('Please log in again.');
        window.location.href = '/client-login.html';
      });


  });
