import axios from 'axios'
import Noty from 'noty'
import orderBodyTable from './admin'
import moment from 'moment'

let addToCart = document.querySelectorAll(".add-to-cart")
let cartCounter = document.querySelector("#cartCounter")

function updateCart(pizza){
    axios.post('/update-cart', pizza).then(res=>{
        cartCounter.innerText = res.data.totalQuantity
        new Noty({
            type:'success',
            timeout: 1000,
            text: 'Item added to cart.',
            progressBar: false,
        }).show();
    }).catch(err =>{
        new Noty({
            type:'error',
            timeout: 1000,
            text: 'Something went wrong.',
            progressBar: false,
        }).show();
    })
}

addToCart.forEach((btn)=>{
    btn.addEventListener('click',(e)=>{
        let pizza = JSON.parse(btn.dataset.pizza)
        updateCart(pizza)
    })
})

const alertMessage = document.getElementById('success-alert')
if(alertMessage){
    setTimeout(() => {
        alertMessage.remove()
    },2000)
}


//make order status dynamic

let statuses = document.querySelectorAll('.status-line')
let hiddenInput = document.querySelector('#hiddenInput') 
let order = hiddenInput ? hiddenInput.value : null
order = JSON.parse(order)
let time = document.createElement('small')

function updateOrderStatus(order){
    statuses.forEach(status=>{
        status.classList.remove('step-completed')
        status.classList.remove('current')
    })
      
    let stepCompleted = true;
    statuses.forEach((status)=>{
        let dataProperty = status.dataset.status
        if (stepCompleted){
            status.classList.add('step-completed')
        }
        
        if(dataProperty === order.status){
            stepCompleted = false;
            time.innerText = moment(order.updatedAt).format('hh:mm A')
            status.appendChild(time)
            
            if(status.nextElementSibling){
                 status.nextElementSibling.classList.add('current')
                
            }
        }
    })
}

updateOrderStatus(order)

const socket = io()
if(order){
    socket.emit('join',`order_${order._id}`)
}

const adminPath = window.location.pathname

if(adminPath.includes('admin')){
    socket.emit('join', 'adminRoom')
    
    orderBodyTable()
}

socket.on('orderUpdated', (data) => {
    const updatedOrder = { ...order }
    updatedOrder.updatedAt = moment().format()
    updatedOrder.status = data.status
    updateOrderStatus(updatedOrder)
    new Noty({
        type:'success',
        timeout: 1000,
        text: 'Order Updated.',
        progressBar: false,
    }).show();
})