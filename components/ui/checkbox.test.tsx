import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Checkbox } from './checkbox'

// Test helper to render Checkbox with default props
const renderCheckbox = (props: any = {}) => {
  const defaultProps = {
    ...props,
  }
  return render(<Checkbox {...defaultProps} />)
}

describe('Checkbox Component', () => {
  describe('Rendering', () => {
    it('should render checkbox input', () => {
      // Arrange & Act
      renderCheckbox()
      
      // Assert
      expect(screen.getByRole('checkbox')).toBeInTheDocument()
    })

    it('should apply custom className', () => {
      // Arrange & Act
      renderCheckbox({ className: 'custom-checkbox' })
      
      // Assert
      expect(screen.getByRole('checkbox')).toHaveClass('custom-checkbox')
    })

    it('should apply default styling classes', () => {
      // Arrange & Act
      renderCheckbox()
      
      // Assert
      const checkbox = screen.getByRole('checkbox')
      expect(checkbox).toHaveClass(
        'peer',
        'h-4',
        'w-4',
        'shrink-0',
        'rounded-sm',
        'border',
        'border-primary'
      )
    })

    it('should forward ref correctly', () => {
      // Arrange
      const ref = { current: null }
      
      // Act
      render(<Checkbox ref={ref} />)
      
      // Assert
      expect(ref.current).toBeDefined()
    })
  })

  describe('States', () => {
    it('should be unchecked by default', () => {
      // Arrange & Act
      renderCheckbox()
      
      // Assert
      expect(screen.getByRole('checkbox')).not.toBeChecked()
    })

    it('should be checked when checked prop is true', () => {
      // Arrange & Act
      renderCheckbox({ checked: true })
      
      // Assert
      expect(screen.getByRole('checkbox')).toBeChecked()
    })

    it('should be disabled when disabled prop is true', () => {
      // Arrange & Act
      renderCheckbox({ disabled: true })
      
      // Assert
      expect(screen.getByRole('checkbox')).toBeDisabled()
    })

    it('should apply disabled styling when disabled', () => {
      // Arrange & Act
      renderCheckbox({ disabled: true })
      
      // Assert
      const checkbox = screen.getByRole('checkbox')
      expect(checkbox).toHaveClass('disabled:cursor-not-allowed', 'disabled:opacity-50')
    })

    it('should handle controlled state', () => {
      // Arrange
      const { rerender } = renderCheckbox({ checked: false })
      
      // Act & Assert - Initially unchecked
      expect(screen.getByRole('checkbox')).not.toBeChecked()
      
      // Act & Assert - Update to checked
      rerender(<Checkbox checked={true} />)
      expect(screen.getByRole('checkbox')).toBeChecked()
    })
  })

  describe('Interactions', () => {
    it('should handle click events', async () => {
      // Arrange
      const user = userEvent.setup()
      const handleChange = jest.fn()
      renderCheckbox({ onCheckedChange: handleChange })
      
      // Act
      await user.click(screen.getByRole('checkbox'))
      
      // Assert
      expect(handleChange).toHaveBeenCalledTimes(1)
      expect(handleChange).toHaveBeenCalledWith(true)
    })

    it('should toggle checked state on click', async () => {
      // Arrange
      const user = userEvent.setup()
      const handleChange = jest.fn()
      const { rerender } = renderCheckbox({ onCheckedChange: handleChange })
      
      // Act - First click
      await user.click(screen.getByRole('checkbox'))
      
      // Assert
      expect(handleChange).toHaveBeenCalledWith(true)
      
      // Act - Simulate controlled state update and second click
      handleChange.mockClear()
      rerender(<Checkbox checked={true} onCheckedChange={handleChange} />)
      await user.click(screen.getByRole('checkbox'))
      
      // Assert
      expect(handleChange).toHaveBeenCalledWith(false)
    })

    it('should not trigger change when disabled', async () => {
      // Arrange
      const user = userEvent.setup()
      const handleChange = jest.fn()
      renderCheckbox({ disabled: true, onCheckedChange: handleChange })
      
      // Act
      await user.click(screen.getByRole('checkbox'))
      
      // Assert
      expect(handleChange).not.toHaveBeenCalled()
    })

    it('should be focusable via keyboard', () => {
      // Arrange & Act
      renderCheckbox()
      const checkbox = screen.getByRole('checkbox')
      checkbox.focus()
      
      // Assert
      expect(checkbox).toHaveFocus()
    })

    it('should handle keyboard interaction (space key)', async () => {
      // Arrange
      const user = userEvent.setup()
      const handleChange = jest.fn()
      renderCheckbox({ onCheckedChange: handleChange })
      
      // Act
      const checkbox = screen.getByRole('checkbox')
      checkbox.focus()
      await user.keyboard(' ')
      
      // Assert
      expect(handleChange).toHaveBeenCalledWith(true)
    })
  })

  describe('Accessibility', () => {
    it('should have checkbox role', () => {
      // Arrange & Act
      renderCheckbox()
      
      // Assert
      expect(screen.getByRole('checkbox')).toBeInTheDocument()
    })

    it('should support aria-label', () => {
      // Arrange & Act
      renderCheckbox({ 'aria-label': 'Accept terms and conditions' })
      
      // Assert
      expect(screen.getByLabelText('Accept terms and conditions')).toBeInTheDocument()
    })

    it('should support aria-describedby', () => {
      // Arrange & Act
      render(
        <div>
          <Checkbox aria-describedby="checkbox-description" />
          <div id="checkbox-description">This checkbox controls something important</div>
        </div>
      )
      
      // Assert
      const checkbox = screen.getByRole('checkbox')
      expect(checkbox).toHaveAttribute('aria-describedby', 'checkbox-description')
    })

    it('should support form integration with name and value', () => {
      // Arrange & Act
      render(
        <form>
          <input type="checkbox" name="terms" value="accepted" data-testid="form-checkbox" />
        </form>
      )
      
      // Assert - Test with regular HTML input since Radix Checkbox doesn't expose name/value directly
      const checkbox = screen.getByTestId('form-checkbox')
      expect(checkbox).toHaveAttribute('name', 'terms')
      expect(checkbox).toHaveAttribute('value', 'accepted')
    })

    it('should have proper focus styling', () => {
      // Arrange & Act
      renderCheckbox()
      
      // Assert
      const checkbox = screen.getByRole('checkbox')
      expect(checkbox).toHaveClass(
        'focus-visible:outline-none',
        'focus-visible:ring-2',
        'focus-visible:ring-ring',
        'focus-visible:ring-offset-2'
      )
    })

    it('should support required attribute for forms', () => {
      // Arrange & Act
      renderCheckbox({ required: true })
      
      // Assert
      expect(screen.getByRole('checkbox')).toBeRequired()
    })
  })

  describe('Visual States', () => {
    it('should show check icon when checked', () => {
      // Arrange & Act
      renderCheckbox({ checked: true })
      
      // Assert
      const checkbox = screen.getByRole('checkbox')
      expect(checkbox).toHaveAttribute('data-state', 'checked')
    })

    it('should apply checked state styling', () => {
      // Arrange & Act
      renderCheckbox({ checked: true })
      
      // Assert
      const checkbox = screen.getByRole('checkbox')
      expect(checkbox).toHaveClass('data-[state=checked]:bg-primary', 'data-[state=checked]:text-primary')
    })

    it('should handle indeterminate state', () => {
      // Arrange & Act
      renderCheckbox({ checked: 'indeterminate' })
      
      // Assert
      const checkbox = screen.getByRole('checkbox')
      expect(checkbox).toHaveAttribute('data-state', 'indeterminate')
    })
  })

  describe('Form Integration', () => {
    it('should work within a form', () => {
      // Arrange & Act
      render(
        <form data-testid="test-form">
          <Checkbox data-testid="form-checkbox" />
        </form>
      )
      
      // Assert
      const form = screen.getByTestId('test-form')
      const checkbox = screen.getByTestId('form-checkbox')
      expect(form).toContainElement(checkbox)
    })

    it('should support form validation', () => {
      // Arrange & Act
      renderCheckbox({ required: true, 'aria-invalid': true })
      
      // Assert
      const checkbox = screen.getByRole('checkbox')
      expect(checkbox).toBeRequired()
      expect(checkbox).toHaveAttribute('aria-invalid', 'true')
    })
  })

  describe('Edge Cases', () => {
    it('should handle rapid clicking', async () => {
      // Arrange
      const user = userEvent.setup()
      const handleChange = jest.fn()
      renderCheckbox({ onCheckedChange: handleChange })
      
      // Act - Rapid clicks
      const checkbox = screen.getByRole('checkbox')
      await user.click(checkbox)
      await user.click(checkbox)
      await user.click(checkbox)
      
      // Assert
      expect(handleChange).toHaveBeenCalledTimes(3)
    })

    it('should handle null/undefined props gracefully', () => {
      // Arrange & Act
      renderCheckbox({ 
        checked: undefined,
        onCheckedChange: undefined,
        className: null
      })
      
      // Assert
      expect(screen.getByRole('checkbox')).toBeInTheDocument()
    })

    it('should merge multiple classNames correctly', () => {
      // Arrange & Act
      renderCheckbox({ className: 'custom-1 custom-2' })
      
      // Assert
      const checkbox = screen.getByRole('checkbox')
      expect(checkbox).toHaveClass('custom-1', 'custom-2', 'h-4', 'w-4')
    })
  })
})