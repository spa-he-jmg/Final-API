const mongoose = require('mongoose');

const RoomSchema = new mongoose.Schema({
    roomName: String,
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User'}
});

module.exports = mongoose.model('Room', RoomSchema);