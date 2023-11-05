// const { ensureAuthenticated } = require("../middleware/checkAuth");
import express from 'express'
import * as database from '../controller/postController'
const router = express.Router()

router.get('/list', async (req, res) => {
  const subs = await database.getSubs()
  res.render('subs', { subs, user: req.user })
})

router.get('/show/:subname', async (req, res) => {
  const posts = await database.getPosts(20, req.params.subname)
  res.render('sub', { posts, sub: req.params.subname, user: req.user })
})

export default router
