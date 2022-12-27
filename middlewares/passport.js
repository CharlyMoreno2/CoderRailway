const passport = require('passport');
// const { users } = require('../usuarios/user');
const bCrypt = require('bcrypt');
const LocalStrategy = require('passport-local').Strategy;
const daoMongoDb = require('../daos/usersMongoDB');
const usersMongo = new daoMongoDb();

function createHash(password) {
    return bCrypt.hashSync(
        password,
        bCrypt.genSaltSync(10),
        null);
    }
    
    
    function isValidPassword(user, password) {
        return bCrypt.compareSync(password, user.password);
    }
    
    
    const initPassport = () => {
        passport.use('login', new LocalStrategy( async (username, password, done) => {
            // console.log('login', users)
            // // if (err)
            // //   return done(err);

            let user = await usersMongo.getByUsername(username);
    
            if (!user) {
                console.log('User Not Found with username ' + username);
                return done(null, false);
            }        
    
            if (!isValidPassword(user, password)) {
                console.log('Invalid Password');
                return done(null, false);
            }
    
            return done(null,user)
        })
    
    )

    passport.use('signup', new LocalStrategy({
            passReqToCallback: true
        },
        async (req, username, password, done) => {
            let user = await usersMongo.getByUsername(username)
            if (user) {
                return done(null, false, { message: 'User already exists' })
            }
            
            const usuarioGuardado = await usersMongo.save({
                username:req.body.username,
                password:createHash(req.body.password),
                admin:false
            })
            return done(null, usuarioGuardado)        
        })    
    )
    
    // nos guarda el id del usuario en la session
    passport.serializeUser((user, done) => { 
        console.log(user)
        done(null, user.id);
    })

    passport.deserializeUser((id, done) => { // toma el id que esta en las sessiones 
        let user = usersMongo.getById(id)
        done(null, user)
    })

}

module.exports = { initPassport }