// @ts-nocheck
import express from 'express'
import * as database from '../controller/postController'
const router = express.Router()
import { ensureAuthenticated } from '../middleware/checkAuth'

router.get('/', async (req, res) => {
  const posts = await database.getPosts(20)
  res.render('posts', { posts, user: req.user })
})

router.get('/create', ensureAuthenticated, async (req, res) => {
  const subs = await database.getSubs()
  res.render('createPosts', { subs, user: req.user })
})

router.post('/create', ensureAuthenticated, async (req, res) => {
  // ⭐ TODO
})

router.get('/show/:postid', async (req, res) => {
  const post = await database.getPost(req.params.postid)
  res.render('individualPost', { post, user: req.user })
})

router.get('/edit/:postid', ensureAuthenticated, async (req, res) => {
  // ⭐ TODO
})

router.post('/edit/:postid', ensureAuthenticated, async (req, res) => {
  // ⭐ TODO
})

router.get('/deleteconfirm/:postid', ensureAuthenticated, async (req, res) => {
  // ⭐ TODO
})

router.post('/delete/:postid', ensureAuthenticated, async (req, res) => {
  // ⭐ TODO
})

router.post('/comment-create/:postid', ensureAuthenticated, async (req, res) => {
  // ⭐ TODO
})

export default router
