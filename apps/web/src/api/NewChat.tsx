import { type User } from "../types";

export const NewChat = async (contact: User, senderId: number) => {

  try {
    const res = await fetch('http://192.168.1.110:3000/new-chat', {
      method: 'POST',
      headers: {
        'Content-Type' : 'application/json'
      },
      body: JSON.stringify({ contact, senderId })
    })

    const data = await res.json();

    if (!res.ok) {
      console.log('error has occurred')
    }

    return data;
  }
  catch (error) {
    console.log(error)
  }
}
