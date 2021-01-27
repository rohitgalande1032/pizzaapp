const authcontroller = require("../app/http/controllers/authcontroller")
const homeController = require("../app/http/controllers/homeController")
const cartPage = require("../app/http/controllers/custemer/cartController")
const orderConteroller = require("../app/http/controllers/orderController")

const guest = require("../app/http/middlewares/guest")
const auth = require("../app/http/middlewares/auth")

const adminOrderConteroller = require("../app/http/controllers/admin/orderController")


function initRoutes(app){
    app.get("/",homeController().index)
    
    app.get("/login",guest,authcontroller().login)

    app.post('/login',authcontroller().postLogin)
    
    app.get("/register",guest,authcontroller().register)

    app.post("/register",authcontroller().postRegister)
    
    app.get("/cart",cartPage().cart)

    app.post("/update-cart",cartPage().updateCart)

    app.post("/logout",authcontroller().logout)

    // order store
    app.post("/orders",auth,orderConteroller().orders)

    app.get("/buyers/orders",auth,orderConteroller().index)    

    
    app.get("/admin/orders",adminOrderConteroller().index)
    
}

module.exports = initRoutes;