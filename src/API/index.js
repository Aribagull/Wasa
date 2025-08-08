export async function loginUser({ email, password }) {
  try {
    const response = await fetch('https://magneetarsolutions.com/api/users/auth', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    return data; 
  } catch (error) {
    throw new Error('Network error. Please try again later.');
  }
}




export async function createSupervisor(newSupervisor) {
  try {
    const response = await fetch('https://magneetarsolutions.com/api/users/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newSupervisor),
    });

    const data = await response.json();
    return { success: response.ok, data };
  } catch (error) {
    throw new Error('Network error while creating supervisor.');
  }
}
