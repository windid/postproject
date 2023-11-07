import express from 'express'
import * as database from '../controller/commentController'
import { ensureAuthenticated } from '../middleware/checkAuth'
const router = express.Router()

router.get('/show/:commentid', async (req, res) => {
  const comment = database.getComment(parseInt(req.params.commentid))
  if (!comment) {
    res.status(404).send('Comment not found')
  } else {
    res.status(200).json(comment)
  }
})

router.post('/reply/:commentid', ensureAuthenticated, async (req, res) => {
  // TODO
})

router.get('/edit/:commentid', ensureAuthenticated, async (req, res) => {
  // TODO
})

router.post('/edit/:commentid', ensureAuthenticated, async (req, res) => {
  // TODO
})

router.get('/deleteconfirm/:commentid', ensureAuthenticated, async (req, res) => {
  // TODO
})

router.post('/delete/:commentid', ensureAuthenticated, async (req, res) => {
  // TODO
})

export default router
