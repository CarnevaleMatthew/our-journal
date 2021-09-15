const express = require('express');
const router = express.Router();
const {checkAuth, checkGuest} = require('../middleware/auth')
const Entry = require('../models/Entry');
const wrapAsync = require('../helpers/wrapAsync');

// @description   Login/Landing
// @route         GET /
router.get('/', checkGuest, (req, res) => {
    res.render('login', {page: 'login'})
})

// @description   Home Page
// @route         GET /home
router.get('/home', checkAuth, wrapAsync(async(req, res) => {
    try {
    const entries = await Entry.find({user: req.user.id})
    res.render('index', {page: 'Home', entries,
        name: req.user.firstName})
    } catch (error) {
        console.error(error)
    }
  
}))

module.exports = router 