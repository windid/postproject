// const { ensureAuthenticated } = require("../middleware/checkAuth");
import express from 'express'
import * as database from '../controller/postController'
const router = express.Router()

router.get('/list', async (req, res) => {
  const subs = await database.getSubs()
  res.render('subs', { subs, user: req.user, pageTitle: 'Sub Groups' })
})

router.get('/show/:subname', async (req, res) => {
  const orderby = req.query.orderby?.toString() || 'date'
  const posts = await database.getPosts(20, orderby, req.params.subname)
  res.render('sub', {
    posts,
    orderby,
    sub: req.params.subname,
    user: req.user,
    pageTitle: `Sub Group: ${req.params.subname}`,
  })
})

export default router
