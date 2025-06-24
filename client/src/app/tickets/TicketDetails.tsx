import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../slices/hooks'
import {
  fetchTicketByIdThunk,
  assignTicketThunk,
  unassignTicketThunk,
  markCompleteThunk,
  markIncompleteThunk,
} from '../slices/tickets/tickets.thunks'

const TicketDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const loadingDetails = useAppSelector((state) => state.tickets.loadingDetails)
  const saving = useAppSelector((state) => state.tickets.saving)
  const error = useAppSelector((state) => state.tickets.error)
  const users = useAppSelector((state) => state.users.users)
  const usersLoading = useAppSelector((state) => state.users.loading)
  const usersError = useAppSelector((state) => state.users.error)
  const ticket = useAppSelector((state) =>
    state.tickets.tickets.find((t) => t.id === Number(id)) ||
    state.tickets.selectedTicket
  )

  const [assigneeId, setAssigneeId] = useState<number | null>(null)
  const [completed, setCompleted] = useState(false)
  const [localError, setLocalError] = useState<string | null>(null)

  useEffect(() => {
    if (!ticket && id) {
      dispatch(fetchTicketByIdThunk(Number(id)))
    } else if (ticket) {
      setAssigneeId(ticket.assigneeId ?? null)
      setCompleted(ticket.completed ?? false)
    }
  }, [dispatch, id, ticket])

  const handleSave = async () => {
    if (!ticket) return
    setLocalError(null)

    try {
      if (assigneeId !== ticket.assigneeId && ticket.id) {
        if (assigneeId === null) {
          await dispatch(unassignTicketThunk(ticket.id)).unwrap()
        } else {
          await dispatch(assignTicketThunk({ ticketId: ticket.id, userId: assigneeId })).unwrap()
        }
      }

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

  if (loadingDetails) {
    return (
      <div className="container py-4 bg-light rounded-3">
        <div className="card rounded shadow-sm cursor-pointer">
          <div className="card-body text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading ticket details...</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container py-4 bg-light rounded-3">
        <div className="alert alert-danger" role="alert">
          Error: {error}
        </div>
      </div>
    )
  }

  if (!ticket) {
    return (
      <div className="container py-4 bg-light rounded-3">
        <div className="alert alert-warning" role="alert">
          No ticket found.
        </div>
      </div>
    )
  }

  return (
    <div className="container py-4 bg-light rounded-3">
      <div className="card rounded shadow-md cursor-pointer">
        <div className="card-body">
          <h2 className="card-title text-primary mb-4">Ticket #{ticket.id} Details</h2>

          <div className="mb-3">
            <label htmlFor="assignee" className="form-label">
              Assignee
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

          <div className="mb-3 form-check">
            <input
              type="checkbox"
              className="form-check-input"
              id="completed"
              checked={completed}
              onChange={(e) => setCompleted(e.target.checked)}
              disabled={saving}
            />
            <label className="form-check-label" htmlFor="completed">
              Mark as Completed
            </label>
          </div>

          {localError && (
            <div className="alert alert-danger mb-3" role="alert">
              {localError}
            </div>
          )}

          <div className="d-flex gap-2">
            <button
              className="btn btn-primary"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => navigate('/tickets')}
              disabled={saving}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TicketDetails
