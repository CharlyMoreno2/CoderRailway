const authMiddleware = (req, res, next) => {
    if(req.isAuthenticated()) {
        next()
    }
    else{
        res.redirect('/api/auth/login')
    }
}

module.exports = { 
    authMiddleware
}
