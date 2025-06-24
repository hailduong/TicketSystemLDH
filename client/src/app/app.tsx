import React, {useEffect} from 'react'
import {Routes, Route, Navigate, Link} from 'react-router-dom'
import {fetchTicketsThunk} from './slices/tickets/tickets.thunks'
import Tickets from './tickets'
import {useAppDispatch, useAppSelector} from 'client/src/app/slices/hooks'
import {fetchUsers} from 'client/src/app/slices/users/users.thunks'
import TicketDetails from 'client/src/app/tickets/TicketDetails'

const App: React.FC = () => {
  const dispatch = useAppDispatch()
  const tickets = useAppSelector((state) => state.tickets.tickets)
  const loading = useAppSelector((state) => state.tickets.loadingList)
  const error = useAppSelector((state) => state.tickets.error)

  useEffect(() => {
    dispatch(fetchTicketsThunk())
    dispatch(fetchUsers())
  }, [dispatch])

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary mb-4 shadow">
        <div className="container">
          <Link className="navbar-brand" to="/">
            <strong><i className="bi bi-ticket-detailed"></i> Ticket</strong> System
          </Link>
        </div>
      </nav>

      <div className="container">
        {loading && (
          <div className="alert alert-info">Loading tickets...</div>
        )}
        {error && (
          <div className="alert alert-danger">{error}</div>
        )}
        <Routes>
          <Route path="/" element={<Navigate to="/tickets" replace/>}/>
          <Route path="/tickets" element={<Tickets tickets={tickets}/>}/>
          <Route path="/tickets/:id" element={<TicketDetails/>}/>
          <Route path="*" element={
            <div className="alert alert-warning">Page not found</div>
          }/>
        </Routes>
      </div>
    </>
  )
}

export default App
