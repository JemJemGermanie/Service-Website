const companyName='Business'
const companyAddress="place"
const companyPhone=5145564632

function saveBusinessToLocalStorage() {
    localStorage.setItem('companyName', companyName);
    localStorage.setItem('companyAddress', companyAddress);
    localStorage.setItem('companyPhone', companyPhone);

}

// Automatically save the business data when this script runs
saveBusinessToLocalStorage();
