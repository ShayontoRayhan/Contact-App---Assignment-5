import React from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import ContactList from './components/ContactList'
import AddContact from './components/AddContact'
import ContactDetail from './pages/ContactDetail'
import ContactEdit from './pages/ContactEdit'

export default function App(){
  return (
    <div className="app-container">
      <header>
        <h1>Contact App</h1>
        <nav>
          <Link to="/">Home</Link> | <Link to="/add">Add New</Link>
        </nav>
      </header>
      <main>
        <Routes>
          <Route path="/" element={<ContactList/>} />
          <Route path="/add" element={<AddContact/>} />
          <Route path="/contact/:id" element={<ContactDetail/>} />
          <Route path="/edit/:id" element={<ContactEdit/>} />
        </Routes>
      </main>
    </div>
  )
}
