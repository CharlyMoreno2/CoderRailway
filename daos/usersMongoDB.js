const mongoose = require("mongoose");
require('dotenv').config()

// Set up default mongoose connection
const mongoDB = process.env.MONGOURL;
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });

// Get the default connection
const db = mongoose.connection;

// Bind connection to error event (to get notification of connection errors)
db.on("error", console.error.bind(console, "MongoDB connection error:"));

const usersModels = require('../models/users.models')

class ContenedorMongoDb{
    constructor(){
        this.collection = usersModels;
    }

    async getAll(){
        try{
            const data = await this.collection.find();
            return data;
        }
        catch(err){
            console.log(err)
        }
    }

    async getById(id){
        try{
            const data = await this.collection.findOne({_id:id})
            return data
        }
        catch(err){
            console.log(err)
        }
    }

    async save(objeto) {
        try{
            const doc = await this.collection.create(objeto);
            return doc; 
        }
        catch(err){
            console.log(err)
        }
    }

    async getByUsername(username){
        try{
            const data = await this.collection.findOne({username:username})
            return data
        }
        catch(err){
            console.log(err)
        }
    }

}


module.exports = ContenedorMongoDb;