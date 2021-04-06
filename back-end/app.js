const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const restful = require('node-restful')

const server = express()
const mongoose = restful.mongoose

//db
mongoose.Promise = global.Promise
mongoose.connect("mongodb://db/mydb")

//Midlewares
server.use(bodyParser.urlencoded({extended: true}))
server.use(bodyParser.json())
server.use(cors())

//ORM
const User = restful.model('User', {
    name: {type: String, required: true}
})

//RestAPI
User.methods(['get', 'post', 'put', 'delete'])
User.updateOptions({new:true, runValidators:true})

//Register route api
User.register(server, '/users')

//server start
server.listen(3000)