function cartPage(){
    return{
        cart(req,res){
            res.render("buyers/cart")
        },
        updateCart(req,res){

            if (!req.session.cart){
                req.session.cart = {
                    item:{},
                    totalQuantity:0,
                    totalPrice:0
                }
            }
            
            //create new cart
            let cart = req.session.cart
            if (!cart.item[req.body._id]){
                cart.item[req.body._id] = {
                    item:req.body,
                    qty:1
                }
                cart.totalQuantity = cart.totalQuantity + 1
                cart.totalPrice = cart.totalPrice + req.body.price
            }else{
                cart.item[req.body._id].qty = cart.item[req.body._id].qty + 1
                cart.totalQuantity = cart.totalQuantity + 1 
                cart.totalPrice = cart.totalPrice + req.body.price
            }
            return res.json({totalQuantity: req.session.cart.totalQuantity})
        }
    }
}

module.exports = cartPage


