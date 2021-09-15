module.exports = {
    checkAuth: function (req, res, next) {
        if (req.isAuthenticated()) {
            return next()
        } else {
            res.redirect('/')
        }
    },
    checkGuest: function (req, res, next) {
        if (req.isAuthenticated()) {
            res.redirect('/home')
        } else {
            return next()
        }
    }
}