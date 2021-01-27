import axios from 'axios'
import Noty from 'noty'
import { initAdmin} from "./admin"

let addToCart = document.querySelectorAll(".add-to-cart")
let cartCounter = document.querySelector("#cartCounter")

function updateCart(pizza){
    axios.post('/update-cart', pizza).then(res=>{
        console.log(res)
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

initAdmin()


