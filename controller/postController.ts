import * as db from '../fake-db'

export async function getPosts(n = 5, sub?: string) {
  return db.getPosts(n, sub)
}

export async function getPost(id: number) {
  return db.getPost(id)
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

export async function getSubs() {
  return await db.getSubs()
}

export async function voteForPost(post_id: number, user_id: number, value: number) {
  return await db.voteForPost(post_id, user_id, value)
}
