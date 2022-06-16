const mongoose = require('mongoose');
const router = require('express').Router();
const User = mongoose.model('User');
const passport = require('passport');
const utils = require('../helpers/utils');

router.get('/test', function(req, res, next) {
    res.send('Messaging api is working!');
});

router.get('/authorized', passport.authenticate('jwt', { session: false }), (req, res, next) => {
    res.status(200).json({ success: true, msg: "You are successfully authorized!"});
});

router.post('/login', function(req, res, next) {
    User.findOne({ username: req.body.username })
        .then((user) => {
            if (!user) {
                return res.status(401).json({ success: false,  msg: "could not find user"});
            }

            const isValid = utils.validatePassword(req.body.password, user.hash, user.salt);

            if (isValid) {
                const tokenObject = utils.issueJWT(user);

                res.cookie('jwt',
                tokenObject, {
                    httpOnly: true,
                    secure: false,
                    maxAge: 3600000
                })
                .status(200)
                .json({
                    message: 'Successfully logged in!'
                });
                
            } else {
                res.status(401).json({ success: false, msg: "You entered the wrong password" });
            }
        })
        .catch((err) => {
            next(err);
        });
});

router.get('/logout', (req, res) => {
    if (req.cookies['jwt']) {
        res
        .clearCookie('jwt')
        .status(200)
        .json({
            message: 'You have been logged out'
        })
    } else {
        res.status(401).json({
            error: 'Invalid jwt'
        })
    }
})

router.post('/register', function(req, res, next) {

    const saltHash = utils.genPassword(req.body.password);

    const salt = saltHash.salt;
    const hash = saltHash.hash;

    const newUser = new User({
        username: req.body.username,
        hash: hash,
        salt: salt
    });

    try {
        newUser.save()
            .then((user) => {
                res.status(201).json({ success: true, user: user });
            });
    } catch (err) {
        res.status(406).json({ success: false, msg: err});
    }
});

module.exports = router;