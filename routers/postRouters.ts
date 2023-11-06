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
  const errMsg = req.session.messages?.pop()
  res.render('createPosts', { subs, user: req.user, errMsg, pageTitle: 'Create Post', post: {} })
})

router.post('/create', ensureAuthenticated, async (req, res) => {
  const { title, link, description, subgroup } = req.body
  let error
  if (!title) {
    error = 'Please enter a title'
  } else if (!subgroup) {
    error = 'Please select a sub Group'
  } else if (link) {
    // verify link is valid
    try {
      new URL(link)
    } catch (e) {
      error = 'Link URL is invalid'
    }
  }
  if (error) {
    req.session.messages = [error]
    res.redirect('/posts/create')
  } else {
    const userId = (req.user as Express.User).id
    await database.createPost(title, link, userId, description, subgroup)
    res.redirect('/posts')
  }
})

router.get('/show/:postid', async (req, res) => {
  const post = await database.getPost(parseInt(req.params.postid))
  if (!post) {
    return res.status(404).send('Not found')
  }
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
  const userId = (req.user as Express.User).id
  await database.voteForPost(parseInt(req.params.postid), userId, value)
  res.redirect(req.headers.referer || '/posts')
})

export default router
