import React, { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useContacts } from '../context/ContactContext'

export default function ContactDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { contacts, deleteContact } = useContacts()
  const [contact, setContact] = useState(null)

  useEffect(() => {
    const found = contacts.find(c => c.id === parseInt(id))
    setContact(found)
  }, [id, contacts])

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this contact?')) {
      deleteContact(parseInt(id))
      navigate('/')
    }
  }

  if (!contact) {
    return <div className="container"><p>Contact not found</p></div>
  }

  return (
    <div className="container">
      <div className="detail-card">
        <h2>{contact.firstName} {contact.lastName}</h2>
        
        <div className="detail-row">
          <strong>Email:</strong>
          <span>{contact.email}</span>
        </div>
        
        <div className="detail-row">
          <strong>Phone:</strong>
          <span>{contact.phone}</span>
        </div>
        
        <div className="detail-row">
          <strong>Date of Birth:</strong>
          <span>{contact.dob || 'N/A'}</span>
        </div>
        
        <div className="detail-row">
          <strong>Address:</strong>
          <span>{contact.address || 'N/A'}</span>
        </div>

        <div className="button-group">
          <Link to={`/edit/${id}`} className="btn btn-primary">Edit</Link>
          <button onClick={handleDelete} className="btn btn-danger">Delete</button>
          <Link to="/" className="btn btn-secondary">Back</Link>
        </div>
      </div>
    </div>
  )
}
