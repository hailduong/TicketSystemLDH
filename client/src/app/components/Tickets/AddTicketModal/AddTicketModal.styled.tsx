import styled from 'styled-components'

export const AddTicketModalContainer = styled.div`
  .modal-content {
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  }

  .modal-header {
    border-bottom: 1px solid #e9ecef;
  }

  .modal-footer {
    border-top: 1px solid #e9ecef;
  }

  .description-input {
    transition: box-shadow 0.15s ease-in-out;

    &:focus {
      box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
    }
  }

  .error-message {
    margin-top: 0.5rem;
    font-size: 0.875rem;
  }

  .action-buttons {
    display: flex;
    gap: 0.5rem;
  }

  .loading-spinner {
    margin-right: 0.5rem;
  }
`
