import React, { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { useContacts } from '../context/ContactContext'

export default function ContactModal({ contact, onClose, editMode }){
  const { updateContact } = useContacts()
  const [form, setForm] = useState({ ...contact })
  const [isEditing, setIsEditing] = useState(!!editMode)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    setForm({ ...contact })
  }, [contact])

  useEffect(() => {
    setIsEditing(!!editMode)
  }, [editMode])


  function validate(values){
    const errs = {}
    if(!values.firstName || values.firstName.trim().length < 1) errs.firstName = 'First name is required.'
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if(!values.email || !emailRe.test(values.email)) errs.email = 'Enter a valid email.'
    const phoneRe = /^[0-9+()\-\s]{7,}$/
    if(values.phone && !phoneRe.test(values.phone)) errs.phone = 'Enter a valid phone number.'
    return errs
  }

  function handleChange(e){
    const { name, value } = e.target
    const next = { ...form, [name]: value }
    setForm(next)
    setErrors(validate(next))
  }

  async function handleSubmit(e){
    e.preventDefault()
    const errs = validate(form)
    setErrors(errs)
    if(Object.keys(errs).length > 0) return
    try{
      console.log('Submitting update for', contact.id, form)
      await updateContact(contact.id, form)
      alert('Contact saved')
      onClose()
    }catch(err){
      console.error('Update failed', err)
      alert('Failed to save contact. See console for details.')
    }
  }

  const modal = (
    <div className="modal-overlay" role="dialog" aria-modal="true">
      <div className="modal" role="document">
        <button className="close" onClick={onClose} aria-label="Close">×</button>
        {isEditing ? (
          <form onSubmit={handleSubmit} noValidate>
            <div className="form-group">
              <label htmlFor="m-first">First Name</label>
              <input id="m-first" name="firstName" className={`form-control ${errors.firstName? 'is-invalid':''}`} value={form.firstName||''} onChange={handleChange} aria-invalid={!!errors.firstName} aria-describedby="mFirstError" />
              {errors.firstName && <div id="mFirstError" className="invalid-feedback">{errors.firstName}</div>}
            </div>
            <div className="form-group">
              <label htmlFor="m-last">Last Name</label>
              <input id="m-last" name="lastName" className="form-control" value={form.lastName||''} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label htmlFor="m-email">Email</label>
              <input id="m-email" name="email" type="email" className={`form-control ${errors.email? 'is-invalid':''}`} value={form.email||''} onChange={handleChange} aria-invalid={!!errors.email} aria-describedby="mEmailError" />
              {errors.email && <div id="mEmailError" className="invalid-feedback">{errors.email}</div>}
            </div>
            <div className="form-group">
              <label htmlFor="m-phone">Phone</label>
              <input id="m-phone" name="phone" className={`form-control ${errors.phone? 'is-invalid':''}`} value={form.phone||''} onChange={handleChange} aria-invalid={!!errors.phone} aria-describedby="mPhoneError" />
              {errors.phone && <div id="mPhoneError" className="invalid-feedback">{errors.phone}</div>}
            </div>
            <div className="modal-actions" style={{marginTop:12}}>
              <button type="submit" className="btn btn-primary">Save</button>
              <button type="button" className="btn btn-outline-secondary" onClick={onClose} style={{marginLeft:8}}>Cancel</button>
            </div>
          </form>
        ) : (
          <div>
            <h3>{contact.firstName} {contact.lastName}</h3>
            <p>Email: {contact.email}</p>
            <p>Phone: {contact.phone}</p>
            <div style={{marginTop:12}}>
              <button className="btn btn-sm btn-outline-secondary" onClick={()=>setIsEditing(true)}>Edit</button>
              <button className="btn btn-sm btn-outline-secondary" style={{marginLeft:8}} onClick={onClose}>Close</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )

  if (typeof document !== 'undefined') {
    return createPortal(modal, document.body)
  }
  return modal
}
