import React, {useState, useMemo, PropsWithChildren} from 'react'
import {useNavigate, useSearchParams} from 'react-router-dom'
import {ErrorBoundary} from 'react-error-boundary'
import type {TTicket} from '../slices/tickets/tickets.types'
import {createTicketThunk} from '../slices/tickets/tickets.thunks'
import {useAppDispatch, useAppSelector} from '../slices/hooks'
import AddTicketModal from './AddTicketModal'
import styled from 'styled-components'

/* Constants */
const TEST_IDS = {
  ticketList: 'ticket-list',
  addButton: 'add-ticket-button',
  filterGroup: 'filter-group',
  ticketItem: 'ticket-item'
} as const

/* Types & Interfaces */
type TFilterType = 'all' | 'open' | 'completed'

interface ITicketsProps {
  tickets: Partial<TTicket>[]
  loading?: boolean
  error?: string
}

interface IFilterOption {
  key: TFilterType
  icon: string
  tooltip: string
}

interface ITicketItemProps {
  ticket: Partial<TTicket>
  user?: { id: number; name: string }
  onClick: () => void
}

/* Styles */
const TicketsContainer = styled.div`

  padding: 16px;
  background: var(--bs-light);

  .ticket-header {
    margin-bottom: 1.5rem;
    color: var(--bs-primary);
  }

  .controls-row {
    margin-bottom: 1.5rem;
  }

  .filter-buttons {
    .btn {
      transition: all 0.2s ease;

      &.btn-primary {
        font-weight: 500;
      }
    }
  }

  .ticket-list {
    .ticket-item {
      transition: box-shadow 0.2s ease;
      cursor: pointer;
      box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
      position: relative;
      border-left: 5px solid var(--bs-primary);
      padding: 1rem 1.5rem 1rem 1rem;

      &:hover {
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
      }

      .ticket-id {
        font-weight: 600;
        background: var(--bs-primary);
        color: white;
        padding: 3px 5px;
        position: absolute;
        top: -5px;
        right: -9px;
        border-radius: 8px;
      }

      .ticket-status {
        margin-left: 0.3rem;
        font-size: 0.7rem;
      }

      .ticket-assignee {
        margin-top: 0.25rem;
        font-size: 0.875rem;
      }
    }
  }

  .empty-state {
    font-style: italic;
    color: var(--bs-gray-600);
    margin: 1.5rem 0;
  }
`

const TicketList = styled.ul.attrs({
  role: 'list',
  'aria-label': 'Tickets list'
})`
  list-style: none;
  padding: 0;
`
const TicketSkeleton = styled.div`
  padding: 1rem;
  margin-bottom: 1rem;
  background: #fff;
  border-radius: 0.25rem;

  &::after {
    content: '';
    display: block;
    width: 100%;
    height: 80px;
    background: linear-gradient(
        90deg,
        #f0f0f0 25%,
        #f8f8f8 50%,
        #f0f0f0 75%
    );
    background-size: 200% 100%;
    animation: pulse 1.5s infinite;
  }

  @keyframes pulse {
    0% {
      background-position: 200% 0;
    }
    100% {
      background-position: -200% 0;
    }
  }
`

/* Error Boundary */
const TicketErrorBoundary: React.FC<PropsWithChildren> = ({children}) => (
  <ErrorBoundary
    FallbackComponent={({error}) => (
      <div className="alert alert-danger" role="alert">
        <h4>Error loading tickets</h4>
        <pre>{error.message}</pre>
      </div>
    )}
  >
    {children}
  </ErrorBoundary>
)

/* Memoized Components */
const TicketItem = React.memo(({ticket, user, onClick}: ITicketItemProps) => (
  <li
    data-testid={TEST_IDS.ticketItem}
    onClick={onClick}
    onKeyPress={(e) => e.key === 'Enter' && onClick()}
    className="ticket-item mb-3 bg-white rounded"
    tabIndex={0}
    role="button"
    aria-label={`Ticket ${ticket.id}: ${ticket.description}`}
  >
    <span className="ticket-id">#{ticket.id}</span>
    <span>{ticket.description}</span>
    <span
      className={`ticket-status badge rounded-pill ${
        ticket.completed ? 'bg-success' : 'bg-warning'
      }`}
    >
      {ticket.completed ? 'Completed' : 'Open'}
    </span>
    <div className="ticket-assignee text-muted">
      {user ? `Assignee: ${user.name}` : 'No Assignee'}
    </div>
  </li>
))

TicketItem.displayName = 'TicketItem'

/**
 * Custom hook for ticket-related handlers
 */
const useTicketHandlers = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const handleTicketClick = (id: number) => {
    navigate(`/tickets/${id}`)
  }

  const handleAddTicket = async (description: string) => {
    if (!description.trim()) return
    const payload = {description}
    return await dispatch(createTicketThunk(payload)).unwrap()
  }

  return {handleTicketClick, handleAddTicket}
}

/**
 * Tickets component displays a filterable list of tickets with add functionality
 */
const Tickets: React.FC<ITicketsProps> = ({tickets, loading, error}) => {
  /* Props & Store */
  const users = useAppSelector((state) => state.users.users)
  const [searchParams, setSearchParams] = useSearchParams()

  /* States */
  const filter = (searchParams.get('filter') as TFilterType) || 'all'
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [newDescription, setNewDescription] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)

  /* Handlers */
  const {handleTicketClick, handleAddTicket} = useTicketHandlers()

  const handleFilterChange = (newFilter: TFilterType) => {
    setSearchParams({filter: newFilter})
  }

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

  /* Common */
  const filterOptions: IFilterOption[] = [
    {key: 'all', icon: 'bi-collection', tooltip: 'All Tickets'},
    {key: 'open', icon: 'bi-circle', tooltip: 'Open Tickets'},
    {key: 'completed', icon: 'bi-check-circle', tooltip: 'Completed Tickets'}
  ]

  /* Hooks */
  const filteredTickets = useMemo(() => {
    if (filter === 'all') return tickets
    return tickets.filter((t) => filter === 'open' ? !t.completed : t.completed)
  }, [tickets, filter])

  /* Render */
  return (
    <TicketErrorBoundary>
      <TicketsContainer>
        {/* Header and Controls */}
        <h1 className="ticket-header">Tickets</h1>

        <div className="row controls-row">
          <div className="col-4">
            <button
              data-testid={TEST_IDS.addButton}
              className="btn btn-primary"
              onClick={() => setIsAddModalOpen(true)}
              disabled={loading || isSaving}
              aria-label="Add new ticket"
            >
              <i className="bi bi-plus-lg"/> Add
            </button>
          </div>

          <div className="col-8 d-flex justify-content-end">
            <div
              className="btn-group filter-buttons"
              role="group"
              aria-label="Ticket Filter"
              data-testid={TEST_IDS.filterGroup}
            >
              {filterOptions.map(({key, icon, tooltip}) => (
                <button
                  key={key}
                  type="button"
                  className={`btn ${filter === key ? 'btn-primary' : 'btn-outline-primary'}`}
                  onClick={() => handleFilterChange(key)}
                  disabled={loading || isSaving}
                  data-bs-toggle="tooltip"
                  data-bs-placement="top"
                  title={tooltip}
                  aria-label={tooltip}
                >
                  <i className={`bi ${icon}`}/>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Loading and Error States */}
        {loading && (
          <div aria-live="polite" aria-busy="true">
            {[1, 2, 3].map((n) => (
              <TicketSkeleton key={n}/>
            ))}
          </div>
        )}
        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        {/* Ticket List */}
        {filteredTickets.length > 0 ? (
          <TicketList className="ticket-list" data-testid={TEST_IDS.ticketList}>
            {filteredTickets.map((ticket) => (
              <TicketItem
                key={ticket.id}
                ticket={ticket}
                user={users.find(u => u.id === ticket.assigneeId)}
                onClick={() => handleTicketClick(ticket.id!)}
              />
            ))}
          </TicketList>
        ) : !loading ? (
          <div className="empty-state" role="status">
            No tickets found.
          </div>
        ) : null}

        <AddTicketModal
          isOpen={isAddModalOpen}
          description={newDescription}
          isSaving={isSaving}
          saveError={saveError}
          onClose={() => setIsAddModalOpen(false)}
          onDescriptionChange={setNewDescription}
          onSubmit={handleAddTicketSubmit}
        />
      </TicketsContainer>
    </TicketErrorBoundary>
  )
}

export default Tickets
