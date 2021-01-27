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

const url = "mongodb://localhost:27017/menu"

mongoose.connect(url, {
    useCreateIndex:true, useFindAndModify:true,useCreateIndex:true,useNewUrlParser:true,useUnifiedTopology: true 
})

const connection = mongoose.connection
connection.once('open', ()=>{
    console.log("Database connected!")
}).catch(err=>{
    console.log("Error occured")
})

//session store
let mongoStore = new mongoDbstore ({
    mongooseConnection: connection,
    collection: 'sessions'
})
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))
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

app.use(express.static("public"))
app.use(express.json())
app.use(express.urlencoded({extended:false}))

//globel midddleware for addding totalQuantity in cart
app.use((req,res,next) =>{
    res.locals.session = req.session
    res.locals.user = req.user
    next()
})


require("./routes/web")(app)

app.get("/api", (req,res)=>{
    res.json({
        "message":"Hiii from rohit to the vaishnavi",
        "oopinion":"i love u so much vaishnavi"
    })
})

app.listen(3000,()=>{
    console.log("se