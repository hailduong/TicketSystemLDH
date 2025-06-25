/* Error Boundary */
import React, {PropsWithChildren} from 'react'
import {ErrorBoundary} from 'react-error-boundary'

export const TicketErrorBoundary: React.FC<PropsWithChildren> = ({children}) => (
  <ErrorBoundary
    FallbackComponent={({error}) => (
      <div className="alert alert-danger" role="alert">
        <h4>Error loading tickets</h4>
        <pre>{error.message}</pre>
      </div>
    )}
  >
    {children}
  </ErrorBoundary>
)
