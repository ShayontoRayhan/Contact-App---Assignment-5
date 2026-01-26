import React, { createContext, useContext, useEffect, useState } from 'react'

const ContactContext = createContext()
const STORAGE_KEY = 'contacts_data'

const DEFAULT_CONTACTS = [
  {
    "id": 1,
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "phone": "01744748487"
  },
  {
    "id": 2,
    "firstName": "Jane",
    "lastName": "Smith",
    "email": "jane@example.com",
    "phone": "01987654321"
  },
  {
    "id": 3,
    "firstName": "Shayonto",
    "lastName": "Rayhan",
    "email": "rayhanshayonto@gmail.com",
    "phone": "01309029431",
    "address": "Pankouri, 20 Chamelibagh, Shantinagar, Dhaka",
    "dob": "2005-02-01"
  },
  {
    "id": 4,
    "firstName": "Saidur",
    "lastName": "Rahman",
    "email": "saidur@gmail.com",
    "phone": "01309029432",
    "address": "Kurigram"
  },
  {
    "id": 5,
    "firstName": "Sabit",
    "lastName": "Ahmed",
    "email": "sabit@gmail.com",
    "phone": "01309029434",
    "address": "Old Dhaka"
  }
]

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
      const saved = localStorage.getItem(STORAGE_KEY)
      if(saved){
        const data = JSON.parse(saved)
        setContacts(data)
      } else {
        // Initialize with default contacts if first time
        localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_CONTACTS))
        setContacts(DEFAULT_CONTACTS)
      }
    }catch(err){
      console.error('Failed to fetch contacts', err)
      setContacts(DEFAULT_CONTACTS)
    }finally{ setLoading(false) }
  }

  async function addContact(contact){
    try{
      const saved = localStorage.getItem(STORAGE_KEY) || '[]'
      const currentContacts = JSON.parse(saved)
      const newId = currentContacts.length > 0 ? Math.max(...currentContacts.map(c => c.id || 0)) + 1 : 1
      const newContact = { ...contact, id: newId }
      const updatedData = [...currentContacts, newContact]
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedData))
      setContacts(updatedData)
      console.log('Contact added:', newContact)
      return newContact
    }catch(err){
      console.error('Failed to add contact', err)
      throw err
    }
  }

  async function updateContact(id, updates){
    try{
      const saved = localStorage.getItem(STORAGE_KEY) || '[]'
      const currentContacts = JSON.parse(saved)
      const updatedContacts = currentContacts.map(c => c.id === id ? { ...c, ...updates, id } : c)
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedContacts))
      setContacts(updatedContacts)
      console.log('Contact updated:', id)
      return { ...updates, id }
    }catch(err){
      console.error('Failed to update contact', err)
      throw err
    }
  }

  async function deleteContact(id){
    try{
      const saved = localStorage.getItem(STORAGE_KEY) || '[]'
      const currentContacts = JSON.parse(saved)
      const filteredContacts = currentContacts.filter(c => c.id !== id)
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredContacts))
      setContacts(filteredContacts)
      console.log('Contact deleted:', id)
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
