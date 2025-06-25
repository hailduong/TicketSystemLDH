import React from 'react'
import {AddTicketModalContainer} from './addTicketModal.styled'

export interface IAddTicketModalProps {
  isOpen: boolean
  description: string
  isSaving: boolean
  saveError: string | null
  onClose: () => void
  onDescriptionChange: (value: string) => void
  onSubmit: (e: React.FormEvent) => Promise<void>
}

const MAX_DESCRIPTION_LENGTH = 100

/**
 * Modal component for adding new tickets to the system
 * Supports keyboard navigation and form validation
 */
const AddTicketModal: React.FC<IAddTicketModalProps> = (
  {
    isOpen,
    description,
    isSaving,
    saveError,
    onClose,
    onDescriptionChange,
    onSubmit
  }) => {
  /* Handlers */
  const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.slice(0, MAX_DESCRIPTION_LENGTH)
    onDescriptionChange(value)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape' && !isSaving) {
      onClose()
    }
  }

  /* Render */
  if (!isOpen) return null

  return (
    <AddTicketModalContainer onKeyDown={handleKeyDown}>
      <div className="modal fade show d-block" tabIndex={-1}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <form onSubmit={onSubmit}>
              {/* Header */}
              <div className="modal-header">
                <h5 className="modal-title">Add New Ticket</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={onClose}
                  disabled={isSaving}
                  aria-label="Close"
                />
              </div>

              {/* Body */}
              <div className="modal-body">
                <div className="mb-3">
                  <label htmlFor="description" className="form-label">
                    Description
                    <small className="text-muted ms-2">
                      ({description.length}/{MAX_DESCRIPTION_LENGTH})
                    </small>
                  </label>
                  <input
                    id="description"
                    type="text"
                    className="form-control description-input"
                    value={description}
                    onChange={handleDescriptionChange}
                    disabled={isSaving}
                    required
                    maxLength={MAX_DESCRIPTION_LENGTH}
                    autoFocus
                  />
                </div>
                {saveError && (
                  <div className="alert alert-danger error-message" role="alert">
                    {saveError}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="modal-footer">
                <div className="action-buttons">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={onClose}
                    disabled={isSaving}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={isSaving || !description.trim()}
                  >
                    {isSaving ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm loading-spinner"
                          role="status"
                          aria-hidden="true"
                        />
                        Saving...
                      </>
                    ) : 'Add Ticket'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
      <div className="modal-backdrop fade show"/>
    </AddTicketModalContainer>
  )
}

export default AddTicketModal
