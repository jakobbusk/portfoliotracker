// Funktion til at håndtere requests til backend
// Den bruges til at håndtere alle requests til backend
export default async function api(endpoint, method = 'GET', body = null) {

    const username = localStorage.getItem('username');
    const password = localStorage.getItem('password');


    if (!username || !password) {
      throw new Error('Brugernavn og adgangskode mangler i localStorage');
    }

    //vi bruger basic access authentication
    //dvs. authorization feltet skal indeholde en streng i formatet:
    //Basic username:password i base64 encoding
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': 'Basic ' + btoa(username + ':' + password)
    };

    //options der skal sendes med i request
    const options = {
      method,
      headers,
      body: body ? JSON.stringify(body) : null,
    };

    const response = await fetch(`/api/${endpoint}`, options);

    //håndtering af fejl
    if (!response.ok) {
      if(response.status > 499) { //hvis fejlkode over 499 indikerer det en serverfejl
        const errorData = await response.json();
        throw new Error(errorData.message || 'An error occurred');
      } else {
        return response
      }
    }

    return response;
  }
