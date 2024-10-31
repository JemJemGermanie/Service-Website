document.getElementById("signupForm").addEventListener("submit", function (event) {
    event.preventDefault();

    const fullname = document.getElementById("fullname").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const phone = document.getElementById("phone").value;
    const address = document.getElementById("address").value;

    const newClient = {
        name: fullname,
        password: password,
        address: address,
        phone: phone,
        services: [],            
        services_complete: [],    
        services_upcoming: [],    

    };

    console.log("New client added:", newClient);
    document.getElementById("message").innerText = "Sign-up successful!";
});