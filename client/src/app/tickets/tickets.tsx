/* Common */
import React, { useState, useMemo } from 'react';
import styled from 'styled-components';
import {Ticket} from '@acme/shared-models'

/* Props & Store */
type TicketsProps = {
  tickets: Ticket[];
  loading?: boolean;
  error?: string;
};

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

            &.active {
                background: #b31166;
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
`;

export const Tickets: React.FC<TicketsProps> = ({ tickets, loading, error }) => {
  // Filter state: all, open, completed
  const [filter, setFilter] = useState<'all' | 'open' | 'completed'>('all');

  // Filter tickets based on `completed` boolean
  const filteredTickets = useMemo(() => {
    if (filter === 'all') return tickets;
    if (filter === 'open') return tickets.filter((t) => !t.completed);
    return tickets.filter((t) => t.completed);
  }, [tickets, filter]);

  return (
    <TicketsContainer>
      <h2>Tickets</h2>

      <div className="filter-row">
        <button
          className={filter === 'all' ? 'active' : ''}
          onClick={() => setFilter('all')}
        >
          All
        </button>
        <button
          className={filter === 'open' ? 'active' : ''}
          onClick={() => setFilter('open')}
        >
          Open
        </button>
        <button
          className={filter === 'completed' ? 'active' : ''}
          onClick={() => setFilter('completed')}
        >
          Completed
        </button>
      </div>

      {/* Add Ticket button stub */}
      <div style={{ marginBottom: '1.25rem' }}>
        <button disabled style={{ opacity: 0.5 }}>
          + Add Ticket (coming soon)
        </button>
      </div>

      {loading && <div>Loading tickets...</div>}
      {error && <div style={{ color: 'red' }}>{error}</div>}

      {filteredTickets.length > 0 ? (
        <ul className="ticket-list">
          {filteredTickets.map((t) => (
            <li key={t.id}>
              <strong>#{t.id}</strong>: {t.description}
              <span className="status">[{t.completed ? 'Completed' : 'Open'}]</span>
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
    </TicketsContainer>
  );
};

export default Tickets;
