const Order = require("../../../models/order")

function orderConteroller(){
    return {
        index(req,res){
            Order.find({ status: {$ne: 'completed'} },null,{sort:{'cratedAt':-1}}).
            populate('customerId', '-password').exec((err,orders)=>{
                
                if(req.xhr) {
                   return res.json(orders)
                }
                return res.render('admin/order')
            })
        }
    }
}

module.exports = orderConteroller