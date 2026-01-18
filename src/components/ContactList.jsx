import React, { useMemo, useState } from 'react'
import { useContacts } from '../context/ContactContext'
import ContactItem from './ContactItem'
import { Link } from 'react-router-dom'

export default function ContactList(){
  const { contacts, loading } = useContacts()
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('')

  const filtered = useMemo(()=>{
    let list = contacts.slice()
    if(query){
      const q = query.toLowerCase()
      list = list.filter(c => [c.firstName, c.lastName, c.email, c.phone].some(v => v && v.toLowerCase().includes(q)))
    }
    if(filter === 'first') list.sort((a,b)=> a.firstName.localeCompare(b.firstName))
    if(filter === 'last') list.sort((a,b)=> a.lastName.localeCompare(b.lastName))
    if(filter === 'oldest') list.sort((a,b)=> a.id - b.id)
    return list
  },[contacts, query, filter])

  if(loading) return <div>Loading...</div>

  return (
    <div className="container">
      <div className="card">
        <div className="card-header card-title">
          <div className="d-flex align-items-center justify-content-between">
            <h2>All Contacts</h2>
            <div className="input-group w-50">
              <input type="text" className="form-control" placeholder="search contact" value={query} onChange={e=>setQuery(e.target.value)} />
              <button className="btn btn-success" type="button">Search</button>
            </div>
            <div>
              <Link to="/add" className="btn btn-success"><i className="fa fa-plus-circle"></i> Add New</Link>
            </div>
          </div>
        </div>

        <div className="d-flex align-items-center justify-content-between p-3">
          <div className="fs-2"><i className="fa fa-filter text-success"></i> Filter</div>
          <select className="form-select" value={filter} onChange={e=>setFilter(e.target.value)}>
            <option value="">Default</option>
            <option value="first">First Name (A → Z)</option>
            <option value="last">Last Name (A → Z)</option>
            <option value="oldest">Oldest To First</option>
          </select>
        </div>

        <div className="card-body">
          {filtered.length === 0 ? (
            <div className="no-contacts">No Contact Information</div>
          ) : (
            <table className="table table-striped table-hover">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">First Name</th>
                  <th scope="col">Last Name</th>
                  <th scope="col">Email</th>
                  <th scope="col">Phone</th>
                  <th scope="col">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(c => (
                  <ContactItem key={c.id} contact={c} />
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}
