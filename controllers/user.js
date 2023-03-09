const bcrypt = require('bcrypt')
const User = require('../models/users')

const addUser = async (req, res) => {
    try {
        let userData = req.body
        userData.pass = await bcrypt.hash(userData.pass, 10)
        const newUser = new User({ username: userData.username, pass: userData.pass })
        const doc = await newUser.save()
        res.redirect('/login')
    } catch (error) {
        console.log(error)
        res.send(error)
    }
}

const checkUser = async (req, res) => {
    try {
        const user = await User.findOne({ username: req.body.username })
        if (user) {
            //bcrypt compare should take password plian as first arg and password hash as second arg
            const authorization = await bcrypt.compare(req.body.pass, user.pass)
            if (authorization) {
                req.session.loggedIn=true
                req.session.user=user
                res.redirect('/')
            }
            else {
                req.session.loginerr="Invalid username or password"
                res.redirect('/login')
            }
        }
        else {
            req.session.loginerr="Invalid username"
            res.redirect('/login')
        }
    } catch (error) {
        console.log(error)
        res.send(error)
    }
}


module.exports = {
    addUser,
    checkUser
}