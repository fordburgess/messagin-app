export const GetAllData = async (userId: string) => {
  try {
    const result = await fetch('http://192.168.1.110:3000/get-all-data', {
      method: 'GET',
      headers: {
        'Content-Type' : 'application/json',
        'userId' : userId
      }
    })

    if (!result.ok) {
      console.log('promise rejected');
    }

    const data = await result.json();

    return data;
  }
  catch (error) {
    console.log(error);
  }
}
