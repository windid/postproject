// @ts-nocheck
import express from 'express'
import * as database from '../controller/postController'
const router = express.Router()
import { ensureAuthenticated } from '../middleware/checkAuth'

router.get('/', async (req, res) => {
  const posts = await database.getPosts(20)
  res.render('posts', { posts, user: req.user, pageTitle: 'Home' })
})

router.get('/create', ensureAuthenticated, async (req, res) => {
  const subs = await database.getSubs()
  res.render('createPosts', { subs, user: req.user, pageTitle: 'Create Post' })
})

router.post('/create', ensureAuthenticated, async (req, res) => {
  // ⭐ TODO
})

router.get('/show/:postid', async (req, res) => {
  const post = await database.getPost(req.params.postid)
  res.render('individualPost', { post, user: req.user, pageTitle: post.title })
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

router.get('/vote/:postid/:direction', ensureAuthenticated, async (req, res) => {
  const value = req.params.direction === 'up' ? 1 : -1
  await database.voteForPost(parseInt(req.params.postid), req.user.id, value)
  res.redirect(req.headers.referer)
})

export default router
