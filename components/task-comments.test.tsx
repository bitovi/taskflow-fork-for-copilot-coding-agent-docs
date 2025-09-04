import { render, screen } from '@testing-library/react'
import { TaskComments } from './task-comments'

// Mock the server actions
jest.mock('@/app/(dashboard)/tasks/actions', () => ({
  addComment: jest.fn().mockResolvedValue({ success: true }),
  deleteComment: jest.fn().mockResolvedValue({ success: true }),
}))

// Mock the date utility
jest.mock('@/lib/date-utils', () => ({
  formatDateForDisplay: jest.fn((date) => 'Jan 01'),
}))

const mockComments = [
  {
    id: 1,
    content: 'This is a test comment',
    taskId: 1,
    authorId: 1,
    author: {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
    },
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2023-01-01'),
  },
]

describe('TaskComments', () => {
  const defaultProps = {
    taskId: 1,
    comments: mockComments,
    currentUserId: 1,
    taskCreatorId: 1,
  }

  it('renders comments section with correct count', () => {
    render(<TaskComments {...defaultProps} />)
    
    expect(screen.getByText('Comments (1)')).toBeInTheDocument()
  })

  it('shows empty state when no comments', () => {
    render(<TaskComments {...defaultProps} comments={[]} />)
    
    expect(screen.getByText('Comments (0)')).toBeInTheDocument()
    expect(screen.getByText('No comments yet. Be the first to comment!')).toBeInTheDocument()
  })

  it('hides comment form when no current user', () => {
    render(<TaskComments {...defaultProps} currentUserId={undefined} />)
    
    expect(screen.queryByPlaceholderText('Add a comment...')).not.toBeInTheDocument()
  })
})