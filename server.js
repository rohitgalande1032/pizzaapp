require("dotenv").config()
const express = require("express")
const ejs = require("ejs")
const ejsLayouts = require("express-ejs-layouts")
const path = require("path")
const app = express()
const mongoose = require("mongoose")
const session = require("express-session")
const { config } = require("dotenv")
const mongoDbstore = require("connect-mongo")(session)
const flash = require("express-flash")
const passport = require('passport')
const bodyParser = require('body-parser')  
const Emitter = require('events')
const PORT = process.env.PORT || 3000;

const url = process.env.MONGO_URI || 'mongodb://localhost:menu';
const connection = mongoose.connection

app.use('public', express.static(__dirname , "public"))

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
.then(()=>{
    console.log("Database Connected")
}).catch(err=>{
    console.log(err)
})


//session store
let mongoStore = new mongoDbstore ({
    mongooseConnection: connection,
    collection: 'sessions'
})

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}))

// Emit event
const eventEmitter = new Emitter()
app.set('eventEmitter',eventEmitter)

//session
app.use(session({
    secret: process.env.COOKIE_SECRET,
    resave:false,
    saveUninitialized:false,
    store: mongoStore,
    cookie: {maxAge: 1000* 60 *60* 24}
}))

const initPassport = require("./app/config/passport")
initPassport(passport)
app.use(passport.initialize())
app.use(passport.session())

//express flash
app.use(flash())

app.use(ejsLayouts)
app.set("views",path.join(__dirname,'./resources/views'))
app.set("view engine", "ejs")

app.use(express.json())
app.use(express.urlencoded({extended:false}))

//globel midddleware for addding totalQuantity in cart
app.use((req,res,next) =>{
    res.locals.session = req.session
    res.locals.user = req.user
    next()
})


require("./routes/web")(app)
app.use((req,res)=>{
    res.status(404).send("<h1>404 error, Page not Found.</h1>")
})

const server = app.listen(PORT,()=>{
                console.log(`server created successfully at port ${PORT}`)
            })

//socket.io 
const io = require("socket.io")(server)
io.on("connection", (socket)=>{
    socket.on('join', (roomName)=>{
        // console.log(roomName)
        // socket.join(roomName)
    })
})

eventEmitter.on('orderUpdated', (data) => {
    io.to(`order_${data._id}`).emit('orderUpdated', data)
})

eventEmitter.on('orderPlaced',(data)=>{
    io.to('adminRoom').emit('orderPlaced',data)
})