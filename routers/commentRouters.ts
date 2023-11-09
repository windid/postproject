import express from 'express'
import * as database from '../controller/commentController'
import { getPost } from '../controller/postController'
import { ensureAuthenticated } from '../middleware/checkAuth'
const router = express.Router()

router.get('/list/:postid', async (req, res) => {
  const comments = await database.getComments(parseInt(req.params.postid))
  res.status(200).json(comments)
})

router.post('/create/:postid', ensureAuthenticated, async (req, res) => {
  const post = await getPost(parseInt(req.params.postid))
  if (!post) {
    return res.status(404).json({ error: 'Not found' })
  }
  const { comment, reply } = req.body
  const userId = req.user?.id || 0
  const postId = parseInt(req.params.postid)
  const result = await database.addComment(postId, userId, comment, reply)
  res.status(200).json(result)
})

router.post('/edit/:commentid', ensureAuthenticated, async (req, res) => {
  const comment = await database.getComment(parseInt(req.params.commentid))
  if (!comment) {
    return res.status(404).json({ error: 'Not found' })
  }
  if (comment.creator !== req.user?.id) {
    return res.status(403).json({ error: 'Forbidden' })
  }
  const { description } = req.body
  await database.editComment(comment.id, description)
  res.status(200).send('')
})

router.post('/delete/:commentid', ensureAuthenticated, async (req, res) => {
  const comment = await database.getComment(parseInt(req.params.commentid))
  if (!comment) {
    return res.status(404).json({ error: 'Not found' })
  }
  if (comment.creator !== req.user?.id) {
    return res.status(403).json({ error: 'Forbidden' })
  }
  await database.deleteComment(comment.id)
  res.status(200).send('')
})

export default router
