import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CreateTaskForm } from './create-task-form'

// Mock the react hooks and server actions
const mockUseActionState = jest.fn()
const mockUseFormStatus = jest.fn()
const mockGetAllUsers = jest.fn()

jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useActionState: () => mockUseActionState(),
}))

jest.mock('react-dom', () => ({
  ...jest.requireActual('react-dom'),
  useFormStatus: () => mockUseFormStatus(),
}))

jest.mock('@/app/login/actions', () => ({
  getAllUsers: () => mockGetAllUsers(),
}))

describe('CreateTaskForm Component', () => {
  beforeEach(() => {
    // Setup default mocks
    mockUseActionState.mockReturnValue([
      { error: null, success: false, message: '' },
      jest.fn()
    ])
    mockUseFormStatus.mockReturnValue({ pending: false })
    mockGetAllUsers.mockResolvedValue([])
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('Basic Rendering', () => {
    it('should render form elements', () => {
      // Arrange & Act
      render(<CreateTaskForm />)
      
      // Assert
      expect(screen.getByLabelText('Title')).toBeInTheDocument()
      expect(screen.getByLabelText('Description')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /create task/i })).toBeInTheDocument()
    })

    it('should have required title field', () => {
      // Arrange & Act
      render(<CreateTaskForm />)
      
      // Assert
      expect(screen.getByLabelText('Title')).toBeRequired()
    })

    it('should render form with proper structure', () => {
      // Arrange & Act
      render(<CreateTaskForm />)
      
      // Assert
      const form = screen.getByRole('form')
      expect(form).toBeInTheDocument()
      expect(form).toHaveClass('space-y-4')
    })
  })

  describe('Form Interactions', () => {
    it('should allow typing in title field', async () => {
      // Arrange
      const user = userEvent.setup()
      render(<CreateTaskForm />)
      
      // Act
      const titleInput = screen.getByLabelText('Title')
      await user.type(titleInput, 'New Task')
      
      // Assert
      expect(titleInput).toHaveValue('New Task')
    })

    it('should allow typing in description field', async () => {
      // Arrange
      const user = userEvent.setup()
      render(<CreateTaskForm />)
      
      // Act
      const descInput = screen.getByLabelText('Description')
      await user.type(descInput, 'Task description')
      
      // Assert
      expect(descInput).toHaveValue('Task description')
    })

    it('should allow setting due date', async () => {
      // Arrange
      const user = userEvent.setup()
      render(<CreateTaskForm />)
      
      // Act
      const dueDateInput = screen.getByLabelText('Due Date')
      await user.type(dueDateInput, '2024-12-31')
      
      // Assert
      expect(dueDateInput).toHaveValue('2024-12-31')
    })
  })

  describe('Submit Button States', () => {
    it('should show "Create Task" when not pending', () => {
      // Arrange
      mockUseFormStatus.mockReturnValue({ pending: false })
      
      // Act
      render(<CreateTaskForm />)
      
      // Assert
      const button = screen.getByRole('button')
      expect(button).toHaveTextContent('Create Task')
      expect(button).toBeEnabled()
    })

    it('should show "Creating..." when pending', () => {
      // Arrange
      mockUseFormStatus.mockReturnValue({ pending: true })
      
      // Act
      render(<CreateTaskForm />)
      
      // Assert
      const button = screen.getByRole('button')
      expect(button).toHaveTextContent('Creating...')
      expect(button).toBeDisabled()
    })
  })

  describe('Error and Success States', () => {
    it('should display error message', () => {
      // Arrange
      mockUseActionState.mockReturnValue([
        { error: 'Something went wrong', success: false, message: '' },
        jest.fn()
      ])
      
      // Act
      render(<CreateTaskForm />)
      
      // Assert
      expect(screen.getByText('Something went wrong')).toBeInTheDocument()
    })

    it('should display success message', () => {
      // Arrange
      mockUseActionState.mockReturnValue([
        { error: null, success: true, message: 'Task created!' },
        jest.fn()
      ])
      
      // Act
      render(<CreateTaskForm />)
      
      // Assert
      expect(screen.getByText('Task created!')).toBeInTheDocument()
    })

    it('should apply correct error styling', () => {
      // Arrange
      mockUseActionState.mockReturnValue([
        { error: 'Error message', success: false, message: '' },
        jest.fn()
      ])
      
      // Act
      render(<CreateTaskForm />)
      
      // Assert
      const errorDiv = screen.getByText('Error message').parentElement
      expect(errorDiv).toHaveClass('text-red-600', 'bg-red-50')
    })

    it('should apply correct success styling', () => {
      // Arrange
      mockUseActionState.mockReturnValue([
        { error: null, success: true, message: 'Success!' },
        jest.fn()
      ])
      
      // Act
      render(<CreateTaskForm />)
      
      // Assert
      const successDiv = screen.getByText('Success!').parentElement
      expect(successDiv).toHaveClass('text-green-600', 'bg-green-50')
    })
  })

  describe('Callback Handling', () => {
    it('should call onFinish when successful', () => {
      // Arrange
      const mockOnFinish = jest.fn()
      mockUseActionState.mockReturnValue([
        { error: null, success: true, message: 'Done!' },
        jest.fn()
      ])
      
      // Act
      render(<CreateTaskForm onFinish={mockOnFinish} />)
      
      // Assert
      expect(mockOnFinish).toHaveBeenCalled()
    })

    it('should not call onFinish when error occurs', () => {
      // Arrange
      const mockOnFinish = jest.fn()
      mockUseActionState.mockReturnValue([
        { error: 'Failed', success: false, message: '' },
        jest.fn()
      ])
      
      // Act
      render(<CreateTaskForm onFinish={mockOnFinish} />)
      
      // Assert
      expect(mockOnFinish).not.toHaveBeenCalled()
    })

    it('should work without onFinish callback', () => {
      // Arrange
      mockUseActionState.mockReturnValue([
        { error: null, success: true, message: 'Success!' },
        jest.fn()
      ])
      
      // Act & Assert
      expect(() => render(<CreateTaskForm />)).not.toThrow()
    })
  })

  describe('Accessibility', () => {
    it('should have proper form labels', () => {
      // Arrange & Act
      render(<CreateTaskForm />)
      
      // Assert
      expect(screen.getByLabelText('Title')).toBeInTheDocument()
      expect(screen.getByLabelText('Description')).toBeInTheDocument()
      expect(screen.getByLabelText('Status')).toBeInTheDocument()
      expect(screen.getByLabelText('Priority')).toBeInTheDocument()
      expect(screen.getByLabelText('Assignee')).toBeInTheDocument()
      expect(screen.getByLabelText('Due Date')).toBeInTheDocument()
    })

    it('should have accessible form structure', () => {
      // Arrange & Act
      render(<CreateTaskForm />)
      
      // Assert
      const form = screen.getByRole('form')
      expect(form).toBeInTheDocument()
      expect(form.tagName).toBe('FORM')
    })
  })

  describe('Layout', () => {
    it('should have proper layout classes', () => {
      // Arrange & Act
      render(<CreateTaskForm />)
      
      // Assert
      const form = screen.getByRole('form')
      expect(form).toHaveClass('space-y-4')
      
      const submitContainer = screen.getByRole('button').parentElement
      expect(submitContainer).toHaveClass('flex', 'justify-end')
    })

    it('should have grid layout for form sections', () => {
      // Arrange & Act
      render(<CreateTaskForm />)
      
      // Assert
      const form = screen.getByRole('form')
      const gridContainers = form.querySelectorAll('.grid.grid-cols-2.gap-4')
      expect(gridContainers.length).toBeGreaterThan(0)
    })
  })
})

describe('CreateTaskForm Component', () => {
  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks()
    
    // Default mock implementations
    mockUseActionState.mockReturnValue([
      { error: null, success: false, message: '' },
      jest.fn()
    ])
    
    mockUseFormStatus.mockReturnValue({ pending: false })
    
    mockGetAllUsers.mockResolvedValue([
      { id: 1, name: 'John Doe' },
      { id: 2, name: 'Jane Smith' }
    ])
  })

  describe('Rendering', () => {
    it('should render all form fields', async () => {
      // Arrange & Act
      render(<CreateTaskForm />)
      
      // Assert
      expect(screen.getByLabelText('Title')).toBeInTheDocument()
      expect(screen.getByLabelText('Description')).toBeInTheDocument()
      expect(screen.getByLabelText('Status')).toBeInTheDocument()
      expect(screen.getByLabelText('Priority')).toBeInTheDocument()
      expect(screen.getByLabelText('Assignee')).toBeInTheDocument()
      expect(screen.getByLabelText('Due Date')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Create Task' })).toBeInTheDocument()
    })

    it('should have required title field', () => {
      // Arrange & Act
      render(<CreateTaskForm />)
      
      // Assert
      expect(screen.getByLabelText('Title')).toBeRequired()
    })

    it('should have default values for status and priority', async () => {
      // Arrange & Act
      render(<CreateTaskForm />)
      
      // Assert
      await waitFor(() => {
        const statusTrigger = screen.getByRole('combobox', { name: /status/i })
        const priorityTrigger = screen.getByRole('combobox', { name: /priority/i })
        
        expect(statusTrigger).toHaveTextContent('Todo')
        expect(priorityTrigger).toHaveTextContent('Medium')
      })
    })

    it('should load and display users in assignee dropdown', async () => {
      // Arrange & Act
      render(<CreateTaskForm />)
      
      // Assert
      await waitFor(() => {
        expect(mockGetAllUsers).toHaveBeenCalledTimes(1)
      })
    })
  })

  describe('Form Interactions', () => {
    it('should allow typing in title field', async () => {
      // Arrange
      const user = userEvent.setup()
      render(<CreateTaskForm />)
      
      // Act
      const titleInput = screen.getByLabelText('Title')
      await user.type(titleInput, 'New Task Title')
      
      // Assert
      expect(titleInput).toHaveValue('New Task Title')
    })

    it('should allow typing in description field', async () => {
      // Arrange
      const user = userEvent.setup()
      render(<CreateTaskForm />)
      
      // Act
      const descriptionInput = screen.getByLabelText('Description')
      await user.type(descriptionInput, 'Task description here')
      
      // Assert
      expect(descriptionInput).toHaveValue('Task description here')
    })

    it('should allow selecting status', async () => {
      // Arrange
      const user = userEvent.setup()
      render(<CreateTaskForm />)
      
      // Act
      await user.click(screen.getByRole('combobox', { name: /status/i }))
      await user.click(screen.getByText('In Progress'))
      
      // Assert
      await waitFor(() => {
        expect(screen.getByRole('combobox', { name: /status/i })).toHaveTextContent('In Progress')
      })
    })

    it('should allow selecting priority', async () => {
      // Arrange
      const user = userEvent.setup()
      render(<CreateTaskForm />)
      
      // Act
      await user.click(screen.getByRole('combobox', { name: /priority/i }))
      await user.click(screen.getByText('High'))
      
      // Assert
      await waitFor(() => {
        expect(screen.getByRole('combobox', { name: /priority/i })).toHaveTextContent('High')
      })
    })

    it('should allow selecting assignee from loaded users', async () => {
      // Arrange
      const user = userEvent.setup()
      render(<CreateTaskForm />)
      
      // Wait for users to load
      await waitFor(() => {
        expect(mockGetAllUsers).toHaveBeenCalled()
      })
      
      // Act
      await user.click(screen.getByRole('combobox', { name: /assignee/i }))
      await user.click(screen.getByText('John Doe'))
      
      // Assert
      await waitFor(() => {
        expect(screen.getByRole('combobox', { name: /assignee/i })).toHaveTextContent('John Doe')
      })
    })

    it('should allow setting due date', async () => {
      // Arrange
      const user = userEvent.setup()
      render(<CreateTaskForm />)
      
      // Act
      const dueDateInput = screen.getByLabelText('Due Date')
      await user.type(dueDateInput, '2024-12-31')
      
      // Assert
      expect(dueDateInput).toHaveValue('2024-12-31')
    })
  })

  describe('Form Submission', () => {
    it('should call createTask when form is submitted with valid data', async () => {
      // Arrange
      const user = userEvent.setup()
      const mockFormAction = jest.fn()
      mockUseActionState.mockReturnValue([
        { error: null, success: false, message: '' },
        mockFormAction
      ])
      
      render(<CreateTaskForm />)
      
      // Act
      await user.type(screen.getByLabelText('Title'), 'Test Task')
      await user.type(screen.getByLabelText('Description'), 'Test Description')
      await user.click(screen.getByRole('button', { name: 'Create Task' }))
      
      // Assert
      expect(mockFormAction).toHaveBeenCalled()
    })

    it('should disable submit button when form is pending', () => {
      // Arrange
      mockUseFormStatus.mockReturnValue({ pending: true })
      
      // Act
      render(<CreateTaskForm />)
      
      // Assert
      const submitButton = screen.getByRole('button')
      expect(submitButton).toBeDisabled()
      expect(submitButton).toHaveTextContent('Creating...')
    })

    it('should show enabled submit button when form is not pending', () => {
      // Arrange
      mockUseFormStatus.mockReturnValue({ pending: false })
      
      // Act
      render(<CreateTaskForm />)
      
      // Assert
      const submitButton = screen.getByRole('button')
      expect(submitButton).toBeEnabled()
      expect(submitButton).toHaveTextContent('Create Task')
    })
  })

  describe('Error Handling', () => {
    it('should display error message when form submission fails', () => {
      // Arrange
      const errorState = {
        error: 'Failed to create task. Please try again.',
        success: false,
        message: ''
      }
      mockUseActionState.mockReturnValue([errorState, jest.fn()])
      
      // Act
      render(<CreateTaskForm />)
      
      // Assert
      expect(screen.getByText('Failed to create task. Please try again.')).toBeInTheDocument()
      const errorDiv = screen.getByText('Failed to create task. Please try again.').parentElement
      expect(errorDiv).toHaveClass('text-red-600', 'bg-red-50')
    })

    it('should display success message when task is created successfully', () => {
      // Arrange
      const successState = {
        error: null,
        success: true,
        message: 'Task created successfully!'
      }
      mockUseActionState.mockReturnValue([successState, jest.fn()])
      
      // Act
      render(<CreateTaskForm />)
      
      // Assert
      expect(screen.getByText('Task created successfully!')).toBeInTheDocument()
      const successDiv = screen.getByText('Task created successfully!').parentElement
      expect(successDiv).toHaveClass('text-green-600', 'bg-green-50')
    })

    it('should handle empty users list gracefully', async () => {
      // Arrange
      mockGetAllUsers.mockResolvedValue([])
      
      // Act
      render(<CreateTaskForm />)
      
      // Assert
      await waitFor(() => {
        expect(mockGetAllUsers).toHaveBeenCalled()
      })
      
      // Assignee dropdown should still be rendered but empty
      expect(screen.getByRole('combobox', { name: /assignee/i })).toBeInTheDocument()
    })

    it('should handle users loading error gracefully', async () => {
      // Arrange
      mockGetAllUsers.mockRejectedValue(new Error('Failed to load users'))
      
      // Act
      render(<CreateTaskForm />)
      
      // Assert
      await waitFor(() => {
        expect(mockGetAllUsers).toHaveBeenCalled()
      })
      
      // Form should still render without crashing
      expect(screen.getByLabelText('Title')).toBeInTheDocument()
    })
  })

  describe('Callback Handling', () => {
    it('should call onFinish callback when task is created successfully', () => {
      // Arrange
      const mockOnFinish = jest.fn()
      const successState = {
        error: null,
        success: true,
        message: 'Task created successfully!'
      }
      mockUseActionState.mockReturnValue([successState, jest.fn()])
      
      // Act
      render(<CreateTaskForm onFinish={mockOnFinish} />)
      
      // Assert
      expect(mockOnFinish).toHaveBeenCalled()
    })

    it('should not call onFinish callback when task creation fails', () => {
      // Arrange
      const mockOnFinish = jest.fn()
      const errorState = {
        error: 'Creation failed',
        success: false,
        message: ''
      }
      mockUseActionState.mockReturnValue([errorState, jest.fn()])
      
      // Act
      render(<CreateTaskForm onFinish={mockOnFinish} />)
      
      // Assert
      expect(mockOnFinish).not.toHaveBeenCalled()
    })

    it('should work without onFinish callback', () => {
      // Arrange
      const successState = {
        error: null,
        success: true,
        message: 'Task created successfully!'
      }
      mockUseActionState.mockReturnValue([successState, jest.fn()])
      
      // Act & Assert - Should not throw error
      expect(() => render(<CreateTaskForm />)).not.toThrow()
    })
  })

  describe('Accessibility', () => {
    it('should have proper labels for all form fields', () => {
      // Arrange & Act
      render(<CreateTaskForm />)
      
      // Assert
      expect(screen.getByLabelText('Title')).toBeInTheDocument()
      expect(screen.getByLabelText('Description')).toBeInTheDocument()
      expect(screen.getByLabelText('Status')).toBeInTheDocument()
      expect(screen.getByLabelText('Priority')).toBeInTheDocument()
      expect(screen.getByLabelText('Assignee')).toBeInTheDocument()
      expect(screen.getByLabelText('Due Date')).toBeInTheDocument()
    })

    it('should have proper form structure', () => {
      // Arrange & Act
      render(<CreateTaskForm />)
      
      // Assert
      const form = screen.getByRole('form')
      expect(form).toBeInTheDocument()
      expect(form.tagName).toBe('FORM')
    })

    it('should have accessible error messages', () => {
      // Arrange
      const errorState = {
        error: 'Validation failed',
        success: false,
        message: ''
      }
      mockUseActionState.mockReturnValue([errorState, jest.fn()])
      
      // Act
      render(<CreateTaskForm />)
      
      // Assert
      const errorMessage = screen.getByText('Validation failed')
      expect(errorMessage).toBeInTheDocument()
      expect(errorMessage).toHaveClass('text-red-600')
    })

    it('should have accessible success messages', () => {
      // Arrange
      const successState = {
        error: null,
        success: true,
        message: 'Success!'
      }
      mockUseActionState.mockReturnValue([successState, jest.fn()])
      
      // Act
      render(<CreateTaskForm />)
      
      // Assert
      const successMessage = screen.getByText('Success!')
      expect(successMessage).toBeInTheDocument()
      expect(successMessage).toHaveClass('text-green-600')
    })
  })

  describe('Form Layout', () => {
    it('should have proper grid layout for form fields', () => {
      // Arrange & Act
      render(<CreateTaskForm />)
      
      // Assert
      const form = screen.getByRole('form')
      expect(form).toHaveClass('space-y-4')
      
      // Check for grid layout containers
      const gridContainers = form.querySelectorAll('.grid.grid-cols-2.gap-4')
      expect(gridContainers).toHaveLength(2) // One for status/priority, one for assignee/due date
    })

    it('should have submit button at the end', () => {
      // Arrange & Act
      render(<CreateTaskForm />)
      
      // Assert
      const submitButtonContainer = screen.getByRole('button', { name: /create task/i }).parentElement
      expect(submitButtonContainer).toHaveClass('flex', 'justify-end')
    })
  })
})