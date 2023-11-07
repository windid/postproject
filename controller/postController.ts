import * as db from '../fake-db'
import { PostData } from '../model'

export async function getPosts(n = 5, orderby?: string, sub?: string) {
  return await db.getPosts(n, orderby, sub)
}

export async function getPost(id: number) {
  return await db.getPost(id)
}

export async function createPost(
  title: string,
  link: string,
  creator: number,
  description: string,
  subgroup: string
) {
  return await db.addPost(title, link, creator, description, subgroup)
}

export async function editPost(id: number, changes: Partial<PostData> = {}) {
  return await db.editPost(id, changes)
}

export async function deletePost(id: number) {
  return await db.deletePost(id)
}

export async function getSubs() {
  return await db.getSubs()
}

export async function voteForPost(post_id: number, user_id: number, value: number) {
  return await db.voteForPost(post_id, user_id, value)
}
