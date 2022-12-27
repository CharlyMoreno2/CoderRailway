const express = require('express')
const logger = require('morgan')
const session = require('express-session')
const cookieParser = require('cookie-parser')
require('dotenv').config()

const handlebars = require('express-handlebars')
const PORT = process.env.PORT || 8080
const { authRouter } = require('./routes/auth.routes.js')
const { authMiddleware } = require('./middlewares/auth.middleware')
//_____________________________________________ mongo para session _____________________________________ //
const MongoStore = require('connect-mongo')
const advancedOptions = { useNewUrlParser: true, useUnifiedTopology: true }
//____________________________________________________________________________________________________ //
const passport = require('passport')
const { initPassport } = require('./middlewares/passport.js')
//____________________________________________________________________________________________________ //

const app = express()

 /////////////////////// configuracion de handlebars /////////////////////////
 app.engine(
    "hbs",
    handlebars.engine({
        extname: ".hbs",
        defaultLayout: 'index.hbs',
    })
)
app.set("view engine", "hbs")
app.set("views", "./views")

//////////////  middleware  ///////////////////////
app.use(session({
    secret: process.env.SECRET,    
    store: MongoStore.create({
        mongoUrl: process.env.MONGOURL,
        mongoOptions: advancedOptions,
    }),
    resave: true, 
    saveUninitialized: true,
    cookie:{
        maxAge:60 * 1000
    }
}))

app.use(cookieParser(process.env.SECRET))

initPassport()
app.use(passport.initialize())
app.use(passport.session())

app.use(express.static('public'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(logger('dev'))

app.use('/api/auth', authRouter)

app.get('/', authMiddleware,(req, res) => {
    res.render('principal')
})

app.get('/privado', authMiddleware,(req, res) => {
    res.send('Contenido Privado')
})

const server = app.listen(PORT,()=>{
    console.log(`Listening on port ${PORT}`)
})

server.on("error",err=>console.log(err));


