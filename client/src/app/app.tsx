import React, {useEffect} from 'react'
import {Routes, Route, Navigate, Link} from 'react-router-dom'
import {fetchTicketsThunk} from './slices/tickets/tickets.thunks'
import Tickets from './tickets'
import {useAppDispatch, useAppSelector} from 'client/src/app/slices/hooks'
import {fetchUsers} from 'client/src/app/slices/users/users.thunks'
import TicketDetails from 'client/src/app/tickets/TicketDetails'
import styled from 'styled-components'


const AppContainer = styled.div`
  .navbar {
    background: var(--bs-primary);
    margin-bottom: 1.5rem;


    .navbar-brand {
      color: white;

      i {
        margin-right: 0.5rem;
      }

      strong {
        font-weight: 800;
      }
    }
  }

  .container {
    max-width: 1200px;
    margin: 0 auto;
  }
`

const App: React.FC = () => {
  /* Props & Store */
  const dispatch = useAppDispatch()
  const {tickets, loadingList: loading, error} = useAppSelector((state) => state.tickets)

  /* Effects */
  useEffect(() => {
    // Load initial data
    dispatch(fetchTicketsThunk())
    dispatch(fetchUsers())
  }, [dispatch])

  /* Render */
  return (
    <AppContainer>
      <nav className="navbar shadow">
        <div className="container">
          <Link className="navbar-brand" to="/">
            <i className="bi bi-ticket-detailed" />
            <strong>Ticket</strong> System
          </Link>
        </div>
      </nav>

      <div className="container">
        {loading && <div className="alert alert-info">Loading tickets...</div>}
        {error && <div className="alert alert-danger">{error}</div>}

        <Routes>
          <Route path="/" element={<Navigate to="/tickets" replace />} />
          <Route path="/tickets" element={<Tickets tickets={tickets} />} />
          <Route path="/tickets/:id" element={<TicketDetails />} />
          <Route
            path="*"
            element={<div className="alert alert-warning">Page not found</div>}
          />
        </Routes>
      </div>
    </AppContainer>
  )
}

export default App
