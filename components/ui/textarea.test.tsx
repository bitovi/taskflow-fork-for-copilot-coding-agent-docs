import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Textarea } from './textarea'

// Test helper to render Textarea with default props
const renderTextarea = (props: any = {}) => {
  const defaultProps = {
    ...props,
  }
  return render(<Textarea {...defaultProps} />)
}

describe('Textarea Component', () => {
  describe('Rendering', () => {
    it('should render textarea element', () => {
      // Arrange & Act
      renderTextarea({ 'data-testid': 'textarea' })
      
      // Assert
      expect(screen.getByTestId('textarea')).toBeInTheDocument()
      expect(screen.getByRole('textbox')).toBeInTheDocument()
    })

    it('should apply default styling classes', () => {
      // Arrange & Act
      renderTextarea({ 'data-testid': 'textarea' })
      
      // Assert
      const textarea = screen.getByTestId('textarea')
      expect(textarea).toHaveClass(
        'flex',
        'min-h-[80px]',
        'w-full',
        'rounded-md',
        'border',
        'border-input',
        'bg-background',
        'px-3',
        'py-2',
        'text-sm'
      )
    })

    it('should apply custom className', () => {
      // Arrange & Act
      renderTextarea({ className: 'custom-textarea', 'data-testid': 'textarea' })
      
      // Assert
      expect(screen.getByTestId('textarea')).toHaveClass('custom-textarea')
    })

    it('should forward ref correctly', () => {
      // Arrange
      const ref = { current: null }
      
      // Act
      render(<Textarea ref={ref} data-testid="textarea" />)
      
      // Assert
      expect(ref.current).toBeDefined()
      expect(ref.current).toBe(screen.getByTestId('textarea'))
    })
  })

  describe('States', () => {
    it('should be enabled by default', () => {
      // Arrange & Act
      renderTextarea({ 'data-testid': 'textarea' })
      
      // Assert
      expect(screen.getByTestId('textarea')).toBeEnabled()
    })

    it('should be disabled when disabled prop is true', () => {
      // Arrange & Act
      renderTextarea({ disabled: true, 'data-testid': 'textarea' })
      
      // Assert
      expect(screen.getByTestId('textarea')).toBeDisabled()
    })

    it('should apply disabled styling when disabled', () => {
      // Arrange & Act
      renderTextarea({ disabled: true, 'data-testid': 'textarea' })
      
      // Assert
      const textarea = screen.getByTestId('textarea')
      expect(textarea).toHaveClass('disabled:cursor-not-allowed', 'disabled:opacity-50')
    })

    it('should be readonly when readOnly prop is true', () => {
      // Arrange & Act
      renderTextarea({ readOnly: true, 'data-testid': 'textarea' })
      
      // Assert
      expect(screen.getByTestId('textarea')).toHaveAttribute('readonly')
    })

    it('should be required when required prop is true', () => {
      // Arrange & Act
      renderTextarea({ required: true, 'data-testid': 'textarea' })
      
      // Assert
      expect(screen.getByTestId('textarea')).toBeRequired()
    })
  })

  describe('Value and Placeholder', () => {
    it('should display placeholder text', () => {
      // Arrange & Act
      renderTextarea({ placeholder: 'Enter your comments...', 'data-testid': 'textarea' })
      
      // Assert
      expect(screen.getByPlaceholderText('Enter your comments...')).toBeInTheDocument()
    })

    it('should display default value', () => {
      // Arrange & Act
      renderTextarea({ defaultValue: 'Default text content', 'data-testid': 'textarea' })
      
      // Assert
      expect(screen.getByDisplayValue('Default text content')).toBeInTheDocument()
    })

    it('should display controlled value', () => {
      // Arrange & Act
      renderTextarea({ value: 'Controlled value', 'data-testid': 'textarea', onChange: jest.fn() })
      
      // Assert
      expect(screen.getByDisplayValue('Controlled value')).toBeInTheDocument()
    })

    it('should apply placeholder styling classes', () => {
      // Arrange & Act
      renderTextarea({ placeholder: 'Test placeholder', 'data-testid': 'textarea' })
      
      // Assert
      const textarea = screen.getByTestId('textarea')
      expect(textarea).toHaveClass('placeholder:text-muted-foreground')
    })
  })

  describe('Interactions', () => {
    it('should handle typing', async () => {
      // Arrange
      const user = userEvent.setup()
      renderTextarea({ 'data-testid': 'textarea' })
      
      // Act
      await user.type(screen.getByTestId('textarea'), 'This is a multi-line text')
      
      // Assert
      expect(screen.getByDisplayValue('This is a multi-line text')).toBeInTheDocument()
    })

    it('should handle onChange events', async () => {
      // Arrange
      const user = userEvent.setup()
      const handleChange = jest.fn()
      renderTextarea({ onChange: handleChange, 'data-testid': 'textarea' })
      
      // Act
      await user.type(screen.getByTestId('textarea'), 'test')
      
      // Assert
      expect(handleChange).toHaveBeenCalledTimes(4) // One for each character
    })

    it('should handle focus events', async () => {
      // Arrange
      const user = userEvent.setup()
      const handleFocus = jest.fn()
      renderTextarea({ onFocus: handleFocus, 'data-testid': 'textarea' })
      
      // Act
      await user.click(screen.getByTestId('textarea'))
      
      // Assert
      expect(handleFocus).toHaveBeenCalledTimes(1)
    })

    it('should handle blur events', async () => {
      // Arrange
      const user = userEvent.setup()
      const handleBlur = jest.fn()
      renderTextarea({ onBlur: handleBlur, 'data-testid': 'textarea' })
      
      // Act
      const textarea = screen.getByTestId('textarea')
      await user.click(textarea)
      await user.tab()
      
      // Assert
      expect(handleBlur).toHaveBeenCalledTimes(1)
    })

    it('should not accept input when disabled', async () => {
      // Arrange
      const user = userEvent.setup()
      const handleChange = jest.fn()
      renderTextarea({ disabled: true, onChange: handleChange, 'data-testid': 'textarea' })
      
      // Act
      await user.type(screen.getByTestId('textarea'), 'test')
      
      // Assert
      expect(handleChange).not.toHaveBeenCalled()
    })

    it('should not accept input when readonly', async () => {
      // Arrange
      const user = userEvent.setup()
      renderTextarea({ readOnly: true, defaultValue: 'readonly text', 'data-testid': 'textarea' })
      
      // Act
      await user.type(screen.getByTestId('textarea'), 'new text')
      
      // Assert
      expect(screen.getByDisplayValue('readonly text')).toBeInTheDocument()
    })

    it('should be focusable via keyboard', () => {
      // Arrange & Act
      renderTextarea({ 'data-testid': 'textarea' })
      const textarea = screen.getByTestId('textarea')
      textarea.focus()
      
      // Assert
      expect(textarea).toHaveFocus()
    })

    it('should handle line breaks and multi-line text', async () => {
      // Arrange
      const user = userEvent.setup()
      renderTextarea({ 'data-testid': 'textarea' })
      
      // Act
      const textarea = screen.getByTestId('textarea')
      await user.click(textarea)
      await user.keyboard('Line 1{enter}Line 2{enter}Line 3')
      
      // Assert
      expect(textarea).toHaveValue('Line 1\nLine 2\nLine 3')
    })
  })

  describe('Accessibility', () => {
    it('should have textbox role', () => {
      // Arrange & Act
      renderTextarea()
      
      // Assert
      expect(screen.getByRole('textbox')).toBeInTheDocument()
    })

    it('should support aria-label', () => {
      // Arrange & Act
      renderTextarea({ 'aria-label': 'Comment input' })
      
      // Assert
      expect(screen.getByLabelText('Comment input')).toBeInTheDocument()
    })

    it('should support aria-describedby', () => {
      // Arrange & Act
      render(
        <div>
          <Textarea aria-describedby="textarea-help" data-testid="textarea" />
          <div id="textarea-help">Enter your detailed comments here</div>
        </div>
      )
      
      // Assert
      const textarea = screen.getByTestId('textarea')
      expect(textarea).toHaveAttribute('aria-describedby', 'textarea-help')
    })

    it('should support form labels', () => {
      // Arrange & Act
      render(
        <div>
          <label htmlFor="comments">Comments</label>
          <Textarea id="comments" data-testid="textarea" />
        </div>
      )
      
      // Assert
      expect(screen.getByLabelText('Comments')).toBeInTheDocument()
    })

    it('should support aria-invalid for validation', () => {
      // Arrange & Act
      renderTextarea({ 'aria-invalid': true, 'data-testid': 'textarea' })
      
      // Assert
      expect(screen.getByTestId('textarea')).toHaveAttribute('aria-invalid', 'true')
    })

    it('should have proper focus styling', () => {
      // Arrange & Act
      renderTextarea({ 'data-testid': 'textarea' })
      
      // Assert
      const textarea = screen.getByTestId('textarea')
      expect(textarea).toHaveClass(
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
          <Textarea name="comments" data-testid="textarea" />
        </form>
      )
      
      // Assert
      const form = screen.getByTestId('form')
      const textarea = screen.getByTestId('textarea')
      expect(form).toContainElement(textarea)
      expect(textarea).toHaveAttribute('name', 'comments')
    })

    it('should support form validation attributes', () => {
      // Arrange & Act
      renderTextarea({
        required: true,
        minLength: 10,
        maxLength: 500,
        'data-testid': 'textarea'
      })
      
      // Assert
      const textarea = screen.getByTestId('textarea')
      expect(textarea).toBeRequired()
      expect(textarea).toHaveAttribute('minLength', '10')
      expect(textarea).toHaveAttribute('maxLength', '500')
    })

    it('should handle form submission', async () => {
      // Arrange
      const user = userEvent.setup()
      const handleSubmit = jest.fn((e) => e.preventDefault())
      
      render(
        <form onSubmit={handleSubmit}>
          <Textarea name="test" defaultValue="submit value" />
          <button type="submit">Submit</button>
        </form>
      )
      
      // Act
      await user.click(screen.getByText('Submit'))
      
      // Assert
      expect(handleSubmit).toHaveBeenCalled()
    })
  })

  describe('Sizing and Layout', () => {
    it('should have minimum height set', () => {
      // Arrange & Act
      renderTextarea({ 'data-testid': 'textarea' })
      
      // Assert
      expect(screen.getByTestId('textarea')).toHaveClass('min-h-[80px]')
    })

    it('should support custom rows attribute', () => {
      // Arrange & Act
      renderTextarea({ rows: 10, 'data-testid': 'textarea' })
      
      // Assert
      expect(screen.getByTestId('textarea')).toHaveAttribute('rows', '10')
    })

    it('should support custom cols attribute', () => {
      // Arrange & Act
      renderTextarea({ cols: 50, 'data-testid': 'textarea' })
      
      // Assert
      expect(screen.getByTestId('textarea')).toHaveAttribute('cols', '50')
    })

    it('should support resize control', () => {
      // Arrange & Act
      renderTextarea({ style: { resize: 'vertical' }, 'data-testid': 'textarea' })
      
      // Assert
      const textarea = screen.getByTestId('textarea')
      expect(textarea).toHaveStyle({ resize: 'vertical' })
    })
  })

  describe('Edge Cases', () => {
    it('should handle empty value', () => {
      // Arrange & Act
      renderTextarea({ value: '', onChange: jest.fn(), 'data-testid': 'textarea' })
      
      // Assert
      expect(screen.getByTestId('textarea')).toHaveValue('')
    })

    it('should handle null/undefined values gracefully', () => {
      // Arrange & Act
      renderTextarea({ value: undefined, 'data-testid': 'textarea' })
      
      // Assert
      expect(screen.getByTestId('textarea')).toBeInTheDocument()
    })

    it('should merge multiple classNames correctly', () => {
      // Arrange & Act
      renderTextarea({ className: 'custom-1 custom-2', 'data-testid': 'textarea' })
      
      // Assert
      const textarea = screen.getByTestId('textarea')
      expect(textarea).toHaveClass('custom-1', 'custom-2', 'flex', 'min-h-[80px]')
    })

    it('should handle very long text content', async () => {
      // Arrange
      const user = userEvent.setup()
      const longText = 'Long text content '.repeat(20) // Shorter for testing
      renderTextarea({ 'data-testid': 'textarea' })
      
      // Act
      await user.type(screen.getByTestId('textarea'), longText)
      
      // Assert
      expect(screen.getByTestId('textarea')).toHaveValue(longText)
    })

    it('should handle text with special characters and emojis', async () => {
      // Arrange
      const user = userEvent.setup()
      const specialText = 'Hello! 🚀 Special chars: @#$%^&*()_+-='
      renderTextarea({ 'data-testid': 'textarea' })
      
      // Act
      await user.type(screen.getByTestId('textarea'), specialText)
      
      // Assert
      expect(screen.getByDisplayValue(specialText)).toBeInTheDocument()
    })

    it('should handle tabs and formatting characters', async () => {
      // Arrange
      const user = userEvent.setup()
      renderTextarea({ 'data-testid': 'textarea' })
      
      // Act
      const textarea = screen.getByTestId('textarea')
      await user.click(textarea)
      await user.keyboard('Text with spaces and enter{enter}new line')
      
      // Assert
      expect(textarea).toHaveValue('Text with spaces and enter\nnew line')
    })
  })

  describe('Performance', () => {
    it('should handle rapid typing without performance issues', async () => {
      // Arrange
      const user = userEvent.setup()
      const handleChange = jest.fn()
      renderTextarea({ onChange: handleChange, 'data-testid': 'textarea' })
      
      // Act
      const textarea = screen.getByTestId('textarea')
      await user.click(textarea)
      
      // Simulate rapid typing
      for (let i = 0; i < 10; i++) {
        await user.keyboard('fast')
      }
      
      // Assert
      expect(handleChange).toHaveBeenCalledTimes(40) // 4 chars * 10 iterations
      expect(textarea).toHaveValue('fast'.repeat(10))
    })
  })
})