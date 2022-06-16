const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
        username: String,
        hash: String,
        salt: String,
        savedRooms: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Room'}]
    });

module.exports = mongoose.model('User', UserSchema,);