// client/src/app/tickets/tickets.tsx
/* Common */
import React, {useState, useMemo} from 'react'
import styled from 'styled-components'
import {useNavigate} from 'react-router-dom' // import useNavigate
import type {TTicket} from '../slices/tickets/tickets.types'
import {createTicketThunk} from '../slices/tickets/tickets.thunks'
import {useAppDispatch, useAppSelector} from '../slices/hooks'

/* Props & Store */
type TicketsProps = {
  tickets: Partial<TTicket>[]
  loading?: boolean
  error?: string
}

/* States */
const TicketsContainer = styled.div`
    padding: 1.25rem;
    background: #fafafa;
    border-radius: 12px;

    h2 {
        color: #b31166;
        margin-bottom: 1rem;
    }

    .filter-row {
        display: flex;
        gap: 1rem;
        margin-bottom: 1.25rem;

        button {
            padding: 0.5rem 1rem;
            border: none;
            border-radius: 6px;
            background: #e33e6e;
            color: #fff;
            cursor: pointer;
            font-weight: 600;
            transition: background-color 0.3s;

            &.active {
                background: #b31166;
            }

            &:disabled {
                opacity: 0.5;
                cursor: not-allowed;
            }
        }
    }

    ul.ticket-list {
        list-style: none;
        padding: 0;

        li {
            margin-bottom: 0.75rem;
            padding: 0.75rem;
            border-radius: 8px;
            background: #fff;
            box-shadow: 0 2px 8px rgba(179, 17, 102, 0.03);
            cursor: pointer; /* add pointer cursor */

            .status {
                font-size: 0.85rem;
                color: #e45f3c;
                margin-left: 1rem;
            }
        }
    }

    .empty {
        color: #aaa;
        font-style: italic;
        margin: 2rem 0;
    }
`


/* Render */
const Tickets: React.FC<TicketsProps> = ({tickets, loading, error}) => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate() // initialize navigate

  // Users slice state
  const users = useAppSelector((state) => state.users.users)
  const usersLoading = useAppSelector((state) => state.users.loading)
  const usersError = useAppSelector((state) => state.users.error)

  // Filter and modal states
  const [filter, setFilter] = useState<'all' | 'open' | 'completed'>('all')

  // Add Ticket modal state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [newDescription, setNewDescription] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)

  // Filter tickets based on completed boolean
  const filteredTickets = useMemo(() => {
    if (filter === 'all') return tickets
    if (filter === 'open') return tickets.filter((t) => !t.completed)
    return tickets.filter((t) => t.completed)
  }, [tickets, filter])

  // Navigate to ticket details on click
  const handleTicketClick = (id: number) => {
    navigate(`/tickets/${id}`)
  }

  // Form submit handler for adding ticket
  const handleAddTicketSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newDescription.trim()) return

    setIsSaving(true)
    setSaveError(null)

    try {
      const payload = {
        description: newDescription
      }
      await dispatch(createTicketThunk(payload)).unwrap()
      setNewDescription('')
      setIsAddModalOpen(false)
    } catch (err: any) {
      setSaveError(err.message || 'Failed to add ticket')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <TicketsContainer>
      <h2>Tickets</h2>

      {/* Filter buttons */}
      <div className="filter-row">
        <button
          className={filter === 'all' ? 'active' : ''}
          onClick={() => setFilter('all')}
          disabled={loading || isSaving}
        >
          All
        </button>
        <button
          className={filter === 'open' ? 'active' : ''}
          onClick={() => setFilter('open')}
          disabled={loading || isSaving}
        >
          Open
        </button>
        <button
          className={filter === 'completed' ? 'active' : ''}
          onClick={() => setFilter('completed')}
          disabled={loading || isSaving}
        >
          Completed
        </button>
      </div>

      {/* Add Ticket button */}
      <div style={{marginBottom: '1.25rem'}}>
        <button
          onClick={() => setIsAddModalOpen(true)}
          disabled={loading || isSaving}
        >
          + Add Ticket
        </button>
      </div>

      {/* Loading & Error */}
      {loading && <div>Loading tickets...</div>}
      {error && <div style={{color: 'red'}}>{error}</div>}

      {/* Ticket List */}
      {filteredTickets.length > 0 ? (
        <ul className="ticket-list">
          {filteredTickets.map((t) => (
            <li key={t.id} onClick={() => handleTicketClick(t.id!)}>
              <strong>#{t.id}</strong>: {t.description}
              <span className="status">
                [{t.completed ? 'Completed' : 'Open'}]
              </span>
              {t.assigneeId !== null && (
                <div>
                  <small>Assignee ID: {t.assigneeId}</small>
                </div>
              )}
            </li>
          ))}
        </ul>
      ) : !loading ? (
        <div className="empty">No tickets found.</div>
      ) : null}

      {/* Add Ticket Modal */}
      {isAddModalOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 999
          }}
        >
          <form
            onSubmit={handleAddTicketSubmit}
            style={{
              background: '#fff',
              padding: '1rem 1.5rem',
              borderRadius: '12px',
              minWidth: '320px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.2)'
            }}
          >
            <h3>Add New Ticket</h3>
            <div style={{marginBottom: '0.75rem'}}>
              <label htmlFor="description">Description</label>
              <input
                id="description"
                type="text"
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                disabled={isSaving}
                required
                style={{width: '100%', padding: '0.5rem', marginTop: '0.25rem'}}
                autoFocus
              />
            </div>
            {saveError && <p style={{color: 'red'}}>{saveError}</p>}
            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '0.5rem'
              }}
            >
              <button
                className="btn btn-primary"
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                disabled={isSaving}
              >
                Cancel
              </button>
              <button type="submit" disabled={isSaving}>
                {isSaving ? 'Saving...' : 'Add'}
              </button>
            </div>
          </form>
        </div>
      )}
    </TicketsContainer>
  )
}

export default Tickets
