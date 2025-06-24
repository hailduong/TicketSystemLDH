// AddTicketModal.tsx
/* Common */
import React from 'react'
import styled from 'styled-components'

/* Types */
interface AddTicketModalProps {
  isOpen: boolean
  description: string
  isSaving: boolean
  saveError: string | null
  onClose: () => void
  onDescriptionChange: (value: string) => void
  onSubmit: (e: React.FormEvent) => Promise<void>
}

/* Styles */
const ModalOverlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.3);
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
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
`

const AddTicketModal: React.FC<AddTicketModalProps> = (
  {
    isOpen,
    description,
    isSaving,
    saveError,
    onClose,
    onDescriptionChange,
    onSubmit
  }) => {
  if (!isOpen) return null

  /* Render */
  return (
    <ModalOverlay>
      <ModalForm onSubmit={onSubmit}>
        <h3>Add New Ticket</h3>
        <div style={{marginBottom: '0.75rem'}}>
          <label htmlFor="description">Description</label>
          <input
            id="description"
            type="text"
            value={description}
            onChange={(e) => onDescriptionChange(e.target.value)}
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
            onClick={onClose}
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
  )
}

export default AddTicketModal
