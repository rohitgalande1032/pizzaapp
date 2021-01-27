

const axios = require("axios")

function initAdmin() {
    const orderTableBody = document.getElementsByClassName('orderTableBody')

    let orders = []
    let markup

    axios.get('/admin/orders',{
        header: {
            "X-Requested-With": "XMLHttpRequest"
        }
    }).then(res=>{
        orders = res.data
        markup = generateMarkup(orders)
        orderTableBody.innerHTML = markup
    }).catch(err=> {
        console.log(err)
    })

    function generateMarkup(orders){
       return orders.map(order =>{
            return`
            
            <tr>
            <td class="border px-4 py-2 text-green-900">
                <P>${order._id}</P>
                <div>${renderItems(order.item)}</div>
            </td>
            <td class="border px-4 py-2">${order.customerId.name}</td>
            <td class="border px-4 py-2">${order.customerId.phone}</td>
            <td class="border px-4 py-2">${order.address}</td>
            <td class="border px-4 py-2">
                <div class="inline-block relative w-64">
                    <form action="/admin/order/status" method="POST">
                        
                        <select 
                        class="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-600
                        px-4 py-2 pr-8 rounded shadow focus:outline-none">
                        <option value="placed_order"
                        ${order.status === 'order_placed' ? 'selected' : ''}>
                        Placed</option>

                        <option value="confirmed"
                        ${order.status === 'confirmed' ? 'selected' : ''}>
                        Confirmed</option>

                        <option value="prepared"
                        ${order.status === 'prepared' ? 'selected' : ''}>
                        Prepared</option>
                          

                        <option value="delivered"
                        ${order.status === 'delivered' ? 'selected' : ''}>
                        Delivered</option>

                        <option value="completd"
                        ${order.status === 'completed' ? 'selected' : ''}>
                        Completed</option>

                        </select>  
                    
                    </form>
                    <td class="border px-4 py-2">${order.address}</td>

                </div>
            </td>
            
            </tr> 

        `
       }).join('')
    }
    function renderItems(orders){
        let parseItems = Object.values(items)
        return parseItems.map((menuItem) =>{
            return `
            <p>${ menuItem.item.name } - ${ menuItem.qty } pcs </p>
        `
        }).join("")
    }
}

module.exports = initAdmin