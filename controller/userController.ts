import * as db from '../fake-db'

export const getUserByEmailIdAndPassword = async (uname: string, password: string) => {
  const user = await db.getUserByUsername(uname)
  if (user && user.password === password) {
    return user
  } else {
    return null
  }
}

export const getUserById = async (id: number) => {
  const user = await db.getUser(id)
  if (user) {
    return user
  }
  return null
}

export const createUser = async (uname: string, password: string) => {
  let user = await db.getUserByUsername(uname)
  if (user) {
    return null
  } else {
    user = await db.createUser(uname, password)
    return user
  }
}
