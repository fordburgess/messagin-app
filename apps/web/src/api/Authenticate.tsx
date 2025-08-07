import { jwtDecode } from "jwt-decode";

export const Authenticate = async (username: FormDataEntryValue, password: FormDataEntryValue) => {

  try {
    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);

    const result = await fetch('http://192.168.1.110:3000/authenticate', {
      method: 'POST',
      headers: {
        'Content-Type' : 'application/json'
      },
      body: JSON.stringify({ username: username.toString().trim(), password: password.toString().trim()})
    })


    const data = await result.json();

    if (!result.ok) {
      return { status: result.status, error: data.message || 'Authentication Failed' }
    }

    const token = data.token;

    if (token) {
      const user = jwtDecode(token);
      localStorage.setItem('authToken', token);

      return { status: result.status, user };
    }
    else {
      return { status: result.status, error: data.message || 'Authentication Failed' }
    }
  }
  catch (error) {
    console.log(error);
  }
}
