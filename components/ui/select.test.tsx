import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from './select'

// Test helper to render a complete Select component
const renderSelect = (props: any = {}) => {
  const defaultProps = {
    defaultValue: undefined,
    onValueChange: jest.fn(),
    ...props,
  }
  
  return render(
    <Select {...defaultProps}>
      <SelectTrigger data-testid="select-trigger">
        <SelectValue placeholder="Select an option" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="option1">Option 1</SelectItem>
        <SelectItem value="option2">Option 2</SelectItem>
        <SelectItem value="option3">Option 3</SelectItem>
      </SelectContent>
    </Select>
  )
}

describe('Select Components', () => {
  describe('SelectTrigger', () => {
    it('should render trigger with default styling', () => {
      // Arrange & Act
      render(
        <SelectTrigger data-testid="trigger">
          <SelectValue />
        </SelectTrigger>
      )
      
      // Assert
      const trigger = screen.getByTestId('trigger')
      expect(trigger).toBeInTheDocument()
      expect(trigger).toHaveClass(
        'flex',
        'h-10',
        'w-full',
        'items-center',
        'justify-between',
        'rounded-md',
        'border',
        'border-input'
      )
    })

    it('should apply custom className', () => {
      // Arrange & Act
      render(
        <SelectTrigger className="custom-trigger" data-testid="trigger">
          <SelectValue />
        </SelectTrigger>
      )
      
      // Assert
      expect(screen.getByTestId('trigger')).toHaveClass('custom-trigger')
    })

    it('should show chevron down icon', () => {
      // Arrange & Act
      render(
        <SelectTrigger data-testid="trigger">
          <SelectValue />
        </SelectTrigger>
      )
      
      // Assert
      const chevron = screen.getByTestId('trigger').querySelector('svg')
      expect(chevron).toBeInTheDocument()
      expect(chevron).toHaveClass('h-4', 'w-4', 'opacity-50')
    })

    it('should be disabled when disabled prop is true', () => {
      // Arrange & Act
      render(
        <Select disabled>
          <SelectTrigger data-testid="trigger">
            <SelectValue />
          </SelectTrigger>
        </Select>
      )
      
      // Assert
      const trigger = screen.getByTestId('trigger')
      expect(trigger).toHaveAttribute('aria-disabled', 'true')
      expect(trigger).toHaveClass('disabled:cursor-not-allowed', 'disabled:opacity-50')
    })
  })

  describe('SelectValue', () => {
    it('should show placeholder when no value is selected', () => {
      // Arrange & Act
      render(
        <SelectTrigger>
          <SelectValue placeholder="Choose option" />
        </SelectTrigger>
      )
      
      // Assert
      expect(screen.getByText('Choose option')).toBeInTheDocument()
    })
  })

  describe('SelectContent', () => {
    it('should render content with proper styling', () => {
      // Arrange & Act
      render(
        <SelectContent data-testid="content">
          <SelectItem value="test">Test Item</SelectItem>
        </SelectContent>
      )
      
      // Assert
      const content = screen.getByTestId('content')
      expect(content).toHaveClass(
        'relative',
        'z-50',
        'max-h-96',
        'min-w-[8rem]',
        'overflow-hidden',
        'rounded-md'
      )
    })

    it('should apply popper positioning classes when position is popper', () => {
      // Arrange & Act
      render(
        <SelectContent position="popper" data-testid="content">
          <SelectItem value="test">Test Item</SelectItem>
        </SelectContent>
      )
      
      // Assert
      const content = screen.getByTestId('content')
      expect(content).toHaveClass('data-[side=bottom]:translate-y-1')
    })
  })

  describe('SelectItem', () => {
    it('should render item with proper styling', () => {
      // Arrange & Act
      render(
        <SelectItem value="test" data-testid="item">
          Test Item
        </SelectItem>
      )
      
      // Assert
      const item = screen.getByTestId('item')
      expect(item).toBeInTheDocument()
      expect(item).toHaveClass(
        'relative',
        'flex',
        'w-full',
        'cursor-default',
        'select-none',
        'items-center'
      )
    })

    it('should apply custom className', () => {
      // Arrange & Act
      render(
        <SelectItem value="test" className="custom-item" data-testid="item">
          Test Item
        </SelectItem>
      )
      
      // Assert
      expect(screen.getByTestId('item')).toHaveClass('custom-item')
    })

    it('should be disabled when disabled prop is true', () => {
      // Arrange & Act
      render(
        <SelectItem value="test" disabled data-testid="item">
          Test Item
        </SelectItem>
      )
      
      // Assert
      const item = screen.getByTestId('item')
      expect(item).toHaveAttribute('aria-disabled', 'true')
      expect(item).toHaveClass('data-[disabled]:pointer-events-none', 'data-[disabled]:opacity-50')
    })

    it('should show check icon when selected', () => {
      // Arrange & Act
      render(
        <Select value="test">
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="test" data-testid="item">
              Test Item
            </SelectItem>
          </SelectContent>
        </Select>
      )
      
      // Assert
      const item = screen.getByTestId('item')
      const checkIcon = item.querySelector('svg')
      expect(checkIcon).toBeInTheDocument()
    })
  })

  describe('SelectLabel', () => {
    it('should render label with proper styling', () => {
      // Arrange & Act
      render(
        <SelectLabel data-testid="label">
          Categories
        </SelectLabel>
      )
      
      // Assert
      const label = screen.getByTestId('label')
      expect(label).toBeInTheDocument()
      expect(label).toHaveClass('py-1.5', 'pl-8', 'pr-2', 'text-sm', 'font-semibold')
      expect(label).toHaveTextContent('Categories')
    })

    it('should apply custom className', () => {
      // Arrange & Act
      render(
        <SelectLabel className="custom-label" data-testid="label">
          Custom Label
        </SelectLabel>
      )
      
      // Assert
      expect(screen.getByTestId('label')).toHaveClass('custom-label')
    })
  })

  describe('SelectSeparator', () => {
    it('should render separator with proper styling', () => {
      // Arrange & Act
      render(<SelectSeparator data-testid="separator" />)
      
      // Assert
      const separator = screen.getByTestId('separator')
      expect(separator).toBeInTheDocument()
      expect(separator).toHaveClass('-mx-1', 'my-1', 'h-px', 'bg-muted')
    })

    it('should apply custom className', () => {
      // Arrange & Act
      render(<SelectSeparator className="custom-separator" data-testid="separator" />)
      
      // Assert
      expect(screen.getByTestId('separator')).toHaveClass('custom-separator')
    })
  })

  describe('Complete Select Integration', () => {
    it('should render complete select structure', () => {
      // Arrange & Act
      render(
        <Select>
          <SelectTrigger data-testid="trigger">
            <SelectValue placeholder="Select option" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Fruits</SelectLabel>
              <SelectItem value="apple">Apple</SelectItem>
              <SelectItem value="banana">Banana</SelectItem>
              <SelectSeparator />
              <SelectLabel>Vegetables</SelectLabel>
              <SelectItem value="carrot">Carrot</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      )
      
      // Assert
      expect(screen.getByTestId('trigger')).toBeInTheDocument()
      expect(screen.getByText('Select option')).toBeInTheDocument()
      expect(screen.getByText('Fruits')).toBeInTheDocument()
      expect(screen.getByText('Apple')).toBeInTheDocument()
      expect(screen.getByText('Vegetables')).toBeInTheDocument()
    })

    it('should handle value selection', async () => {
      // Arrange
      const user = userEvent.setup()
      const handleValueChange = jest.fn()
      
      render(
        <Select onValueChange={handleValueChange}>
          <SelectTrigger data-testid="trigger">
            <SelectValue placeholder="Select option" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="option1">Option 1</SelectItem>
            <SelectItem value="option2">Option 2</SelectItem>
          </SelectContent>
        </Select>
      )
      
      // Act
      await user.click(screen.getByTestId('trigger'))
      await user.click(screen.getByText('Option 1'))
      
      // Assert
      expect(handleValueChange).toHaveBeenCalledWith('option1')
    })

    it('should show selected value in trigger', () => {
      // Arrange & Act
      render(
        <Select value="option2">
          <SelectTrigger data-testid="trigger">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="option1">Option 1</SelectItem>
            <SelectItem value="option2">Option 2</SelectItem>
          </SelectContent>
        </Select>
      )
      
      // Assert
      expect(screen.getByText('Option 2')).toBeInTheDocument()
    })

    it('should handle disabled state', () => {
      // Arrange & Act
      render(
        <Select disabled>
          <SelectTrigger data-testid="trigger">
            <SelectValue placeholder="Disabled select" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="option1">Option 1</SelectItem>
          </SelectContent>
        </Select>
      )
      
      // Assert
      const trigger = screen.getByTestId('trigger')
      expect(trigger).toHaveAttribute('aria-disabled', 'true')
    })
  })

  describe('Accessibility', () => {
    it('should have proper ARIA attributes', () => {
      // Arrange & Act
      renderSelect()
      
      // Assert
      const trigger = screen.getByTestId('select-trigger')
      expect(trigger).toHaveAttribute('role', 'combobox')
      expect(trigger).toHaveAttribute('aria-expanded', 'false')
    })

    it('should support keyboard navigation', async () => {
      // Arrange
      const user = userEvent.setup()
      const handleValueChange = jest.fn()
      renderSelect({ onValueChange: handleValueChange })
      
      // Act
      const trigger = screen.getByTestId('select-trigger')
      trigger.focus()
      await user.keyboard('{Enter}')
      await user.keyboard('{ArrowDown}')
      await user.keyboard('{Enter}')
      
      // Assert
      expect(handleValueChange).toHaveBeenCalled()
    })

    it('should support form integration', () => {
      // Arrange & Act
      render(
        <form>
          <Select name="category">
            <SelectTrigger data-testid="trigger">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="tech">Technology</SelectItem>
            </SelectContent>
          </Select>
        </form>
      )
      
      // Assert
      const trigger = screen.getByTestId('trigger')
      expect(trigger.closest('form')).toBeInTheDocument()
    })

    it('should support required validation', () => {
      // Arrange & Act
      render(
        <Select required>
          <SelectTrigger data-testid="trigger">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="option1">Option 1</SelectItem>
          </SelectContent>
        </Select>
      )
      
      // Assert
      expect(screen.getByTestId('trigger')).toHaveAttribute('aria-required', 'true')
    })
  })

  describe('Edge Cases', () => {
    it('should handle empty content', () => {
      // Arrange & Act
      render(
        <Select>
          <SelectTrigger data-testid="trigger">
            <SelectValue placeholder="No options" />
          </SelectTrigger>
          <SelectContent>
            {/* No items */}
          </SelectContent>
        </Select>
      )
      
      // Assert
      expect(screen.getByTestId('trigger')).toBeInTheDocument()
      expect(screen.getByText('No options')).toBeInTheDocument()
    })

    it('should handle long option text', () => {
      // Arrange & Act
      render(
        <Select>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="long">
              This is a very long option text that should be handled properly
            </SelectItem>
          </SelectContent>
        </Select>
      )
      
      // Assert
      const longText = screen.getByText('This is a very long option text that should be handled properly')
      expect(longText).toBeInTheDocument()
    })

    it('should handle null/undefined values gracefully', () => {
      // Arrange & Act
      render(
        <Select value={undefined}>
          <SelectTrigger data-testid="trigger">
            <SelectValue placeholder="Select..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="test">Test</SelectItem>
          </SelectContent>
        </Select>
      )
      
      // Assert
      expect(screen.getByText('Select...')).toBeInTheDocument()
    })

    it('should merge classNames correctly', () => {
      // Arrange & Act
      render(
        <Select>
          <SelectTrigger className="custom-1 custom-2" data-testid="trigger">
            <SelectValue />
          </SelectTrigger>
        </Select>
      )
      
      // Assert
      const trigger = screen.getByTestId('trigger')
      expect(trigger).toHaveClass('custom-1', 'custom-2', 'flex', 'h-10')
    })
  })
})