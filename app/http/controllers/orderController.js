const Order = require("../../models/order")
const moment = require('moment')

function orderController(){
    return {
        orders(req,res){
            
            const {phone,address} = req.body
            
            if(!phone || !address){
                req.flash('error','All fields are required')
                return res.redirect('/cart')
            }

            const order = new Order({
                customerId : req.user._id,
                items: req.session.cart,
                phone,
                address,
            })

            order.save().then(result=> {
                 Order.populate(result,{path:'customerId'},(err,placeOrder) => {
                    req.flash('success','Order Placed Successfully')
                    delete req.session.cart
                    
                    //emit
                const eventEmitter = req.app.get('eventEmitter')
                eventEmitter.emit('orderPlaced',placeOrder)

                return res.redirect('/buyers/orders')
                })
                if(err){
                    console.log(err)
                }
                
            }).catch(err=>{
                req.flash('error','Something went wrong')
                return res.redirect('/cart')
            })
        },
        async index(req,res){
            const orders = await Order.find({customerId : req.user._id},null,{sort:{'createdAt':-1}})
            res.render('buyers/order',{orders:orders,moment:moment})
        },
        async showStatus(req,res){
            const order =await Order.findById(req.params.id)
            
            if(req.user._id.toString() === order.customerId.toString()){
                return res.render('buyers/status',{order})
            }
            return res.redirect('/')
        }
    }
}

module.exports = orderController