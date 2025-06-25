/* Styled Components */
import styled from 'styled-components'

export const TicketDetailsContainer = styled.div`
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
