import React, {useState, useMemo} from 'react'
import {useNavigate, useSearchParams} from 'react-router-dom'
import type {TTicket} from '../../slices/tickets/tickets.types'
import {createTicketThunk} from '../../slices/tickets/tickets.thunks'
import {useAppDispatch, useAppSelector} from '../../slices/hooks'
import AddTicketModal from './AddTicketModal'
import {TicketsContainer, TicketSkeleton, TicketList} from './Tickets.styled'
import {TicketErrorBoundary} from './TicketErrorBoundary'
import {TicketItem} from './TicketItem'

/* Constants */
export const TEST_IDS = {
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
