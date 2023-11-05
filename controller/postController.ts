import * as db from '../fake-db'

export async function getPosts(n = 5, sub?: string) {
  return db.getPosts(n, sub)
}

export async function getPost(id: number) {
  return db.getPost(id)
}

export async function getSubs() {
  return await db.getSubs()
}
