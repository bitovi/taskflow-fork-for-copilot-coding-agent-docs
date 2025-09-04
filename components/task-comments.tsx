"use client"

import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { MessageCircle, Trash2, Send } from "lucide-react"
import { addComment, deleteComment } from "@/app/(dashboard)/tasks/actions"
import { formatDateForDisplay } from "@/lib/date-utils"
import type { Comment, User } from "@/app/generated/prisma/client"

type CommentWithAuthor = Comment & {
  author: Pick<User, "id" | "name" | "email">
}

interface TaskCommentsProps {
  taskId: number
  comments: CommentWithAuthor[]
  currentUserId?: number
  taskCreatorId?: number
}

export function TaskComments({ taskId, comments, currentUserId, taskCreatorId }: TaskCommentsProps) {
  const [newComment, setNewComment] = useState("")
  const [isPending, startTransition] = useTransition()

  const handleAddComment = async () => {
    if (!newComment.trim()) return

    startTransition(async () => {
      const result = await addComment(taskId, newComment)
      if (result.success) {
        setNewComment("")
      }
    })
  }

  const handleDeleteComment = async (commentId: number) => {
    startTransition(async () => {
      await deleteComment(commentId)
    })
  }

  const getInitials = (name: string | null) => {
    if (!name) return "??"
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  const canDeleteComment = (comment: CommentWithAuthor) => {
    return currentUserId && (comment.authorId === currentUserId || taskCreatorId === currentUserId)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <MessageCircle className="h-4 w-4" />
        <h4 className="font-semibold">Comments ({comments.length})</h4>
      </div>

      {/* Comments list */}
      <div className="space-y-3">
        {comments.length === 0 ? (
          <p className="text-sm text-muted-foreground">No comments yet. Be the first to comment!</p>
        ) : (
          comments.map((comment) => (
            <Card key={comment.id} className="border-l-4 border-l-blue-200">
              <CardContent className="p-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="text-xs">
                        {getInitials(comment.author.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <p className="text-sm font-medium">{comment.author.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatDateForDisplay(comment.createdAt)}
                        </p>
                      </div>
                      <p className="text-sm text-gray-700 whitespace-pre-wrap">{comment.content}</p>
                    </div>
                  </div>
                  {canDeleteComment(comment) && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteComment(comment.id)}
                      disabled={isPending}
                      className="h-8 w-8 p-0 text-muted-foreground hover:text-red-600"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Add comment form */}
      {currentUserId && (
        <div className="space-y-2">
          <Textarea
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="min-h-[80px] resize-none"
            disabled={isPending}
          />
          <div className="flex justify-end">
            <Button
              onClick={handleAddComment}
              disabled={!newComment.trim() || isPending}
              size="sm"
            >
              <Send className="h-4 w-4 mr-2" />
              {isPending ? "Adding..." : "Add Comment"}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}