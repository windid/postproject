import express from 'express'
import * as database from '../controller/postController'
import { ensureAuthenticated } from '../middleware/checkAuth'
const router = express.Router()

router.get('/show/:commentid`', async (req, res) => {
  // TODO
})

router.post('/reply/:commentid`', async (req, res) => {
  // TODO
})

router.get('/edit/:commentid`', async (req, res) => {
  // TODO
})

router.post('/edit/:commentid`', async (req, res) => {
  // TODO
})

router.get('/deleteconfirm/:commentid`', async (req, res) => {
  // TODO
})

router.post('/delete/:commentid`', async (req, res) => {
  // TODO
})

export default router
