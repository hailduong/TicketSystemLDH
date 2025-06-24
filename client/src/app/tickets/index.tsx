/* Common */
import React, {useState, useMemo} from 'react'
import styled from 'styled-components'
import {useNavigate} from 'react-router-dom'
import type {TTicket} from '../slices/tickets/tickets.types'
import {createTicketThunk} from '../slices/tickets/tickets.thunks'
import {useAppDispatch, useAppSelector} from '../slices/hooks'

/* Props & Store */
type FilterType = 'all' | 'open' | 'completed'

interface TicketsProps {
  tickets: Partial<TTicket>[]
  loading?: boolean
  error?: string
}

/* Styles */
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
            cursor: pointer;

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

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0,0,0,0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
`

const ModalForm = styled.form`
  background: #fff;
  padding: 1rem 1.5rem;
  border-radius: 12px;
  min-width: 320px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.2);
`

/* Hooks */
const useTicketHandlers = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const handleTicketClick = (id: number) => {
    navigate(`/tickets/${id}`)
  }

  const handleAddTicket = async (description: string) => {
    if (!description.trim()) return
    const payload = { description }
    return await dispatch(createTicketThunk(payload)).unwrap()
  }

  return {handleTicketClick, handleAddTicket}
}

/* Render */
const Tickets: React.FC<TicketsProps> = ({tickets, loading, error}) => {
  /* Store */
  const users = useAppSelector((state) => state.users.users)

  /* States */
  const [filter, setFilter] = useState<FilterType>('all')
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [newDescription, setNewDescription] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)

  /* Handlers */
  const {handleTicketClick, handleAddTicket} = useTicketHandlers()

  /* Memos */
  const filteredTickets = useMemo(() => {
    if (filter === 'all') return tickets
    return tickets.filter((t) => filter === 'open' ? !t.completed : t.completed)
  }, [tickets, filter])

  const handleAddTicketSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setSaveError(null)

    try {
      await handleAddTicket(newDescription)
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

      <div className="filter-row">
        {['all', 'open', 'completed'].map((f) => (
          <button
            key={f}
            className={filter === f ? 'active' : ''}
            onClick={() => setFilter(f as FilterType)}
            disabled={loading || isSaving}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      <div style={{marginBottom: '1.25rem'}}>
        <button
          onClick={() => setIsAddModalOpen(true)}
          disabled={loading || isSaving}
        >
          + Add Ticket
        </button>
      </div>

      {loading && <div>Loading tickets...</div>}
      {error && <div style={{color: 'red'}}>{error}</div>}

      {filteredTickets.length > 0 ? (
        <ul className="ticket-list">
          {filteredTickets.map((t) => {
            const assignedUser = t.assigneeId
              ? users.find(u => u.id === t.assigneeId)
              : null

            return (
              <li key={t.id} onClick={() => handleTicketClick(t.id!)}>
                <strong>#{t.id}</strong>: {t.description}
                <span className="status">
                  [{t.completed ? 'Completed' : 'Open'}]
                </span>
                {assignedUser && (
                  <div>
                    <small>Assignee: #{assignedUser.id} - {assignedUser.name}</small>
                  </div>
                )}
              </li>
            )
          })}
        </ul>
      ) : !loading ? (
        <div className="empty">No tickets found.</div>
      ) : null}

      {isAddModalOpen && (
        <ModalOverlay>
          <ModalForm onSubmit={handleAddTicketSubmit}>
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
          </ModalForm>
        </ModalOverlay>
      )}
    </TicketsContainer>
  )
}

export default Tickets
