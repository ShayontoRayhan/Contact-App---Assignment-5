import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useContacts } from '../context/ContactContext'

export default function ContactItem({ contact }){
  const navigate = useNavigate()
  const { deleteContact } = useContacts()

  function handleDelete(){
    if(window.confirm('Delete this contact?')) {
      deleteContact(contact.id)
    }
  }

  return (
    <tr>
      <td>{contact.id}</td>
      <td>{contact.firstName}</td>
      <td>{contact.lastName}</td>
      <td>{contact.email}</td>
      <td>{contact.phone}</td>
      <td width="180">
        <button className="btn btn-sm btn-circle btn-outline-info" title="Show" onClick={() => navigate(`/contact/${contact.id}`)}><i className="fa fa-eye"></i></button>
        <button className="btn btn-sm btn-circle btn-outline-secondary" title="Edit" onClick={() => navigate(`/edit/${contact.id}`)} style={{marginLeft:8}}><i className="fa fa-edit"></i></button>
        <button className="btn btn-sm btn-circle btn-outline-danger" title="Delete" onClick={handleDelete} style={{marginLeft:8}}><i className="fa fa-times"></i></button>
      </td>
    </tr>
  )
}
