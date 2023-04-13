const express = require('express')
const router = express.Router()
const myUser = require('../models/UserSchema')
const { body, validationResult } = require('express-validator');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
const jwt_secret = 'don$don$don$don$mehudon'
const fetchdata = require('../middleware/fetchdata')


router.post('/signup', [
    body('name', 'name must be at least 2 chars long').isLength({ min: 2 }),
    body('email', 'please enter a valid email').isEmail(),
    body('password', 'password must be at least 5 chars long').isLength({ min: 5 })
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    let success = false;
    try {
        let myuser = await myUser.findOne({ email: req.body.email });
        if (myuser) {
            return res.status(400).json({ errors: 'User with this email already exists' })
        }
        const salt = bcrypt.genSaltSync(10);
        const secPassword = bcrypt.hashSync(req.body.password, salt);
        myuser = await myUser.create({
            name: req.body.name,
            email: req.body.email,
            password: secPassword,
        })

        const data = {
            myuser: {
                id: myuser.id
            }
        }
        // console.log(myuser.id);
        success = true
        const token = jwt.sign(data, jwt_secret)
        res.json({ success, token });
    } catch (error) {
        console.error(error.message);
        res.status(500).json('internal server occures')
    }

})


router.post('/login', [
    body('email', 'please enter a valid email').isEmail(),
    body('password', 'password must be at least 5 chars long').isLength({ min: 5 })
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    let success = false
    try {
        const { email, password } = req.body;
        let myuser = await myUser.findOne({ email })
        // console.log(user);
        if (!myuser) {
            return res.status(400).json({ error: "please enter valid credentials" })
        }

        const userPassword = await bcrypt.compare(password, myuser.password)
        if (!userPassword) {
            return res.status(400).json({ error: "please enter valid credentials" })
        }

        const data = {
            myuser: {
                id: myuser.id
            }
        }
        success = true;
        const token = jwt.sign(data, jwt_secret);
        res.json({ success, token });
    } catch (error) {
        console.error(error.message);
        res.status(500).json('internal server occures')
    }
})


router.post('/userdata', fetchdata, async (req, res) => {

    try {
        const userid = req.user.id
        const userdata = await myUser.findById(userid).select('-password');
        res.json(userdata)
    } catch (error) {
        console.error(error.message);
        res.status(500).json('internal server occures')
    }
})

module.exports = router;