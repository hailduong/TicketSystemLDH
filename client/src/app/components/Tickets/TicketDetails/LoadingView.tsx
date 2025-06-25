/* Components */
import React from 'react'

export const LoadingView: React.FC = () => (
  <div className="container py-4 bg-light rounded-3" data-testid="loading-view">
    <div className="card rounded shadow-sm">
      <div className="card-body text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading ticket details...</span>
        </div>
      </div>
    </div>
  </div>
)
