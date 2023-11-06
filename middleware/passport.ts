import passport from 'passport'
import { Strategy as LocalStrategy } from 'passport-local'
import { getUserByEmailIdAndPassword, getUserById } from '../controller/userController'

const localLogin = new LocalStrategy(
  {
    usernameField: 'uname',
    passwordField: 'password',
  },
  async (uname: string, password: string, done) => {
    // Check if user exists in databse
    const user = await getUserByEmailIdAndPassword(uname, password)
    // console.log('passport 13: '+ user.uname);
    return user
      ? done(null, user)
      : done(null, false, {
          message: 'Your login details are not valid. Please try again.',
        })
  }
)

passport.serializeUser(function (user, done) {
  console.log('serialize: ' + user.id)
  done(null, user.id)
})

passport.deserializeUser(async function (id: number, done) {
  const user = await getUserById(id)
  if (user) {
    done(null, user)
  } else {
    done({ message: 'User not found' }, null)
  }
})

export default passport.use(localLogin)
