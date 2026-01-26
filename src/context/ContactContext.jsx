import React, { createContext, useContext, useEffect, useState } from 'react'

const ContactContext = createContext()
// JSONBin API endpoint
const BIN_ID = '6976f31ad0ea881f4085dda6'
const API = `https://api.jsonbin.io/v3/b/${BIN_ID}`

export function useContacts(){ return useContext(ContactContext) }

export function ContactProvider({ children }){
  const [contacts, setContacts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(()=>{
    fetchContacts()
  },[])

  async function fetchContacts(){
    setLoading(true)
    try{
      const res = await fetch(API)
      const data = await res.json()
      setContacts(data.record.contacts)
    }catch(err){
      console.error('Failed to fetch contacts', err)
    }finally{ setLoading(false) }
  }

  async function addContact(contact){
    try{
      const res = await fetch(API)
      const data = await res.json()
      const currentContacts = data.record.contacts
      const newId = Math.max(...currentContacts.map(c => c.id), 0) + 1
      const newContact = { ...contact, id: newId }
      const updatedData = { contacts: [...currentContacts, newContact] }
      
      await fetch(API, { 
        method: 'PUT', 
        headers: {'Content-Type':'application/json'}, 
        body: JSON.stringify(updatedData) 
      })
      await fetchContacts()
      return newContact
    }catch(err){
      console.error('Failed to add contact', err)
      throw err
    }
  }

  async function updateContact(id, updates){
    try{
      const res = await fetch(API)
      const data = await res.json()
      const currentContacts = data.record.contacts
      const updatedContacts = currentContacts.map(c => c.id === id ? { ...c, ...updates, id } : c)
      const updatedData = { contacts: updatedContacts }
      
      await fetch(API, { 
        method: 'PUT', 
        headers: {'Content-Type':'application/json'}, 
        body: JSON.stringify(updatedData) 
      })
      setContacts(updatedContacts)
      await fetchContacts()
      return { ...updates, id }
    }catch(err){
      console.error('Failed to update contact', err)
      throw err
    }
  }

  async function deleteContact(id){
    try{
      const res = await fetch(API)
      const data = await res.json()
      const currentContacts = data.record.contacts
      const filteredContacts = currentContacts.filter(c => c.id !== id)
      const updatedData = { contacts: filteredContacts }
      
      await fetch(API, { 
        method: 'PUT', 
        headers: {'Content-Type':'application/json'}, 
        body: JSON.stringify(updatedData) 
      })
      await fetchContacts()
    }catch(err){
      console.error('Failed to delete contact', err)
      throw err
    }
  }

  return (
    <ContactContext.Provider value={{ contacts, loading, fetchContacts, addContact, updateContact, deleteContact }}>
      {children}
    </ContactContext.Provider>
  )
}
