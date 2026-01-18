import React from 'react'

export default function SearchFilter({ query, setQuery, filter, setFilter }){
  return (
    <div className="search-filter">
      <input placeholder="Search..." value={query} onChange={e=>setQuery(e.target.value)} />
      <select value={filter} onChange={e=>setFilter(e.target.value)}>
        <option value="">No Filter</option>
        <option value="first">First Name (A → Z)</option>
        <option value="last">Last Name (A → Z)</option>
        <option value="oldest">Oldest To First</option>
      </select>
    </div>
  )
}
