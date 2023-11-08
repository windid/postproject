import express from 'express'
import * as database from '../controller/postController'
const router = express.Router()
import { ensureAuthenticated } from '../middleware/checkAuth'

router.get('/', async (req, res) => {
  const orderby = req.query.orderby?.toString() || 'date'
  const posts = await database.getPosts(20, orderby)
  res.render('posts', { posts, user: req.user, orderby, pageTitle: 'Home' })
})

router.get('/create', ensureAuthenticated, async (req, res) => {
  const subs = await database.getSubs()
  const errMsg = req.session.messages?.pop()
  res.render('createPost', { subs, user: req.user, errMsg, pageTitle: 'Create Post', post: {} })
})

router.post('/create', ensureAuthenticated, async (req, res) => {
  const { title, link, description, subgroup } = req.body
  let errMsg
  if (!title) {
    errMsg = 'Please enter a title'
  } else if (!subgroup) {
    errMsg = 'Please select a sub Group'
  } else if (link) {
    // verify link is valid
    try {
      new URL(link)
    } catch (e) {
      errMsg = 'Link URL is invalid'
    }
  } else if (!description && !link) {
    errMsg = 'Please enter a description or a link'
  }

  if (errMsg) {
    const subs = await database.getSubs()
    const post = { title, link, description, subgroup }
    res.render('createPost', { subs, user: req.user, errMsg, pageTitle: 'Create Post', post })
  } else {
    const userId = (req.user as Express.User).id
    const post = await database.createPost(title, link, userId, description, subgroup)
    res.redirect(`/posts/show/${post.id}`)
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
  const post = await database.getPost(parseInt(req.params.postid))
  if (!post) {
    return res.status(404).send('Not found')
  }
  const errMsg = req.session.messages?.pop()
  res.render('editPost', { post, user: req.user, errMsg, pageTitle: 'Edit Post' })
})

router.post('/edit/:postid', ensureAuthenticated, async (req, res) => {
  const post = await database.getPost(parseInt(req.params.postid))
  if (!post) {
    return res.status(404).send('Not found')
  }

  const { title, link, description, subgroup } = req.body
  let errMsg
  if (!title) {
    errMsg = 'Please enter a title'
  } else if (!subgroup) {
    errMsg = 'Please enter sub group name'
  } else if (link) {
    // verify link is valid
    try {
      new URL(link)
    } catch (e) {
      errMsg = 'Link URL is invalid'
    }
  } else if (!description && !link) {
    errMsg = 'Please enter a description or a link'
  }

  const change = { title, link, description, subgroup }

  if (errMsg) {
    res.render('editPost', {
      user: req.user,
      errMsg,
      pageTitle: 'Create Post',
      post: { ...post, ...change },
    })
  } else {
    await database.editPost(post.id, change)
    res.redirect(`/posts/show/${post.id}`)
  }
})

router.get('/deleteconfirm/:postid', ensureAuthenticated, async (req, res) => {
  const post = await database.getPost(parseInt(req.params.postid))
  if (!post) {
    return res.status(404).send('Not found')
  }
  if (post.creator.id !== req.user?.id) {
    return res.status(403).send('Forbidden')
  }
  res.render('deletePost', { post, user: req.user, pageTitle: 'Delete Post' })
})

router.post('/delete/:postid', ensureAuthenticated, async (req, res) => {
  const post = await database.getPost(parseInt(req.params.postid))
  if (!post) {
    return res.status(404).send('Not found')
  }
  if (post.creator.id !== req.user?.id) {
    return res.status(403).send('Forbidden')
  }
  const sub = post.subgroup
  await database.deletePost(post.id)
  res.redirect(`/subs/show/${sub}`)
})

router.post('/vote/:postid', ensureAuthenticated, async (req, res) => {
  const value = parseInt(req.body.setvoteto)
  const userId = req.user?.id || 0
  await database.voteForPost(parseInt(req.params.postid), userId, value)
  res.status(200).send('OK')
})

export default router
