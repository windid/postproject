import * as db from '../fake-db'

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
