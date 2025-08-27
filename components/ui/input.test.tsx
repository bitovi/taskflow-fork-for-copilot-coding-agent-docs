import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Input } from './input'

// Test helper to render Input with default props
const renderInput = (props: any = {}) => {
  const defaultProps = {
    ...props,
  }
  return render(<Input {...defaultProps} />)
}

describe('Input Component', () => {
  describe('Rendering', () => {
    it('should render input element', () => {
      // Arrange & Act
      renderInput({ 'data-testid': 'input' })
      
      // Assert
      expect(screen.getByTestId('input')).toBeInTheDocument()
      expect(screen.getByRole('textbox')).toBeInTheDocument()
    })

    it('should apply default styling classes', () => {
      // Arrange & Act
      renderInput({ 'data-testid': 'input' })
      
      // Assert
      const input = screen.getByTestId('input')
      expect(input).toHaveClass(
        'flex',
        'h-10',
        'w-full',
        'rounded-md',
        'border',
        'border-input',
        'bg-background',
        'px-3',
        'py-2'
      )
    })

    it('should apply custom className', () => {
      // Arrange & Act
      renderInput({ className: 'custom-input', 'data-testid': 'input' })
      
      // Assert
      expect(screen.getByTestId('input')).toHaveClass('custom-input')
    })

    it('should forward ref correctly', () => {
      // Arrange
      const ref = { current: null }
      
      // Act
      render(<Input ref={ref} data-testid="input" />)
      
      // Assert
      expect(ref.current).toBeDefined()
      expect(ref.current).toBe(screen.getByTestId('input'))
    })
  })

  describe('Input Types', () => {
    it('should render text input by default', () => {
      // Arrange & Act
      renderInput({ 'data-testid': 'input' })
      
      // Assert
      const input = screen.getByTestId('input')
      // Input without explicit type defaults to text, but may not have type attribute set
      expect(input.type).toBe('text')
    })

    it('should render email input when type is email', () => {
      // Arrange & Act
      renderInput({ type: 'email', 'data-testid': 'input' })
      
      // Assert
      expect(screen.getByTestId('input')).toHaveAttribute('type', 'email')
    })

    it('should render password input when type is password', () => {
      // Arrange & Act
      renderInput({ type: 'password', 'data-testid': 'input' })
      
      // Assert
      expect(screen.getByTestId('input')).toHaveAttribute('type', 'password')
    })

    it('should render number input when type is number', () => {
      // Arrange & Act
      renderInput({ type: 'number', 'data-testid': 'input' })
      
      // Assert
      expect(screen.getByTestId('input')).toHaveAttribute('type', 'number')
    })

    it('should render date input when type is date', () => {
      // Arrange & Act
      renderInput({ type: 'date', 'data-testid': 'input' })
      
      // Assert
      expect(screen.getByTestId('input')).toHaveAttribute('type', 'date')
    })

    it('should render file input when type is file', () => {
      // Arrange & Act
      renderInput({ type: 'file', 'data-testid': 'input' })
      
      // Assert
      expect(screen.getByTestId('input')).toHaveAttribute('type', 'file')
    })
  })

  describe('States', () => {
    it('should be enabled by default', () => {
      // Arrange & Act
      renderInput({ 'data-testid': 'input' })
      
      // Assert
      expect(screen.getByTestId('input')).toBeEnabled()
    })

    it('should be disabled when disabled prop is true', () => {
      // Arrange & Act
      renderInput({ disabled: true, 'data-testid': 'input' })
      
      // Assert
      expect(screen.getByTestId('input')).toBeDisabled()
    })

    it('should apply disabled styling when disabled', () => {
      // Arrange & Act
      renderInput({ disabled: true, 'data-testid': 'input' })
      
      // Assert
      const input = screen.getByTestId('input')
      expect(input).toHaveClass('disabled:cursor-not-allowed', 'disabled:opacity-50')
    })

    it('should be readonly when readOnly prop is true', () => {
      // Arrange & Act
      renderInput({ readOnly: true, 'data-testid': 'input' })
      
      // Assert
      expect(screen.getByTestId('input')).toHaveAttribute('readonly')
    })

    it('should be required when required prop is true', () => {
      // Arrange & Act
      renderInput({ required: true, 'data-testid': 'input' })
      
      // Assert
      expect(screen.getByTestId('input')).toBeRequired()
    })
  })

  describe('Value and Placeholder', () => {
    it('should display placeholder text', () => {
      // Arrange & Act
      renderInput({ placeholder: 'Enter your name', 'data-testid': 'input' })
      
      // Assert
      expect(screen.getByPlaceholderText('Enter your name')).toBeInTheDocument()
    })

    it('should display default value', () => {
      // Arrange & Act
      renderInput({ defaultValue: 'Default text', 'data-testid': 'input' })
      
      // Assert
      expect(screen.getByDisplayValue('Default text')).toBeInTheDocument()
    })

    it('should display controlled value', () => {
      // Arrange & Act
      renderInput({ value: 'Controlled value', 'data-testid': 'input', onChange: jest.fn() })
      
      // Assert
      expect(screen.getByDisplayValue('Controlled value')).toBeInTheDocument()
    })

    it('should apply placeholder styling classes', () => {
      // Arrange & Act
      renderInput({ placeholder: 'Test placeholder', 'data-testid': 'input' })
      
      // Assert
      const input = screen.getByTestId('input')
      expect(input).toHaveClass('placeholder:text-muted-foreground')
    })
  })

  describe('Interactions', () => {
    it('should handle typing', async () => {
      // Arrange
      const user = userEvent.setup()
      renderInput({ 'data-testid': 'input' })
      
      // Act
      await user.type(screen.getByTestId('input'), 'Hello World')
      
      // Assert
      expect(screen.getByDisplayValue('Hello World')).toBeInTheDocument()
    })

    it('should handle onChange events', async () => {
      // Arrange
      const user = userEvent.setup()
      const handleChange = jest.fn()
      renderInput({ onChange: handleChange, 'data-testid': 'input' })
      
      // Act
      await user.type(screen.getByTestId('input'), 'test')
      
      // Assert
      expect(handleChange).toHaveBeenCalledTimes(4) // One for each character
    })

    it('should handle focus events', async () => {
      // Arrange
      const user = userEvent.setup()
      const handleFocus = jest.fn()
      renderInput({ onFocus: handleFocus, 'data-testid': 'input' })
      
      // Act
      await user.click(screen.getByTestId('input'))
      
      // Assert
      expect(handleFocus).toHaveBeenCalledTimes(1)
    })

    it('should handle blur events', async () => {
      // Arrange
      const user = userEvent.setup()
      const handleBlur = jest.fn()
      renderInput({ onBlur: handleBlur, 'data-testid': 'input' })
      
      // Act
      const input = screen.getByTestId('input')
      await user.click(input)
      await user.tab()
      
      // Assert
      expect(handleBlur).toHaveBeenCalledTimes(1)
    })

    it('should not accept input when disabled', async () => {
      // Arrange
      const user = userEvent.setup()
      const handleChange = jest.fn()
      renderInput({ disabled: true, onChange: handleChange, 'data-testid': 'input' })
      
      // Act
      await user.type(screen.getByTestId('input'), 'test')
      
      // Assert
      expect(handleChange).not.toHaveBeenCalled()
    })

    it('should not accept input when readonly', async () => {
      // Arrange
      const user = userEvent.setup()
      renderInput({ readOnly: true, defaultValue: 'readonly', 'data-testid': 'input' })
      
      // Act
      await user.type(screen.getByTestId('input'), 'new text')
      
      // Assert
      expect(screen.getByDisplayValue('readonly')).toBeInTheDocument()
    })

    it('should be focusable via keyboard', () => {
      // Arrange & Act
      renderInput({ 'data-testid': 'input' })
      const input = screen.getByTestId('input')
      input.focus()
      
      // Assert
      expect(input).toHaveFocus()
    })
  })

  describe('Accessibility', () => {
    it('should have textbox role for text inputs', () => {
      // Arrange & Act
      renderInput({ type: 'text' })
      
      // Assert
      expect(screen.getByRole('textbox')).toBeInTheDocument()
    })

    it('should support aria-label', () => {
      // Arrange & Act
      renderInput({ 'aria-label': 'Username input' })
      
      // Assert
      expect(screen.getByLabelText('Username input')).toBeInTheDocument()
    })

    it('should support aria-describedby', () => {
      // Arrange & Act
      render(
        <div>
          <Input aria-describedby="input-help" data-testid="input" />
          <div id="input-help">Enter your email address</div>
        </div>
      )
      
      // Assert
      const input = screen.getByTestId('input')
      expect(input).toHaveAttribute('aria-describedby', 'input-help')
    })

    it('should support form labels', () => {
      // Arrange & Act
      render(
        <div>
          <label htmlFor="username">Username</label>
          <Input id="username" data-testid="input" />
        </div>
      )
      
      // Assert
      expect(screen.getByLabelText('Username')).toBeInTheDocument()
    })

    it('should support aria-invalid for validation', () => {
      // Arrange & Act
      renderInput({ 'aria-invalid': true, 'data-testid': 'input' })
      
      // Assert
      expect(screen.getByTestId('input')).toHaveAttribute('aria-invalid', 'true')
    })

    it('should have proper focus styling', () => {
      // Arrange & Act
      renderInput({ 'data-testid': 'input' })
      
      // Assert
      const input = screen.getByTestId('input')
      expect(input).toHaveClass(
        'focus-visible:outline-none',
        'focus-visible:ring-2',
        'focus-visible:ring-ring',
        'focus-visible:ring-offset-2'
      )
    })
  })

  describe('Form Integration', () => {
    it('should work within a form', () => {
      // Arrange & Act
      render(
        <form data-testid="form">
          <Input name="email" data-testid="input" />
        </form>
      )
      
      // Assert
      const form = screen.getByTestId('form')
      const input = screen.getByTestId('input')
      expect(form).toContainElement(input)
      expect(input).toHaveAttribute('name', 'email')
    })

    it('should support form validation attributes', () => {
      // Arrange & Act
      renderInput({
        required: true,
        minLength: 3,
        maxLength: 50,
        pattern: '[a-z]+',
        'data-testid': 'input'
      })
      
      // Assert
      const input = screen.getByTestId('input')
      expect(input).toBeRequired()
      expect(input).toHaveAttribute('minLength', '3')
      expect(input).toHaveAttribute('maxLength', '50')
      expect(input).toHaveAttribute('pattern', '[a-z]+')
    })

    it('should handle form submission', async () => {
      // Arrange
      const user = userEvent.setup()
      const handleSubmit = jest.fn((e) => e.preventDefault())
      
      render(
        <form onSubmit={handleSubmit}>
          <Input name="test" defaultValue="submit value" />
          <button type="submit">Submit</button>
        </form>
      )
      
      // Act
      await user.click(screen.getByText('Submit'))
      
      // Assert
      expect(handleSubmit).toHaveBeenCalled()
    })
  })

  describe('File Input Specific', () => {
    it('should apply file input styling', () => {
      // Arrange & Act
      renderInput({ type: 'file', 'data-testid': 'input' })
      
      // Assert
      const input = screen.getByTestId('input')
      expect(input).toHaveClass(
        'file:border-0',
        'file:bg-transparent',
        'file:text-sm',
        'file:font-medium',
        'file:text-foreground'
      )
    })

    it('should support file input attributes', () => {
      // Arrange & Act
      renderInput({
        type: 'file',
        accept: '.jpg,.png',
        multiple: true,
        'data-testid': 'input'
      })
      
      // Assert
      const input = screen.getByTestId('input')
      expect(input).toHaveAttribute('accept', '.jpg,.png')
      expect(input).toHaveAttribute('multiple')
    })
  })

  describe('Edge Cases', () => {
    it('should handle empty value', () => {
      // Arrange & Act
      renderInput({ value: '', onChange: jest.fn(), 'data-testid': 'input' })
      
      // Assert
      expect(screen.getByTestId('input')).toHaveValue('')
    })

    it('should handle null/undefined values gracefully', () => {
      // Arrange & Act
      renderInput({ value: undefined, 'data-testid': 'input' })
      
      // Assert
      expect(screen.getByTestId('input')).toBeInTheDocument()
    })

    it('should merge multiple classNames correctly', () => {
      // Arrange & Act
      renderInput({ className: 'custom-1 custom-2', 'data-testid': 'input' })
      
      // Assert
      const input = screen.getByTestId('input')
      expect(input).toHaveClass('custom-1', 'custom-2', 'flex', 'h-10')
    })

    it('should handle very long values', async () => {
      // Arrange
      const user = userEvent.setup()
      const longValue = 'a'.repeat(1000)
      renderInput({ 'data-testid': 'input' })
      
      // Act
      await user.type(screen.getByTestId('input'), longValue)
      
      // Assert
      expect(screen.getByDisplayValue(longValue)).toBeInTheDocument()
    })

    it('should handle special characters', async () => {
      // Arrange
      const user = userEvent.setup()
      const specialChars = '!@#$%^&*()_+-='
      renderInput({ 'data-testid': 'input' })
      
      // Act
      await user.type(screen.getByTestId('input'), specialChars)
      
      // Assert
      expect(screen.getByDisplayValue(specialChars)).toBeInTheDocument()
    })
  })

  describe('Number Input Specific', () => {
    it('should handle numeric values', async () => {
      // Arrange
      const user = userEvent.setup()
      renderInput({ type: 'number', 'data-testid': 'input' })
      
      // Act
      await user.type(screen.getByTestId('input'), '123.45')
      
      // Assert
      expect(screen.getByDisplayValue('123.45')).toBeInTheDocument()
    })

    it('should support min and max attributes', () => {
      // Arrange & Act
      renderInput({
        type: 'number',
        min: 0,
        max: 100,
        'data-testid': 'input'
      })
      
      // Assert
      const input = screen.getByTestId('input')
      expect(input).toHaveAttribute('min', '0')
      expect(input).toHaveAttribute('max', '100')
    })

    it('should support step attribute', () => {
      // Arrange & Act
      renderInput({
        type: 'number',
        step: 0.1,
        'data-testid': 'input'
      })
      
      // Assert
      expect(screen.getByTestId('input')).toHaveAttribute('step', '0.1')
    })
  })
})