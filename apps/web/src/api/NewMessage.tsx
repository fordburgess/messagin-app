import React from 'react'

export const NewMessage = async (message: FormDataEntryValue, userId: number, chatId: number) => {

  try {
    const res = await fetch('http://192.168.1.110:3000/new-message', {
      method: 'POST',
      headers: {
        'Content-Type' : 'application/json'
      },
      body: JSON.stringify({ message, userId, chatId })
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
