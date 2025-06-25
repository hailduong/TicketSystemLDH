/* Styles */
import styled from 'styled-components'

export const TicketsContainer = styled.div`

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
export const TicketList = styled.ul.attrs({
  role: 'list',
  'aria-label': 'Tickets list'
})`
  list-style: none;
  padding: 0;
`
export const TicketSkeleton = styled.div`
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
