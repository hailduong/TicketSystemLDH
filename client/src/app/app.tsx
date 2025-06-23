/* Common */
import React, {useEffect} from 'react'
import {Routes, Route} from 'react-router-dom'
import styled from 'styled-components'
import {fetchTickets} from './slices/tickets/tickets.thunks'
import Tickets from './tickets/tickets'
import {useAppDispatch, useAppSelector} from 'client/src/app/slices/hooks'

/* Props & Store */
// No props for App component

/* States */
// None locally

/* Handlers */
// None locally

/* Hooks */
const AppContainer = styled.div`
    padding: 1.5rem;
    max-width: 900px;
    margin: 0 auto;
    font-family: Arial, sans-serif;

    h1 {
        font-size: 2.5rem;
        color: #b31166;

        // Nested styling example
        margin-bottom: 1rem;
    }
`

/* Effects */
const App: React.FC = () => {
  const dispatch = useAppDispatch()

  // Select tickets and loading/error flags from Redux store
  const tickets = useAppSelector((state) => state.tickets.tickets)
  const loading = useAppSelector((state) => state.tickets.loadingList)
  const error = useAppSelector((state) => state.tickets.error)

  useEffect(() => {
    dispatch(fetchTickets())
  }, [dispatch])

  /* Render */
  return (
    <AppContainer>
      <h1>Ticketing App</h1>
      {loading && <p>Loading tickets...</p>}
      {error && <p style={{color: 'red'}}>{error}</p>}
      <Routes>
        <Route path="/tickets" element={<Tickets tickets={tickets}/>}/>
        <Route path="/tickets/:id" element={<h2>Details Not Implemented</h2>}/>
        <Route path="*" element={<p>Page not found</p>}/>
      </Routes>
    </AppContainer>
  )
}

export default App
