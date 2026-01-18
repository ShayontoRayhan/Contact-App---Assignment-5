import React, { createContext, useContext, useEffect, useState } from 'react'

const ContactContext = createContext()
const API = 'http://localhost:3001/contacts'

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
      setContacts(data)
    }catch(err){
      console.error('Failed to fetch contacts', err)
    }finally{ setLoading(false) }
  }

  async function addContact(contact){
    const res = await fetch(API, { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(contact) })
    const saved = await res.json()
    // re-sync list from server to avoid any local-state drift
    await fetchContacts()
    return saved
  }

  async function updateContact(id, updates){
    const body = { ...updates, id }
    console.log('Updating contact', id, body)
    const res = await fetch(`${API}/${id}`, { method: 'PUT', headers: {'Content-Type':'application/json'}, body: JSON.stringify(body) })
    if(!res.ok){
      const text = await res.text().catch(()=>null)
      const err = new Error(`Server responded ${res.status}: ${text}`)
      console.error('Failed to update contact', err)
      throw err
    }
    const updated = await res.json()
    // optimistic local update so UI reflects change immediately
    setContacts(prev => prev.map(c => c.id === id ? updated : c))
    // try to re-fetch authoritative list, but don't fail the whole operation if fetch fails
    try{ await fetchContacts() }catch(e){ console.warn('Re-fetch after update failed', e) }
    return updated
  }

  async function deleteContact(id){
    await fetch(`${API}/${id}`, { method: 'DELETE' })
    // re-sync
    await fetchContacts()
  }

  return (
    <ContactContext.Provider value={{ contacts, loading, fetchContacts, addContact, updateContact, deleteContact }}>
      {children}
    </ContactContext.Provider>
  )
}
