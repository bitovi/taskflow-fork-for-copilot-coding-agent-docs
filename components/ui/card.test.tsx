import { render, screen } from '@testing-library/react'
import {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
} from './card'

describe('Card Components', () => {
  describe('Card', () => {
    it('should render card with default styling', () => {
      // Arrange & Act
      render(<Card data-testid="card">Test Card</Card>)
      
      // Assert
      const card = screen.getByTestId('card')
      expect(card).toBeInTheDocument()
      expect(card).toHaveClass('rounded-lg', 'border', 'shadow-sm', 'text-card-foreground', 'bg-card-background')
    })

    it('should apply custom className', () => {
      // Arrange & Act
      render(<Card className="custom-card" data-testid="card">Test Card</Card>)
      
      // Assert
      expect(screen.getByTestId('card')).toHaveClass('custom-card')
    })

    it('should forward ref correctly', () => {
      // Arrange
      const ref = { current: null }
      
      // Act
      render(<Card ref={ref} data-testid="card">Test Card</Card>)
      
      // Assert
      expect(ref.current).toBeDefined()
    })

    it('should render children content', () => {
      // Arrange & Act
      render(
        <Card>
          <div>Card Content</div>
        </Card>
      )
      
      // Assert
      expect(screen.getByText('Card Content')).toBeInTheDocument()
    })
  })

  describe('CardHeader', () => {
    it('should render header with proper styling', () => {
      // Arrange & Act
      render(<CardHeader data-testid="header">Header Content</CardHeader>)
      
      // Assert
      const header = screen.getByTestId('header')
      expect(header).toBeInTheDocument()
      expect(header).toHaveClass('flex', 'flex-col', 'space-y-1.5', 'p-6')
    })

    it('should apply custom className', () => {
      // Arrange & Act
      render(<CardHeader className="custom-header" data-testid="header">Header</CardHeader>)
      
      // Assert
      expect(screen.getByTestId('header')).toHaveClass('custom-header')
    })

    it('should render children content', () => {
      // Arrange & Act
      render(
        <CardHeader>
          <span>Header Text</span>
        </CardHeader>
      )
      
      // Assert
      expect(screen.getByText('Header Text')).toBeInTheDocument()
    })
  })

  describe('CardTitle', () => {
    it('should render title with proper styling', () => {
      // Arrange & Act
      render(<CardTitle data-testid="title">Card Title</CardTitle>)
      
      // Assert
      const title = screen.getByTestId('title')
      expect(title).toBeInTheDocument()
      expect(title).toHaveClass('text-2xl', 'font-semibold', 'leading-none', 'tracking-tight')
    })

    it('should apply custom className', () => {
      // Arrange & Act
      render(<CardTitle className="custom-title" data-testid="title">Title</CardTitle>)
      
      // Assert
      expect(screen.getByTestId('title')).toHaveClass('custom-title')
    })

    it('should render text content', () => {
      // Arrange & Act
      render(<CardTitle>My Card Title</CardTitle>)
      
      // Assert
      expect(screen.getByText('My Card Title')).toBeInTheDocument()
    })
  })

  describe('CardDescription', () => {
    it('should render description with proper styling', () => {
      // Arrange & Act
      render(<CardDescription data-testid="description">Card Description</CardDescription>)
      
      // Assert
      const description = screen.getByTestId('description')
      expect(description).toBeInTheDocument()
      expect(description).toHaveClass('text-sm', 'text-foreground-muted')
    })

    it('should apply custom className', () => {
      // Arrange & Act
      render(<CardDescription className="custom-desc" data-testid="description">Desc</CardDescription>)
      
      // Assert
      expect(screen.getByTestId('description')).toHaveClass('custom-desc')
    })

    it('should render text content', () => {
      // Arrange & Act
      render(<CardDescription>This is a description</CardDescription>)
      
      // Assert
      expect(screen.getByText('This is a description')).toBeInTheDocument()
    })
  })

  describe('CardContent', () => {
    it('should render content with proper styling', () => {
      // Arrange & Act
      render(<CardContent data-testid="content">Card Content</CardContent>)
      
      // Assert
      const content = screen.getByTestId('content')
      expect(content).toBeInTheDocument()
      expect(content).toHaveClass('p-6')
    })

    it('should apply custom className', () => {
      // Arrange & Act
      render(<CardContent className="custom-content" data-testid="content">Content</CardContent>)
      
      // Assert
      expect(screen.getByTestId('content')).toHaveClass('custom-content')
    })

    it('should render children content', () => {
      // Arrange & Act
      render(
        <CardContent>
          <p>Main content here</p>
        </CardContent>
      )
      
      // Assert
      expect(screen.getByText('Main content here')).toBeInTheDocument()
    })
  })

  describe('CardFooter', () => {
    it('should render footer with proper styling', () => {
      // Arrange & Act
      render(<CardFooter data-testid="footer">Footer Content</CardFooter>)
      
      // Assert
      const footer = screen.getByTestId('footer')
      expect(footer).toBeInTheDocument()
      expect(footer).toHaveClass('flex', 'items-center', 'p-6', 'pt-0')
    })

    it('should apply custom className', () => {
      // Arrange & Act
      render(<CardFooter className="custom-footer" data-testid="footer">Footer</CardFooter>)
      
      // Assert
      expect(screen.getByTestId('footer')).toHaveClass('custom-footer')
    })

    it('should render children content', () => {
      // Arrange & Act
      render(
        <CardFooter>
          <button>Action Button</button>
        </CardFooter>
      )
      
      // Assert
      expect(screen.getByRole('button', { name: 'Action Button' })).toBeInTheDocument()
    })
  })

  describe('Card Composition', () => {
    it('should render complete card structure', () => {
      // Arrange & Act
      render(
        <Card data-testid="full-card">
          <CardHeader>
            <CardTitle>Test Title</CardTitle>
            <CardDescription>Test Description</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Test Content</p>
          </CardContent>
          <CardFooter>
            <button>Test Action</button>
          </CardFooter>
        </Card>
      )
      
      // Assert
      expect(screen.getByTestId('full-card')).toBeInTheDocument()
      expect(screen.getByText('Test Title')).toBeInTheDocument()
      expect(screen.getByText('Test Description')).toBeInTheDocument()
      expect(screen.getByText('Test Content')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Test Action' })).toBeInTheDocument()
    })

    it('should maintain proper structure hierarchy', () => {
      // Arrange & Act
      render(
        <Card data-testid="card">
          <CardHeader data-testid="header">
            <CardTitle data-testid="title">Title</CardTitle>
          </CardHeader>
          <CardContent data-testid="content">Content</CardContent>
        </Card>
      )
      
      // Assert
      const card = screen.getByTestId('card')
      const header = screen.getByTestId('header')
      const title = screen.getByTestId('title')
      const content = screen.getByTestId('content')
      
      expect(card).toContainElement(header)
      expect(card).toContainElement(content)
      expect(header).toContainElement(title)
    })
  })

  describe('Accessibility', () => {
    it('should be accessible by default', () => {
      // Arrange & Act
      render(
        <Card role="article">
          <CardHeader>
            <CardTitle>Accessible Card</CardTitle>
          </CardHeader>
          <CardContent>Card content for accessibility testing</CardContent>
        </Card>
      )
      
      // Assert
      expect(screen.getByRole('article')).toBeInTheDocument()
      expect(screen.getByText('Accessible Card')).toBeInTheDocument()
    })

    it('should support ARIA attributes', () => {
      // Arrange & Act
      render(
        <Card aria-label="Test card" aria-describedby="card-desc">
          <CardContent id="card-desc">This card has ARIA labels</CardContent>
        </Card>
      )
      
      // Assert
      const card = screen.getByLabelText('Test card')
      expect(card).toBeInTheDocument()
      expect(card).toHaveAttribute('aria-describedby', 'card-desc')
    })
  })

  describe('Edge Cases', () => {
    it('should handle empty card', () => {
      // Arrange & Act
      render(<Card data-testid="empty-card" />)
      
      // Assert
      expect(screen.getByTestId('empty-card')).toBeInTheDocument()
    })

    it('should handle card with only some components', () => {
      // Arrange & Act
      render(
        <Card>
          <CardTitle>Title Only</CardTitle>
        </Card>
      )
      
      // Assert
      expect(screen.getByText('Title Only')).toBeInTheDocument()
    })

    it('should handle nested HTML elements', () => {
      // Arrange & Act
      render(
        <Card>
          <CardContent>
            <div>
              <span>Nested content</span>
              <ul>
                <li>List item 1</li>
                <li>List item 2</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      )
      
      // Assert
      expect(screen.getByText('Nested content')).toBeInTheDocument()
      expect(screen.getByText('List item 1')).toBeInTheDocument()
      expect(screen.getByText('List item 2')).toBeInTheDocument()
    })

    it('should merge classNames correctly', () => {
      // Arrange & Act
      render(
        <Card className="extra-class another-class" data-testid="card">
          Content
        </Card>
      )
      
      // Assert
      const card = screen.getByTestId('card')
      expect(card).toHaveClass('extra-class', 'another-class', 'rounded-lg', 'border')
    })
  })
})