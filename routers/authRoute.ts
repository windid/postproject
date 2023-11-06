import express from 'express'
import passport from '../middleware/passport'
import { createUser } from '../controller/userController'
const router = express.Router()

router.get('/login', async (req, res) => {
  const errMsg = req.session.messages?.pop()
  res.render('login', { pageTitle: 'Login', errMsg })
})

router.post(
  '/login',
  passport.authenticate('local', {
    successRedirect: '/posts',
    failureRedirect: '/auth/login',
    failureMessage: true,
  })
)

router.get('/logout', (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err)
    }
  })
  res.redirect('/')
})

router.get('/signup', async (req, res) => {
  const errMsg = req.session.messages?.pop()
  res.render('signup', { pageTitle: 'Sign Up', errMsg })
})

router.post('/signup', async (req, res, next) => {
  const { uname, password, password2 } = req.body
  if (!uname || !password || !password2) {
    req.session.messages = ['Please fill out all fields']
    res.redirect('/auth/signup')
  } else if (password !== password2) {
    req.session.messages = ['Passwords do not match']
    res.redirect('/auth/signup')
  } else {
    const user = await createUser(uname, password)
    if (user) {
      passport.authenticate('local', {
        successRedirect: '/posts',
        failureRedirect: '/auth/login',
        failureMessage: true,
      })(req, res, next)
    } else {
      req.session.messages = ['User already exists']
      res.redirect('/auth/signup')
    }
  }
})

export default router
