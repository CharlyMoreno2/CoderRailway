const { Router } = require('express')
const { auth } = require('firebase-admin')
const passport = require('passport')
const { users } = require('../usuarios/user')
const { authMiddleware } = require('../middlewares/auth.middleware')
// const { passport } = require('../middlewares/passport')

const authRouter = Router()


//____________________________________________ login _____________________________________ //
authRouter.get('/login', (req, res) => { // lleva la vista del formulario de login
    res.render('login')
})

authRouter.post('/login', passport.authenticate('login', {
    successRedirect: '/',
    failureRedirect: '/api/auth/login',
}))

//____________________________________________ register _____________________________________ //

authRouter.get('/register', (req, res) => {   // devuelve la vista de registro 
    res.render('register')
})

authRouter.post('/register', passport.authenticate('signup', {
    successRedirect: '/api/auth/login',
    failureRedirect: '/api/auth/register',
}))
//____________________________________________ logout _____________________________________ //

authRouter.get('/logout', (req, res) => { // cierra la sesion
    req.session.destroy(err =>{
        if(err) return res.send(err)
        res.send('<h1>Sesion cerrada Adeu</h1>')
    })
})

authRouter.get('/prueba', authMiddleware ,(req, res) => { 
    res.send('Hola entre')
})


module.exports = { 
    authRouter 
}