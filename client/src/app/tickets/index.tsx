import React, {useState, useMemo} from 'react'
import {useNavigate} from 'react-router-dom'
import type {TTicket} from '../slices/tickets/tickets.types'
import {createTicketThunk} from '../slices/tickets/tickets.thunks'
import {useAppDispatch, useAppSelector} from '../slices/hooks'
import AddTicketModal from './AddTicketModal'
import styled from 'styled-components'

/* Styles */
const TicketsContainer = styled.div`
    padding: 1rem;
    border-radius: 0.3rem;
    
    .list-unstyled li {
        transition: box-shadow 0.2s ease;
        cursor: pointer;
        box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);

        &:hover {
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
        }
    }
`

/* Types & Interfaces */
type FilterType = 'all' | 'open' | 'completed'

interface TicketsProps {
  tickets: Partial<TTicket>[]
  loading?: boolean
  error?: string
}

/* Hooks */
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

/* Components */
const Tickets: React.FC<TicketsProps> = ({tickets, loading, error}) => {
  const users = useAppSelector((state) => state.users.users)
  const [filter, setFilter] = useState<FilterType>('all')
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [newDescription, setNewDescription] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)

  const {handleTicketClick, handleAddTicket} = useTicketHandlers()

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

  /* Render */
  return (
    <TicketsContainer className="p-4 bg-light rounded-3">
      <h1 className="text-primary mb-3">Tickets</h1>

      <div className="row  mb-4">
        <div className="col-4">
          <button
            className="btn btn-primary "
            onClick={() => setIsAddModalOpen(true)}
            disabled={loading || isSaving}
          >
            <i className="bi bi-plus-lg"></i> Add
          </button>
        </div>
        <div className="col-8 d-flex justify-content-end">
          <div className="btn-group" role="group" aria-label="Ticket Filter">
            {[
              {key: 'all', icon: 'bi-collection', tooltip: 'All Tickets'},
              {key: 'open', icon: 'bi-circle', tooltip: 'Open Tickets'},
              {key: 'completed', icon: 'bi-check-circle', tooltip: 'Completed Tickets'}
            ].map(({key, icon, tooltip}) => (
              <button
                key={key}
                type="button"
                className={`btn ${filter === key ? 'btn-primary' : 'btn-outline-primary'}`}
                onClick={() => setFilter(key as FilterType)}
                disabled={loading || isSaving}
                data-bs-toggle="tooltip"
                data-bs-placement="top"
                title={tooltip}
              >
                <i className={`bi ${icon}`}></i>
              </button>
            ))}
          </div>
        </div>

      </div>


      {loading && <div className="spinner-border text-primary" role="status"/>}
      {error && <div className="alert alert-danger">{error}</div>}

      {filteredTickets.length > 0 ? (
        <ul className="list-unstyled">
          {filteredTickets.map((t) => {
            const assignedUser = t.assigneeId
              ? users.find(u => u.id === t.assigneeId)
              : null

            return (
              <li
                key={t.id}
                onClick={() => handleTicketClick(t.id!)}
                className="mb-3 p-3 bg-white rounded cursor-pointer"
              >
                <strong>#{t.id}</strong>: {t.description}
                <span className={`ms-1 badge rounded-pill ${t.completed ? 'bg-success' : 'bg-warning'}`}>
                  {t.completed ? 'Completed' : 'Open'}
                </span>
                {assignedUser ? (
                  <div className="small text-muted mt-1">
                    Assignee: {assignedUser.name}
                  </div>
                ) : (
                  <div className="small text-info mt-1">No Assignee</div>
                )}
              </li>
            )
          })}
        </ul>
      ) : !loading ? (
        <div className="text-muted fst-italic my-4">No tickets found.</div>
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
  )
}

export default Tickets
