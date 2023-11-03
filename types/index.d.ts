declare global {
  namespace Express {
    export interface User {
      id: number
      uname: string
      password: string
    }
  }
}

export {}
