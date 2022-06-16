const mongoose = require('mongoose');
const router = require('express').Router();
const User = mongoose.model('User');
const Room = mongoose.model('Room');
const passport = require('passport');
const utils = require('../helpers/utils');

router.get('/search/:roomName', passport.authenticate('jwt', { session: false }), async (req, res) => {

    const rooms = await Room.find({ roomName: {$regex: `.*${req.params.roomName}*.`, '$options': 'i'}});

    if (rooms) {
        res.status(200).json(rooms);
    }
    else {
        res.status(200).json({ msg: 'No rooms found' });
    }
});

router.get('/userRooms', passport.authenticate('jwt', { session: false }), async (req, res, next) => {

    const user = await User.findOne({ _id: req.user.id}, {salt: 0, hash: 0});

    const createdRooms = await Room.find({ createdBy: req.user.id });

    res.status(200).json({ user, createdRooms });
});

router.get('/savedRooms', passport.authenticate('jwt', { session: false }), async (req, res, next) => {
    const user = await User.findOne({ _id: req.user.id}, {salt: 0, hash: 0}).populate({
        path: 'savedRooms',
        model: 'Room'
    });

    res.status(200).json(user);
});

router.post('/rooms', passport.authenticate('jwt', { session: false }), async (req, res, next) => {

    console.log(req.body.roomName);

    const checkRoom = await Room.find({ roomName: req.body.roomName }).count();

    if (!checkRoom) {
        
        const newRoom = new Room({
            roomName: req.body.roomName,
            createdBy: req.user.id
        });

        await newRoom.save();

        res.status(201).json({ created: true });
    }
    else {
        res.json({ created: false });
    }
});

router.patch('/rooms/:roomId', passport.authenticate('jwt', { session: false }), async (req, res, next ) => {

        const checkRoom = await Room.findOne({ _id: req.params.roomId });

        if (checkRoom) {
            
            const user = await User.findOne({ _id: req.user.id });

            user.savedRooms.push(checkRoom._id);

            await user.save();

            res.status(200).json({ added: true })
        }
        else {
            res.json({ added: false });
        }
});


module.exports = router;