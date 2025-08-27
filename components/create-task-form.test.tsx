import { render, screen, waitFor } from '@testing-library/react'
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

// Mock the task creation action
jest.mock('@/app/(dashboard)/tasks/actions', () => ({
  createTask: jest.fn(),
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
      const form = document.querySelector('form')
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
      const errorMessage = screen.getByText('Error message')
      expect(errorMessage).toBeInTheDocument()
      expect(errorMessage.closest('div')).toHaveClass('text-red-600', 'bg-red-50')
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
      const successMessage = screen.getByText('Success!')
      expect(successMessage).toBeInTheDocument()
      expect(successMessage.closest('div')).toHaveClass('text-green-600', 'bg-green-50')
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
      expect(screen.getByText('Status')).toBeInTheDocument()
      expect(screen.getByText('Priority')).toBeInTheDocument()
      expect(screen.getByText('Assignee')).toBeInTheDocument()
      expect(screen.getByLabelText('Due Date')).toBeInTheDocument()
    })

    it('should have accessible form structure', () => {
      // Arrange & Act
      render(<CreateTaskForm />)
      
      // Assert
      const form = document.querySelector('form')
      expect(form).toBeInTheDocument()
      expect(form?.tagName).toBe('FORM')
    })
  })

  describe('Layout', () => {
    it('should have proper layout classes', () => {
      // Arrange & Act
      render(<CreateTaskForm />)
      
      // Assert
      const form = document.querySelector('form')
      expect(form).toHaveClass('space-y-4')
      
      const submitContainer = screen.getByRole('button').parentElement
      expect(submitContainer).toHaveClass('flex', 'justify-end')
    })

    it('should have grid layout for form sections', () => {
      // Arrange & Act
      render(<CreateTaskForm />)
      
      // Assert
      const form = document.querySelector('form')
      const gridContainers = form?.querySelectorAll('.grid')
      expect(gridContainers?.length).toBeGreaterThan(0)
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
        expect(screen.getByText('Todo')).toBeInTheDocument()
        expect(screen.getByText('Medium')).toBeInTheDocument()
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
      
      // Act - Find status select button and click it
      const statusButton = screen.getByText('Todo').closest('button')
      await user.click(statusButton!)
      await user.click(screen.getByText('In Progress'))
      
      // Assert
      await waitFor(() => {
        expect(screen.getByText('In Progress')).toBeInTheDocument()
      })
    })

    it('should allow selecting priority', async () => {
      // Arrange
      const user = userEvent.setup()
      render(<CreateTaskForm />)
      
      // Act - Find priority select button and click it
      const priorityButton = screen.getByText('Medium').closest('button')
      await user.click(priorityButton!)
      await user.click(screen.getByText('High'))
      
      // Assert
      await waitFor(() => {
        expect(screen.getByText('High')).toBeInTheDocument()
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
      
      // Act - Find the assignee select button
      const assigneeButton = screen.getByText('Select assignee').closest('button')
      await user.click(assigneeButton!)
      await user.click(screen.getByText('John Doe'))
      
      // Assert
      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument()
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
      const errorMessage = screen.getByText('Failed to create task. Please try again.')
      expect(errorMessage).toBeInTheDocument()
      expect(errorMessage.closest('div')).toHaveClass('text-red-600', 'bg-red-50')
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
      const successMessage = screen.getByText('Task created successfully!')
      expect(successMessage).toBeInTheDocument()
      expect(successMessage.closest('div')).toHaveClass('text-green-600', 'bg-green-50')
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
      expect(screen.getByText('Select assignee')).toBeInTheDocument()
    })

    it('should handle users loading error gracefully', async () => {
      // Arrange  
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
      
      // Act
      render(<CreateTaskForm />)
      
      // Simulate the error after render
      mockGetAllUsers.mockRejectedValue(new Error('Failed to load users'))
      
      // Assert
      await waitFor(() => {
        expect(mockGetAllUsers).toHaveBeenCalled()
      })
      
      // Form should still render without crashing
      expect(screen.getByLabelText('Title')).toBeInTheDocument()
      
      // Cleanup
      consoleErrorSpy.mockRestore()
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
      expect(screen.getByText('Status')).toBeInTheDocument()
      expect(screen.getByText('Priority')).toBeInTheDocument() 
      expect(screen.getByText('Assignee')).toBeInTheDocument()
      expect(screen.getByLabelText('Due Date')).toBeInTheDocument()
    })

    it('should have proper form structure', () => {
      // Arrange & Act
      render(<CreateTaskForm />)
      
      // Assert
      const form = document.querySelector('form')
      expect(form).toBeInTheDocument()
      expect(form?.tagName).toBe('FORM')
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
      const form = document.querySelector('form')
      expect(form).toHaveClass('space-y-4')
      
      // Check for grid layout containers
      const gridContainers = form?.querySelectorAll('.grid')
      expect(gridContainers?.length).toBeGreaterThan(0)
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