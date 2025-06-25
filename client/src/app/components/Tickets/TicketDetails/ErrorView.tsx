import React from 'react'

export const ErrorView: React.FC<{ error: string }> = ({error}) => (
  <div className="container py-4 bg-light rounded-3" data-testid="error-view">
    <div className="alert alert-danger" role="alert">
      Error: {error}
    </div>
  </div>
)
