import React from 'react'
import {render, screen, fireEvent} from '@testing-library/react'
import {Provider} from 'react-redux'
import {MemoryRouter} from 'react-router-dom'
import {configureStore} from '@reduxjs/toolkit'
import usersReducer from '../../slices/users/users.slice'
import Tickets from './index'

jest.mock('react-error-boundary', () => ({
  ErrorBoundary: ({children}: { children: React.ReactNode }) => <>{children}</>
}))

const sampleUsers = [
  {id: 1, name: 'Alice'},
  {id: 2, name: 'Bob'}
]

const sampleTickets = [
  {id: 101, description: 'Fix bug', assigneeId: 1, completed: false},
  {id: 102, description: 'Add feature', assigneeId: 2, completed: true}
]

function renderWithStore(ui: React.ReactElement, preloadedState = {}) {
  const store = configureStore({
    reducer: {users: usersReducer},
    preloadedState: {
      users: {users: sampleUsers},
      ...preloadedState
    }
  })

  return render(
    <Provider store={store}>
      <MemoryRouter>{ui}</MemoryRouter>
    </Provider>
  )
}

describe('Tickets List Screen', () => {
  it('renders all tickets with correct assignees and statuses', () => {
    renderWithStore(
      <Tickets tickets={sampleTickets} loading={false} error={undefined}/>
    )

    // Ticket descriptions
    expect(screen.getByText('Fix bug')).toBeInTheDocument()
    expect(screen.getByText('Add feature')).toBeInTheDocument()

    // Assignee names
    expect(screen.getByText('Assignee: Alice')).toBeInTheDocument()
    expect(screen.getByText('Assignee: Bob')).toBeInTheDocument()

    // Status badges
    expect(screen.getByText('Open')).toBeInTheDocument()
    expect(screen.getByText('Completed')).toBeInTheDocument()
  })

  it('filters tickets by “Completed” when that button is clicked', () => {
    renderWithStore(
      <Tickets tickets={sampleTickets} loading={false} error={undefined}/>
    )
    fireEvent.click(screen.getByLabelText('Completed Tickets'))

    expect(screen.getByText('Add feature')).toBeInTheDocument()
    expect(screen.queryByText('Fix bug')).not.toBeInTheDocument()
  })

  it('opens the AddTicketModal when the Add button is clicked', () => {
    renderWithStore(
      <Tickets tickets={sampleTickets} loading={false} error={undefined}/>
    )
    fireEvent.click(screen.getByLabelText('Add new ticket'))
    expect(screen.getByText('Add New Ticket')).toBeInTheDocument()
  })

  it('displays an error message when error prop is provided', () => {
    renderWithStore(
      <Tickets tickets={[]} loading={false} error="Network failure"/>
    )
    expect(screen.getByText('Network failure')).toBeInTheDocument()
  })
})
