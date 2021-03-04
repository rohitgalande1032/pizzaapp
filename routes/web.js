const authcontroller = require("../app/http/controllers/authcontroller")
const homeController = require("../app/http/controllers/homeController")
const cartPage = require("../app/http/controllers/custemer/cartController")
const orderController = require("../app/http/controllers/orderController")
const adminOrderController = require("../app/http/controllers/admin/orderController")
const statusOrderController = require("../app/http/controllers/admin/statusController")

//middlewares
const guest = require("../app/http/middlewares/guest")
const auth = require("../app/http/middlewares/auth")
const admin = require('../app/http/middlewares/admins')

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
    app.post("/orders",auth,orderController().orders)

    app.get("/buyers/orders",auth,orderController().index)    

    app.get("/admin/orders",admin,adminOrderController().index)
    
    app.post("/admin/orders/status",statusOrderController().update)

    app.get("/customer/orders/:id",auth,orderController().showStatus)     
}

module.exports = initRoutes;