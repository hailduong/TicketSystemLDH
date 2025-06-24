import React from 'react'

interface AddTicketModalProps {
  isOpen: boolean
  description: string
  isSaving: boolean
  saveError: string | null
  onClose: () => void
  onDescriptionChange: (value: string) => void
  onSubmit: (e: React.FormEvent) => Promise<void>
}

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

  return (
    <>
      <div className="modal fade show d-block" tabIndex={-1}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <form onSubmit={onSubmit}>
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

              <div className="modal-body">
                <div className="mb-3">
                  <label htmlFor="description" className="form-label">
                    Description
                  </label>
                  <input
                    id="description"
                    type="text"
                    className="form-control"
                    value={description}
                    onChange={(e) => onDescriptionChange(e.target.value)}
                    disabled={isSaving}
                    required
                    autoFocus
                  />
                </div>
                {saveError && (
                  <div className="alert alert-danger" role="alert">
                    {saveError}
                  </div>
                )}
              </div>

              <div className="modal-footer">
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
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"/>
                      Saving...
                    </>
                  ) : (
                    'Add Ticket'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <div className="modal-backdrop fade show"/>
    </>
  )
}

export default AddTicketModal
