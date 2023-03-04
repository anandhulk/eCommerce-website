const bcrypt = require('bcrypt')
const User = require('../models/users')

const addUser = async (req, res) => {
    try {
        let userData = req.body
        console.log(userData)
        userData.pass = await bcrypt.hash(userData.pass, 10)
        const newUser = new User({ username: userData.username, pass: userData.pass })
        const doc = await newUser.save()
        res.send('user ' + doc.username + ' added')
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
                console.log('login success')
                res.send('login success')
            }
            else {
                res.send('login failed' + authorization)
            }
        }
        else {
            res.send('login failed no user with username: ' + req.body.username)
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