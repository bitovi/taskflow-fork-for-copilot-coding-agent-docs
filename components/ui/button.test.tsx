import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Button, type ButtonProps } from './button'

// Test helper to render Button with default props
const renderButton = (props: Partial<ButtonProps> = {}) => {
  const defaultProps: ButtonProps = {
    children: 'Test Button',
    ...props,
  }
  return render(<Button {...defaultProps} />)
}

describe('Button Component', () => {
  describe('Rendering', () => {
    it('should render button with children', () => {
      // Arrange & Act
      renderButton({ children: 'Click me' })
      
      // Assert
      expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument()
    })

    it('should render as child component when asChild is true', () => {
      // Arrange & Act
      render(
        <Button asChild>
          <a href="/test">Link Button</a>
        </Button>
      )
      
      // Assert
      expect(screen.getByRole('link', { name: 'Link Button' })).toBeInTheDocument()
      expect(screen.queryByRole('button')).not.toBeInTheDocument()
    })

    it('should apply custom className', () => {
      // Arrange & Act
      renderButton({ className: 'custom-class' })
      
      // Assert
      expect(screen.getByRole('button')).toHaveClass('custom-class')
    })
  })

  describe('Variants', () => {
    it('should apply default variant styling', () => {
      // Arrange & Act
      renderButton()
      
      // Assert
      const button = screen.getByRole('button')
      expect(button).toHaveClass('bg-primary', 'text-primary-foreground')
    })

    it('should apply destructive variant styling', () => {
      // Arrange & Act
      renderButton({ variant: 'destructive' })
      
      // Assert
      const button = screen.getByRole('button')
      expect(button).toHaveClass('bg-destructive', 'text-destructive-foreground')
    })

    it('should apply outline variant styling', () => {
      // Arrange & Act
      renderButton({ variant: 'outline' })
      
      // Assert
      const button = screen.getByRole('button')
      expect(button).toHaveClass('border', 'border-input', 'bg-background')
    })

    it('should apply secondary variant styling', () => {
      // Arrange & Act
      renderButton({ variant: 'secondary' })
      
      // Assert
      const button = screen.getByRole('button')
      expect(button).toHaveClass('bg-secondary', 'text-secondary-foreground')
    })

    it('should apply ghost variant styling', () => {
      // Arrange & Act
      renderButton({ variant: 'ghost' })
      
      // Assert
      const button = screen.getByRole('button')
      expect(button).toHaveClass('hover:bg-accent', 'hover:text-accent-foreground')
    })

    it('should apply link variant styling', () => {
      // Arrange & Act
      renderButton({ variant: 'link' })
      
      // Assert
      const button = screen.getByRole('button')
      expect(button).toHaveClass('text-primary', 'underline-offset-4')
    })
  })

  describe('Sizes', () => {
    it('should apply default size styling', () => {
      // Arrange & Act
      renderButton()
      
      // Assert
      const button = screen.getByRole('button')
      expect(button).toHaveClass('h-10', 'px-4', 'py-2')
    })

    it('should apply small size styling', () => {
      // Arrange & Act
      renderButton({ size: 'sm' })
      
      // Assert
      const button = screen.getByRole('button')
      expect(button).toHaveClass('h-9', 'px-3')
    })

    it('should apply large size styling', () => {
      // Arrange & Act
      renderButton({ size: 'lg' })
      
      // Assert
      const button = screen.getByRole('button')
      expect(button).toHaveClass('h-11', 'px-8')
    })

    it('should apply icon size styling', () => {
      // Arrange & Act
      renderButton({ size: 'icon' })
      
      // Assert
      const button = screen.getByRole('button')
      expect(button).toHaveClass('h-10', 'w-10')
    })
  })

  describe('Interactions', () => {
    it('should handle click events', async () => {
      // Arrange
      const user = userEvent.setup()
      const handleClick = jest.fn()
      renderButton({ onClick: handleClick })
      
      // Act
      await user.click(screen.getByRole('button'))
      
      // Assert
      expect(handleClick).toHaveBeenCalledTimes(1)
    })

    it('should not trigger click when disabled', async () => {
      // Arrange
      const user = userEvent.setup()
      const handleClick = jest.fn()
      renderButton({ onClick: handleClick, disabled: true })
      
      // Act
      await user.click(screen.getByRole('button'))
      
      // Assert
      expect(handleClick).not.toHaveBeenCalled()
    })

    it('should be focusable via keyboard', () => {
      // Arrange & Act
      renderButton()
      const button = screen.getByRole('button')
      button.focus()
      
      // Assert
      expect(button).toHaveFocus()
    })
  })

  describe('Accessibility', () => {
    it('should have button role by default', () => {
      // Arrange & Act
      renderButton()
      
      // Assert
      expect(screen.getByRole('button')).toBeInTheDocument()
    })

    it('should support aria-label', () => {
      // Arrange & Act
      renderButton({ 'aria-label': 'Save changes' })
      
      // Assert
      expect(screen.getByLabelText('Save changes')).toBeInTheDocument()
    })

    it('should support disabled state for accessibility', () => {
      // Arrange & Act
      renderButton({ disabled: true })
      
      // Assert
      const button = screen.getByRole('button')
      expect(button).toBeDisabled()
      expect(button).toHaveClass('disabled:opacity-50')
    })

    it('should have proper cursor styling', () => {
      // Arrange & Act
      renderButton()
      
      // Assert
      expect(screen.getByRole('button')).toHaveClass('cursor-pointer')
    })
  })

  describe('Edge Cases', () => {
    it('should handle empty children', () => {
      // Arrange & Act
      renderButton({ children: '' })
      
      // Assert
      expect(screen.getByRole('button')).toBeInTheDocument()
    })

    it('should handle numeric children', () => {
      // Arrange & Act
      renderButton({ children: 42 })
      
      // Assert
      expect(screen.getByRole('button', { name: '42' })).toBeInTheDocument()
    })

    it('should handle JSX children', () => {
      // Arrange & Act
      renderButton({ 
        children: (
          <>
            <span>Icon</span>
            Text
          </>
        )
      })
      
      // Assert
      expect(screen.getByRole('button')).toHaveTextContent('IconText')
    })

    it('should merge multiple className props correctly', () => {
      // Arrange & Act
      renderButton({ 
        className: 'custom-1 custom-2',
        variant: 'outline',
        size: 'sm'
      })
      
      // Assert
      const button = screen.getByRole('button')
      expect(button).toHaveClass('custom-1', 'custom-2', 'border', 'h-9')
    })
  })
})