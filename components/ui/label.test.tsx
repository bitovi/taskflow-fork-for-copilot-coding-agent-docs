import { render, screen } from '@testing-library/react'
import { Label } from './label'

// Test helper to render Label with default props
const renderLabel = (props: any = {}) => {
  const defaultProps = {
    children: 'Test Label',
    ...props,
  }
  return render(<Label {...defaultProps} />)
}

describe('Label Component', () => {
  describe('Rendering', () => {
    it('should render label element', () => {
      // Arrange & Act
      renderLabel({ 'data-testid': 'label' })
      
      // Assert
      expect(screen.getByTestId('label')).toBeInTheDocument()
      expect(screen.getByText('Test Label')).toBeInTheDocument()
    })

    it('should apply default styling classes', () => {
      // Arrange & Act
      renderLabel({ 'data-testid': 'label' })
      
      // Assert
      const label = screen.getByTestId('label')
      expect(label).toHaveClass(
        'text-sm',
        'font-medium',
        'leading-none',
        'peer-disabled:cursor-not-allowed',
        'peer-disabled:opacity-70'
      )
    })

    it('should apply custom className', () => {
      // Arrange & Act
      renderLabel({ className: 'custom-label', 'data-testid': 'label' })
      
      // Assert
      expect(screen.getByTestId('label')).toHaveClass('custom-label')
    })

    it('should forward ref correctly', () => {
      // Arrange
      const ref = { current: null }
      
      // Act
      render(<Label ref={ref} data-testid="label">Ref Test</Label>)
      
      // Assert
      expect(ref.current).toBeDefined()
      expect(ref.current).toBe(screen.getByTestId('label'))
    })

    it('should render as label element by default', () => {
      // Arrange & Act
      renderLabel({ 'data-testid': 'label' })
      
      // Assert
      const label = screen.getByTestId('label')
      expect(label.tagName).toBe('LABEL')
    })
  })

  describe('Content Rendering', () => {
    it('should render text content', () => {
      // Arrange & Act
      renderLabel({ children: 'Simple text label' })
      
      // Assert
      expect(screen.getByText('Simple text label')).toBeInTheDocument()
    })

    it('should render JSX content', () => {
      // Arrange & Act
      renderLabel({
        children: (
          <>
            <span>Label with</span>
            <strong>bold text</strong>
          </>
        )
      })
      
      // Assert
      expect(screen.getByText('Label with')).toBeInTheDocument()
      expect(screen.getByText('bold text')).toBeInTheDocument()
    })

    it('should render empty content gracefully', () => {
      // Arrange & Act
      renderLabel({ children: '', 'data-testid': 'label' })
      
      // Assert
      expect(screen.getByTestId('label')).toBeInTheDocument()
    })

    it('should render numeric content', () => {
      // Arrange & Act
      renderLabel({ children: 42 })
      
      // Assert
      expect(screen.getByText('42')).toBeInTheDocument()
    })
  })

  describe('Form Association', () => {
    it('should associate with form control using htmlFor', () => {
      // Arrange & Act
      render(
        <div>
          <Label htmlFor="username">Username</Label>
          <input id="username" type="text" />
        </div>
      )
      
      // Assert
      const label = screen.getByText('Username')
      expect(label).toHaveAttribute('for', 'username')
      
      // Test association works
      const input = screen.getByLabelText('Username')
      expect(input).toBeInTheDocument()
      expect(input).toHaveAttribute('id', 'username')
    })

    it('should work with nested form controls', () => {
      // Arrange & Act
      render(
        <Label data-testid="wrapper-label">
          Email Address
          <input type="email" data-testid="nested-input" />
        </Label>
      )
      
      // Assert
      const label = screen.getByTestId('wrapper-label')
      const input = screen.getByTestId('nested-input')
      expect(label).toContainElement(input)
    })

    it('should work with different input types', () => {
      // Arrange & Act
      render(
        <div>
          <Label htmlFor="email">Email</Label>
          <input id="email" type="email" />
          
          <Label htmlFor="password">Password</Label>
          <input id="password" type="password" />
          
          <Label htmlFor="age">Age</Label>
          <input id="age" type="number" />
        </div>
      )
      
      // Assert
      expect(screen.getByLabelText('Email')).toHaveAttribute('type', 'email')
      expect(screen.getByLabelText('Password')).toHaveAttribute('type', 'password')
      expect(screen.getByLabelText('Age')).toHaveAttribute('type', 'number')
    })

    it('should work with textarea', () => {
      // Arrange & Act
      render(
        <div>
          <Label htmlFor="comments">Comments</Label>
          <textarea id="comments" />
        </div>
      )
      
      // Assert
      const textarea = screen.getByLabelText('Comments')
      expect(textarea.tagName).toBe('TEXTAREA')
    })

    it('should work with select elements', () => {
      // Arrange & Act
      render(
        <div>
          <Label htmlFor="country">Country</Label>
          <select id="country">
            <option value="us">United States</option>
            <option value="ca">Canada</option>
          </select>
        </div>
      )
      
      // Assert
      const select = screen.getByLabelText('Country')
      expect(select.tagName).toBe('SELECT')
    })
  })

  describe('Accessibility', () => {
    it('should have proper semantics for screen readers', () => {
      // Arrange & Act
      render(
        <div>
          <Label htmlFor="accessible-input">Accessible Label</Label>
          <input id="accessible-input" type="text" />
        </div>
      )
      
      // Assert
      const input = screen.getByLabelText('Accessible Label')
      expect(input).toBeInTheDocument()
    })

    it('should support aria-label when htmlFor is not used', () => {
      // Arrange & Act
      renderLabel({ 'aria-label': 'Custom aria label', 'data-testid': 'label' })
      
      // Assert
      expect(screen.getByTestId('label')).toHaveAttribute('aria-label', 'Custom aria label')
    })

    it('should support aria-describedby', () => {
      // Arrange & Act
      render(
        <div>
          <Label htmlFor="described-input" aria-describedby="input-help">
            Input Label
          </Label>
          <input id="described-input" />
          <div id="input-help">This is help text</div>
        </div>
      )
      
      // Assert
      const label = screen.getByText('Input Label')
      expect(label).toHaveAttribute('aria-describedby', 'input-help')
    })

    it('should handle peer disabled state styling', () => {
      // Arrange & Act
      render(
        <div>
          <Label htmlFor="disabled-input" data-testid="label">
            Disabled Field
          </Label>
          <input id="disabled-input" disabled className="peer" />
        </div>
      )
      
      // Assert
      const label = screen.getByTestId('label')
      expect(label).toHaveClass('peer-disabled:cursor-not-allowed', 'peer-disabled:opacity-70')
    })
  })

  describe('Styling and Variants', () => {
    it('should merge custom classes with default classes', () => {
      // Arrange & Act
      renderLabel({ 
        className: 'custom-class another-class',
        'data-testid': 'label'
      })
      
      // Assert
      const label = screen.getByTestId('label')
      expect(label).toHaveClass(
        'custom-class',
        'another-class',
        'text-sm',
        'font-medium',
        'leading-none'
      )
    })

    it('should override default styles with custom classes', () => {
      // Arrange & Act
      renderLabel({ 
        className: 'text-lg font-bold',
        'data-testid': 'label'
      })
      
      // Assert
      const label = screen.getByTestId('label')
      expect(label).toHaveClass('text-lg', 'font-bold')
    })

    it('should support inline styles', () => {
      // Arrange & Act
      renderLabel({ 
        style: { color: 'red', fontSize: '16px' },
        'data-testid': 'label'
      })
      
      // Assert
      const label = screen.getByTestId('label')
      expect(label).toHaveStyle({ color: 'rgb(255, 0, 0)', fontSize: '16px' })
    })
  })

  describe('Component Integration', () => {
    it('should work with checkbox inputs', () => {
      // Arrange & Act
      render(
        <div>
          <Label htmlFor="agree-checkbox">
            I agree to the terms and conditions
          </Label>
          <input id="agree-checkbox" type="checkbox" />
        </div>
      )
      
      // Assert
      const checkbox = screen.getByLabelText('I agree to the terms and conditions')
      expect(checkbox).toHaveAttribute('type', 'checkbox')
    })

    it('should work with radio buttons', () => {
      // Arrange & Act
      render(
        <div>
          <Label htmlFor="option1">Option 1</Label>
          <input id="option1" type="radio" name="options" value="1" />
          
          <Label htmlFor="option2">Option 2</Label>
          <input id="option2" type="radio" name="options" value="2" />
        </div>
      )
      
      // Assert
      const radio1 = screen.getByLabelText('Option 1')
      const radio2 = screen.getByLabelText('Option 2')
      expect(radio1).toHaveAttribute('type', 'radio')
      expect(radio2).toHaveAttribute('type', 'radio')
    })

    it('should work with file inputs', () => {
      // Arrange & Act
      render(
        <div>
          <Label htmlFor="file-upload">Upload File</Label>
          <input id="file-upload" type="file" />
        </div>
      )
      
      // Assert
      const fileInput = screen.getByLabelText('Upload File')
      expect(fileInput).toHaveAttribute('type', 'file')
    })
  })

  describe('Edge Cases', () => {
    it('should handle special characters in content', () => {
      // Arrange & Act
      renderLabel({ children: 'Label with special chars: @#$%^&*()' })
      
      // Assert
      expect(screen.getByText('Label with special chars: @#$%^&*()')).toBeInTheDocument()
    })

    it('should handle very long label text', () => {
      // Arrange
      const longText = 'This is a very long label text that might wrap to multiple lines and should still be handled correctly by the component'
      
      // Act
      renderLabel({ children: longText })
      
      // Assert
      expect(screen.getByText(longText)).toBeInTheDocument()
    })

    it('should handle null/undefined children gracefully', () => {
      // Arrange & Act
      renderLabel({ children: null, 'data-testid': 'label' })
      
      // Assert
      expect(screen.getByTestId('label')).toBeInTheDocument()
    })

    it('should handle multiple className values', () => {
      // Arrange & Act
      renderLabel({ 
        className: 'class1 class2 class3',
        'data-testid': 'label'
      })
      
      // Assert
      const label = screen.getByTestId('label')
      expect(label).toHaveClass('class1', 'class2', 'class3')
    })
  })

  describe('Performance', () => {
    it('should render efficiently with minimal props', () => {
      // Arrange & Act
      const { container } = render(<Label>Simple Label</Label>)
      
      // Assert
      expect(container.firstChild).toBeInTheDocument()
      expect(container.firstChild?.textContent).toBe('Simple Label')
    })

    it('should handle re-renders without issues', () => {
      // Arrange
      const { rerender } = renderLabel({ children: 'Initial text' })
      
      // Act
      rerender(<Label>Updated text</Label>)
      
      // Assert
      expect(screen.getByText('Updated text')).toBeInTheDocument()
      expect(screen.queryByText('Initial text')).not.toBeInTheDocument()
    })
  })

  describe('Form Validation Integration', () => {
    it('should work with required field indicators', () => {
      // Arrange & Act
      render(
        <div>
          <Label htmlFor="required-field">
            Required Field <span aria-label="required">*</span>
          </Label>
          <input id="required-field" required />
        </div>
      )
      
      // Assert
      const label = screen.getByText(/Required Field/)
      const requiredIndicator = screen.getByLabelText('required')
      expect(label).toContainElement(requiredIndicator)
      
      const input = screen.getByLabelText(/Required Field/)
      expect(input).toBeRequired()
    })

    it('should support error state styling', () => {
      // Arrange & Act
      renderLabel({ 
        className: 'text-red-600',
        'data-testid': 'error-label',
        children: 'Field with error'
      })
      
      // Assert
      const label = screen.getByTestId('error-label')
      expect(label).toHaveClass('text-red-600')
    })
  })
})