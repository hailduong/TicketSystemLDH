import type {TTicket} from '../../slices/tickets/tickets.types'
import React from 'react'
import {TEST_IDS} from './index'

interface ITicketItemProps {
  ticket: Partial<TTicket>
  user?: { id: number; name: string }
  onClick: () => void
}

/* Memoized Components */
export const TicketItem = React.memo(({ticket, user, onClick}: ITicketItemProps) => (
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
