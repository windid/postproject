import * as db from '../fake-db'

export async function getComment(comment_id: number) {
  return db.getComment(comment_id)
}

export async function getComments(post_id: number) {
  return db.getComments(post_id)
}
