import express, { Request, Response } from 'express'
const router = express.Router()

router.get('/', async (req: Request, res: Response) => {
  if (req.user) {
    res.redirect('/posts')
  } else {
    res.redirect('/auth/login')
  }
})

export default router
