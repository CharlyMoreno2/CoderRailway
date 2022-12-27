const mongoose = require('mongoose')

const Schema = new mongoose.Schema({
    username:String,
    password:String,
    admin:Boolean
});

const UserModel = mongoose.model("user", Schema);
module.exports = UserModel;