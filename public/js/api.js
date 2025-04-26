// Funktion til at håndtere requests til backend
// Den bruges til at håndtere alle requests til backend
export default async function api(endpoint, method = 'GET', body = null) {

    const username = localStorage.getItem('email');
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
      const errorText = await response.text();
      throw new Error(`API fejl: ${response.status} ${errorText}`);
    }

    return response;
  }
