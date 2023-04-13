const express = require('express')
const myNotes = require('../models/NoteSchema')
const fetchdata = require('../middleware/fetchdata')
const router = express.Router()
const { body, validationResult } = require('express-validator');

router.get('/fetchnotes', fetchdata, async (req, res) => {
    const getNotes = await myNotes.find({ user: req.user.id })
    res.json(getNotes)
})


router.post('/addnote', fetchdata, [
    body('title', 'title must be at least 3 chars long').isLength({ min: 3 }),
    body('description', 'description must be at least 5 chars long').isLength({ min: 5 })
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { title, description, tag } = req.body
    try {
        const note = new myNotes({
            title, description, tag,
            user: req.user.id
        })
        console.log(note);
        const addnote = await note.save()
        res.json(addnote)

    } catch (error) {
        console.error(error)
        res.status(500).json('internal server occured')
    }
})


router.put('/updatenote/:id', fetchdata, [
    body('title', 'title must be at least 3 chars long').isLength({ min: 3 }),
    body('description', 'description must be at least 5 chars long').isLength({ min: 5 })
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { title, description, tag } = req.body
    const newNote = {}
    if (title) { newNote.title = title }
    if (description) { newNote.description = description }
    if (tag) { newNote.tag = tag }
    try {

        let note = await myNotes.findById(req.params.id)
        if (!note) {
            return res.status(400).json({ error: 'user not found' });
        }
        if (note.user.toString() !== req.user.id) {
            return res.status(400).json({ error: 'user not found' });
        }

        note = await myNotes.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true })
        res.json(note);

    } catch (error) {
        console.error(error)
        res.status(500).json('internal server occured')
    }
})

router.delete('/deletenote/:id', fetchdata, async (req, res) => {
    try {
        let note = await myNotes.findById(req.params.id)
        if (!note) {
            return res.status(400).json({ error: 'user not found' });
        }
        if (note.user.toString() !== req.user.id) {
            return res.status(400).json({ error: 'user not found' });
        }
        note = await myNotes.findByIdAndDelete(req.params.id);
        res.json({ 'success': 'note has been deleted', note })
    } catch (error) {
        console.error(error)
        res.status(500).json('internal server occured')
    }

})

module.exports = router