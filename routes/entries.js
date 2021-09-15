const express = require('express')
const router = express.Router();
const {checkAuth} = require('../middleware/auth')
const Entry = require('../models/Entry');
const wrapAsync = require('../helpers/wrapAsync');
const ExpressError = require('../helpers/ExpressError');
const Joi = require('joi');
const validateEntry = require('../middleware/validateEntry');


// @description   Show New Entries Form
// @route         GET /entries/new
router.get('/new', checkAuth, (req, res) => {
    res.render('new', {page: 'New'})
})

// @description   Create New Entries
// @route         POST /entries
router.post('/', checkAuth, validateEntry, wrapAsync(async(req, res) => {
    const newEntry = new Entry(req.body)
    newEntry.user = req.user._id;
    await newEntry.save()
    req.flash('success', 'Successfully added a new entry!')
    res.redirect('/home')
}))

// @description   Show All Public Entries
// @route         GET /entries
router.get('/', checkAuth, wrapAsync(async(req, res) => {
    const entries = await Entry.find({status: 'public'}).populate('user')
    res.render('entries', {page: 'Public', entries})
}))

// @description   Show Edit Page
// @route         GET /entries/edit/:id
router.get('/edit/:id', checkAuth, wrapAsync(async(req, res) => {
    const {id} = req.params;
    const foundEntry = await Entry.findById(id)

    if(foundEntry.user != req.user.id) {
        res.redirect('/entries')
    } else {
        res.render('edit', {foundEntry, page: 'Edit'})
    }
    
}))

// @description   Show Single Page
// @route         GET /entries/:id
router.get('/:id', checkAuth, wrapAsync(async(req, res) => {
    const {id} = req.params;
    const foundEntry = await Entry.findById(id).populate('user')
    if(!foundEntry) {
        req.flash('error', 'This entry could not be found. It may have been deleted.')
        res.redirect('/entries')
    }
    res.render('show', {foundEntry, page: 'Show'})
}))

// @description   Edit Single Entry
// @route         PUT /entries/:id
router.put('/:id', checkAuth, validateEntry, wrapAsync(async(req, res) => {
    const {id} = req.params
    const entry = await Entry.findByIdAndUpdate(id, req.body)
    res.redirect('/home')
}))

// @description   Delete Single Entry
// @route         DELETE /entries/:id
router.delete('/:id', checkAuth, wrapAsync(async(req, res) => {
    const {id} = req.params;
    const foundEntry = await Entry.findByIdAndDelete(id)
    res.redirect('/home')
}))

// @description   Show Page For User
// @route         GET /entries/userId
router.get('/user/:id', checkAuth, wrapAsync(async(req, res) => {
    const {id} = req.params
    const foundEntry = await Entry.findOne({user: id, status: 'public'}).populate('user')
    const entries = await Entry.find({user: id, status: 'public'}).populate('user')
    res.render('user', {entries, foundEntry, page: 'User'})
}))


module.exports = router