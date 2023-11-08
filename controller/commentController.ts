import exp from 'constants'
import * as db from '../fake-db'

export async function addComment(
  post_id: number,
  user_id: number,
  comment: string,
  reply?: number
) {
  return await db.addComment(post_id, user_id, comment, reply)
}

export async function getComment(comment_id: number) {
  return await db.getComment(comment_id)
}

export async function getComments(postId: number) {
  return await db.getComments(postId)
}

export async function editComment(comment_id: number, description: string) {
  return await db.editComment(comment_id, description)
}

export async function deleteComment(comment_id: number) {
  return await db.deleteComment(comment_id)
}
