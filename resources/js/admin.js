import axios from 'axios'
import moment from 'moment'
import Noty from 'noty'
function orderBodyTable() {
    let adminOrder = document.querySelector("#adminOrder")
    let orders = []
    let markup

    axios.get("/admin/orders",{
        headers:{
            "X-Requested-With":"XMLHttpRequest"
        }
    }).then(res =>{
        orders = res.data
        markup = generateMarkup(orders)
        adminOrder.innerHTML = markup
    }).catch(err=>{
        console.log(err)
    })
                  
   

    function generateMarkup(orders){
        return orders.map(order => {
            return `
                <tr>
                <td class="border px-4 py-2 text-green-900">
                    <P>${order._id}</P>
                    <div></div>
                </td>
                <td class="border px-4 py-2">${ order.customerId.name }</td>
                <td class="border px-4 py-2">${order.address}</td>
                <td class="border px-4 py-2">${order.phone}</td>
                <td class="border px-4 py-2">
                    <div class="inline-block relative w-64">
                        <form action="/admin/orders/status" method="POST">
                            <input type='hidden' name="orderId" value=${ order._id }>
                            <select name="status" type="checkbox" onchange='this.form.submit()'
                            class="form-select block appearance-none w-full bg-white border border-gray-400 hover:border-gray-600
                            px-4 py-2 pr-8 rounded shadow focus:outline-none">
                            <option value="order_placed"
                            ${order.status === 'order_placed' ? 'selected' : ''}>
                            Order_placed</option>

                            <option value="confirmed"
                            ${order.status === 'confirmed' ? 'selected' : ''}>
                            Confirmed</option>

                            <option value="prepared"
                            ${order.status === 'prepared' ? 'selected' : ''}>
                            Prepared</option>
                            

                            <option value="delivered"
                            ${order.status === 'delivered' ? 'selected' : ''}>
                            Delivered</option>

                            <option value="completed"
                            ${order.status === 'completed' ? 'selected' : ''}>
                            Completed</option>

                            </select>  
                        
                        </form>    
                        <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                            <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                        </div>                
                    </div>
                </td>
                <td class="border px-4 py-2">
                    ${moment(order.createdAt).format('hh:mm A')}
                </td>    
                </tr> 
            `
        }).join('')
    }

    let socket = io()
    socket.on('orderPlaced', (order) =>{
        new Noty({
            type:'success',
            timeout: 1000,
            text: 'New Order Placed',
            progressBar: false,
        }).show();
        orders.unshift(order)
        orderBodyTable.innerHTML = ''
        orderBodyTable.innerHTML = generateMarkup(orders)
    })
    
}
export default orderBodyTable

