import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { useAppDispatch, useAppSelector } from '../slices/hooks'
import {
  fetchTicketByIdThunk,
  assignTicketThunk,
  unassignTicketThunk,
  markCompleteThunk,
  markIncompleteThunk,
} from '../slices/tickets/tickets.thunks'
import type { TTicket } from '../slices/tickets/tickets.types'

const Container = styled.div`
  max-width: 600px;
  margin: 2rem auto;
  padding: 1.5rem;
  background: #fafafa;
  border-radius: 12px;
  font-family: Arial, sans-serif;

  h2 {
    color: #b31166;
    margin-bottom: 1rem;
  }

  label {
    display: block;
    margin: 0.5rem 0 0.25rem;
    font-weight: 600;
  }

  select, input[type='checkbox'] {
    margin-bottom: 1rem;
  }

  button {
    padding: 0.5rem 1rem;
    background: #b31166;
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-weight: 600;
    margin-right: 1rem;

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }

  .error {
    color: red;
    margin-bottom: 1rem;
  }
`

const TicketDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  // Local state for loading and error
  const loadingDetails = useAppSelector((state) => state.tickets.loadingDetails)
  const saving = useAppSelector((state) => state.tickets.saving)
  const error = useAppSelector((state) => state.tickets.error)

  // Users for assignee dropdown
  const users = useAppSelector((state) => state.users.users)
  const usersLoading = useAppSelector((state) => state.users.loading)
  const usersError = useAppSelector((state) => state.users.error)

  // Selected ticket from state
  const ticket = useAppSelector((state) =>
    state.tickets.tickets.find((t) => t.id === Number(id)) ||
    state.tickets.selectedTicket
  )

  // Local editable fields
  const [assigneeId, setAssigneeId] = useState<number | null>(null)
  const [completed, setCompleted] = useState(false)
  const [localError, setLocalError] = useState<string | null>(null)

  // Load ticket details if not found
  useEffect(() => {
    if (!ticket && id) {
      dispatch(fetchTicketByIdThunk(Number(id)))
    } else if (ticket) {
      setAssigneeId(ticket.assigneeId ?? null)
      setCompleted(ticket.completed ?? false)
    }
  }, [dispatch, id, ticket])

  // Save handler with new thunks
  const handleSave = async () => {
    if (!ticket) return
    setLocalError(null)

    try {
      // Assignment update
      if (assigneeId !== ticket.assigneeId && ticket.id) {
        if (assigneeId === null) {
          await dispatch(unassignTicketThunk(ticket.id)).unwrap()
        } else {
          await dispatch(assignTicketThunk({ ticketId: ticket.id, userId: assigneeId })).unwrap()
        }
      }

      // Completion update
      if (completed !== ticket.completed && ticket.id) {
        if (completed) {
          await dispatch(markCompleteThunk(ticket.id)).unwrap()
        } else {
          await dispatch(markIncompleteThunk(ticket.id)).unwrap()
        }
      }

      navigate('/tickets')
    } catch (err: any) {
      setLocalError(err.message || 'Failed to save changes')
    }
  }

  if (loadingDetails) return <Container>Loading ticket details...</Container>
  if (error) return <Container className="error">Error: {error}</Container>
  if (!ticket) return <Container>No ticket found.</Container>

  return (
    <Container>
      <h2>Ticket #{ticket.id} Details</h2>

      <div>
        <label htmlFor="assignee">Assignee</label>
        {usersLoading ? (
          <p>Loading users...</p>
        ) : usersError ? (
          <p className="error">Error loading users: {usersError}</p>
        ) : (
          <select
            id="assignee"
            value={assigneeId ?? ''}
            onChange={(e) =>
              setAssigneeId(e.target.value ? Number(e.target.value) : null)
            }
            disabled={saving}
          >
            <option value="">-- No Assignee --</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </select>
        )}
      </div>

      <div>
        <label htmlFor="completed">
          <input
            type="checkbox"
            id="completed"
            checked={completed}
            onChange={(e) => setCompleted(e.target.checked)}
            disabled={saving}
          />
          {' '}Mark as Completed
        </label>
      </div>

      {localError && <p className="error">{localError}</p>}

      <div>
        <button onClick={handleSave} disabled={saving}>
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
        <button onClick={() => navigate('/tickets')} disabled={saving}>
          Cancel
        </button>
      </div>
    </Container>
  )
}

export default TicketDetails
