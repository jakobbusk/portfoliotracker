// Funktion til at håndtere requests til backend
// Den bruges til at håndtere alle requests til backend
export default async function api(endpoint, method = 'GET', body = null) {

    const username = localStorage.getItem('username');
    const password = localStorage.getItem('password');


    if (!username || !password) {
      throw new Error('Brugernavn og adgangskode mangler i localStorage');
    }

    const headers = {
      'Content-Type': 'application/json',
      'Authorization': 'Basic ' + btoa(username + ':' + password)
    };

    const options = {
      method,
      headers,
      body: body ? JSON.stringify(body) : null,
    };

    const response = await fetch(`/api/${endpoint}`, options);

    if (!response.ok) {
      if(response.status > 499) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'An error occurred');
      } else {
        return response
      }
    }

    return response;
  }
