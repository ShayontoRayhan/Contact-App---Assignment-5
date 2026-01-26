import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useContacts } from '../context/ContactContext'

export default function AddContact(){
  const [form, setForm] = useState({ firstName:'', lastName:'', email:'', phone:'', address:'' })
  const [errors, setErrors] = useState({})
  const { addContact } = useContacts()
  const navigate = useNavigate()

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
    try {
      await addContact(form)
      // Wait a moment for the data to sync
      await new Promise(resolve => setTimeout(resolve, 500))
      navigate('/')
    } catch (err) {
      console.error('Failed to add contact:', err)
    }
  }

  const isInvalid = Object.keys(errors).length > 0 || !form.firstName || !form.email

  return (
    <div className="container">
      <div className="card">
        <div className="card-header card-title"><strong>Add New Contact</strong></div>
        <div className="card-body">
          <form onSubmit={handleSubmit} noValidate>
            <div className="form-group row">
              <label htmlFor="firstName" className="col-md-3 col-form-label">First Name</label>
              <div className="col-md-9">
                <input id="firstName" name="firstName" className={`form-control ${errors.firstName? 'is-invalid':''}`} value={form.firstName} onChange={handleChange} aria-invalid={!!errors.firstName} aria-describedby="firstNameError" required />
                {errors.firstName && <div id="firstNameError" className="invalid-feedback">{errors.firstName}</div>}
              </div>
            </div>

            <div className="form-group row">
              <label htmlFor="lastName" className="col-md-3 col-form-label">Last Name</label>
              <div className="col-md-9">
                <input id="lastName" name="lastName" className="form-control" value={form.lastName} onChange={handleChange} />
              </div>
            </div>

            <div className="form-group row">
              <label htmlFor="email" className="col-md-3 col-form-label">Email</label>
              <div className="col-md-9">
                <input id="email" name="email" type="email" className={`form-control ${errors.email? 'is-invalid':''}`} value={form.email} onChange={handleChange} aria-invalid={!!errors.email} aria-describedby="emailError" required />
                {errors.email && <div id="emailError" className="invalid-feedback">{errors.email}</div>}
              </div>
            </div>

            <div className="form-group row">
              <label htmlFor="phone" className="col-md-3 col-form-label">Phone</label>
              <div className="col-md-9">
                <input id="phone" name="phone" className={`form-control ${errors.phone? 'is-invalid':''}`} value={form.phone} onChange={handleChange} aria-invalid={!!errors.phone} aria-describedby="phoneError" />
                {errors.phone && <div id="phoneError" className="invalid-feedback">{errors.phone}</div>}
              </div>
            </div>

            <div className="form-group row">
              <label htmlFor="address" className="col-md-3 col-form-label">Address</label>
              <div className="col-md-9">
                <textarea id="address" name="address" rows="3" className="form-control" value={form.address} onChange={handleChange} />
              </div>
            </div>

            <hr />
            <div className="form-group row mb-0">
              <div className="col-md-9 offset-md-3">
                <button type="submit" className="btn btn-primary" disabled={isInvalid}>Save</button>
                <button type="button" className="btn btn-outline-secondary" onClick={()=>window.history.back()} style={{marginLeft:8}}>Cancel</button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
