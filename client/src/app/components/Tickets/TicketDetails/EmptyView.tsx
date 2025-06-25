import React from 'react'

export const EmptyView: React.FC = () => (
  <div className="container py-4 bg-light rounded-3" data-testid="empty-view">
    <div className="alert alert-warning" role="alert">
      No ticket found.
    </div>
  </div>
)
