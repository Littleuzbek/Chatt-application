import React from 'react'
import ClearHistory from './ClearHistory'
import DeleteUserFromList from './DeleteUserFromList'
import './Oncontext.css'

export default function ListContext({leftVal,topVal, selectedUser }) {
  return (
    <div className='listContext' style={{ left: leftVal + "px", top: topVal + "px" }}>
        <ClearHistory selectedUser={selectedUser}/>
        <DeleteUserFromList selectedUser={selectedUser} />
    </div>
  )
}
