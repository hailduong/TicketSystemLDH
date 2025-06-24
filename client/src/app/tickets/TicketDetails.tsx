import React, {useEffect, useState, useCallback} from 'react'
import {useParams, useNavigate} from 'react-router-dom'
import {useAppDispatch, useAppSelector} from '../slices/hooks'
import {
  fetchTicketByIdThunk,
  assignTicketThunk,
  unassignTicketThunk,
  markCompleteThunk,
  markIncompleteThunk, fetchTicketsThunk
} from '../slices/tickets/tickets.thunks'
import styled from 'styled-components'

/* Interfaces & Types */
interface ITicket {
  id: number;
  description: string;
  assigneeId: number | null;
  completed: boolean;
}

interface IUser {
  id: number;
  name: string;
}

type TTicketState = {
  assigneeId: number | null;
  completed: boolean;
};


/* Styled Components */
const TicketDetailsContainer = styled.div`
  .ticket-card {
    transition: all 0.2s ease;

    .card-title {
      font-weight: 600;
      color: var(--bs-primary);
    }

    .description {
      font-style: italic;
      color: #6c757d;
    }

    .assignee-section {
      margin-bottom: 1rem;
    }

    .status-section {
      margin-bottom: 1rem;
    }

    .actions {
      display: flex;
      gap: 0.5rem;
      margin-top: 1.5rem;
    }
  }

  .loading-spinner {
    color: var(--bs-primary);
  }


  .alert {
    margin-bottom: 1rem;
  }
`

/* Components */
const LoadingView: React.FC = () => (
  <div className="container py-4 bg-light rounded-3" data-testid="loading-view">
    <div className="card rounded shadow-sm">
      <div className="card-body text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading ticket details...</span>
        </div>
      </div>
    </div>
  </div>
)

const ErrorView: React.FC<{ error: string }> = ({error}) => (
  <div className="container py-4 bg-light rounded-3" data-testid="error-view">
    <div className="alert alert-danger" role="alert">
      Error: {error}
    </div>
  </div>
)

const EmptyView: React.FC = () => (
  <div className="container py-4 bg-light rounded-3" data-testid="empty-view">
    <div className="alert alert-warning" role="alert">
      No ticket found.
    </div>
  </div>
)

/** Ticket Details Component */
const TicketDetails: React.FC = () => {
  /* Props & Store */
  const {id} = useParams<{ id: string }>()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const ticket = useAppSelector(state =>
    state.tickets.tickets.find(t => t.id === Number(id)) || state.tickets.selectedTicket
  )
  const users = useAppSelector(state => state.users.users)
  const loading = useAppSelector(state => state.tickets.loadingDetails)
  const saving = useAppSelector(state => state.tickets.saving)
  const error = useAppSelector(state => state.tickets.error)
  const usersLoading = useAppSelector(state => state.users.loading)
  const usersError = useAppSelector(state => state.users.error)

  /* States */
  const [ticketState, setTicketState] = useState<TTicketState>({
    assigneeId: null,
    completed: false
  })
  const [localError, setLocalError] = useState<string | null>(null)

  /* Effects */
  useEffect(() => {
    if (!ticket && id) {
      void dispatch(fetchTicketByIdThunk(Number(id)))
    } else if (ticket) {
      setTicketState({
        assigneeId: ticket.assigneeId ?? null,
        completed: ticket.completed ?? false
      })
    }
  }, [dispatch, id, ticket])

  /* Handlers */
  const handleSave = useCallback(async () => {
    if (!ticket?.id) return
    setLocalError(null)

    try {
      const {assigneeId, completed} = ticketState
      if (assigneeId !== ticket.assigneeId) {
        if (assigneeId === null) {
          await dispatch(unassignTicketThunk(ticket.id)).unwrap()
        } else {
          await dispatch(
            assignTicketThunk({ticketId: ticket.id, userId: assigneeId})
          ).unwrap()
        }
      }

      if (completed !== ticket.completed) {
        if (completed) {
          await dispatch(markCompleteThunk(ticket.id)).unwrap()
        } else {
          await dispatch(markIncompleteThunk(ticket.id)).unwrap()
        }
      }

      // Fetch updated list before navigation
      await dispatch(fetchTicketsThunk()).unwrap()
      navigate('/tickets')
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to save changes'
      setLocalError(errorMessage)
    }
  }, [ticket, ticketState, dispatch, navigate])

  /* Render */
  if (loading) return <LoadingView/>
  if (error) return <ErrorView error={error}/>
  if (!ticket) return <EmptyView/>

  return (
    <TicketDetailsContainer data-testid="ticket-details">
      <div className="container py-4 bg-light rounded-3">
        <div className="ticket-card card rounded shadow-sm">
          <div className="card-body" data-testid="ticket-form">
            <h2 className="card-title mb-4" data-testid="ticket-title">
              Ticket #{ticket.id}
            </h2>

            <div className="description mb-3" data-testid="ticket-description">
              {ticket.description}
            </div>

            <div className="assignee-section" data-testid="assignee-section">
              <label htmlFor="assignee" className="form-label">
                <strong>Assignee:</strong>
              </label>
              {usersLoading ? (
                <p className="text-muted">Loading users...</p>
              ) : usersError ? (
                <div className="alert alert-danger">
                  Error loading users: {usersError}
                </div>
              ) : (
                <select
                  id="assignee"
                  className="form-select"
                  value={ticketState.assigneeId ?? ''}
                  onChange={(e) => setTicketState(prev => ({
                    ...prev,
                    assigneeId: e.target.value ? Number(e.target.value) : null
                  }))}
                  disabled={saving}
                  data-testid="assignee-select"
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

            <div className="status-section form-check" data-testid="status-section">
              <input
                type="checkbox"
                className="form-check-input"
                id="completed"
                checked={ticketState.completed}
                onChange={(e) => setTicketState(prev => ({
                  ...prev,
                  completed: e.target.checked
                }))}
                disabled={saving}
                data-testid="completed-checkbox"
              />
              <label className="form-check-label" htmlFor="completed">
                Mark as Completed
              </label>
            </div>

            {localError && (
              <div className="alert alert-danger" role="alert" data-testid="error-message">
                {localError}
              </div>
            )}

            <div className="actions" data-testid="ticket-actions">
              <button
                className="btn btn-primary"
                onClick={handleSave}
                disabled={saving}
                data-testid="save-button"
              >
                {saving ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                      data-testid="saving-spinner"
                    />
                    Saving...
                  </>
                ) : (
                  'Update'
                )}
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => navigate('/tickets')}
                disabled={saving}
                data-testid="cancel-button"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </TicketDetailsContainer>
  )
}

export default TicketDetails
