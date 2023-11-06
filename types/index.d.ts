declare global {
  namespace Express {
    export interface User {
      id: number
      uname: string
      password: string
    }
  }
}

declare module 'express-session' {
  export interface SessionData {
    messages?: string[]
  }
}

export {}
