import React from 'react'
import {render, screen, fireEvent} from '@testing-library/react'
import '@testing-library/jest-dom'
import AddTicketModal, {IAddTicketModalProps} from './index'

const defaultProps: IAddTicketModalProps = {
  isOpen: true,
  description: '',
  isSaving: false,
  saveError: null,
  onClose: jest.fn(),
  onDescriptionChange: jest.fn(),
  onSubmit: jest.fn()
}

describe('AddTicketModal Component', () => {
  test('renders modal when isOpen is true', () => {
    render(<AddTicketModal {...defaultProps} />)
    expect(screen.getByText('Add New Ticket')).toBeInTheDocument()
  })

  test('does not render modal when isOpen is false', () => {
    render(<AddTicketModal {...defaultProps} isOpen={false}/>)
    expect(screen.queryByText('Add New Ticket')).not.toBeInTheDocument()
  })

  test('calls onClose when close button is clicked', () => {
    render(<AddTicketModal {...defaultProps} />)
    const closeButton = screen.getByLabelText('Close')
    fireEvent.click(closeButton)
    expect(defaultProps.onClose).toHaveBeenCalled()
  })

  test('displays error message when saveError is provided', () => {
    render(<AddTicketModal {...defaultProps} saveError="Error occurred"/>)
    expect(screen.getByText('Error occurred')).toBeInTheDocument()
  })
})
