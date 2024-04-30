const menu = document.getElementById("menu")
const cartBtn = document.getElementById("cart-btn")
const cartModal = document.getElementById("cart-modal")
const cartItemsContainer = document.getElementById("cart-items")
const cartTotal = document.getElementById("cart-total")
const checkoutBtn = document.getElementById("checkout-btn")
const closeModalBtn = document.getElementById("close-modal-btn")
const cartCounter = document.getElementById("cart-count")
const addressInput1 = document.getElementById("address1")
const addressInput2 = document.getElementById("address2")
const addressInput3 = document.getElementById("address3")
const addressWarn = document.getElementById("address-warn")

const addCartBtn = document.querySelector(".add-to-cart-btn")

console.log('quase la em ✔')
// closeModalBtn.addEventListener("click", () => {})

let cart = [];

// Abrir o modal do carrinho
cartBtn.addEventListener("click", () => {
    updateCartModal();
    cartModal.style.display = 'flex'
})

// Fechar modal quando eu clicar fora
cartModal.addEventListener("click", (event) => {
    if (event.target === cartModal) {
        cartModal.style.display = 'none'
    }
})

closeModalBtn.addEventListener("click", () => {
    cartModal.style.display = 'none'
})

// Adicionar item ao carrinho
menu.addEventListener("click", (event) => {
    let parentButton = event.target.closest(".add-to-cart-btn")
    if (parentButton) {
        const name = parentButton.getAttribute("data-name")
        const price = parseFloat(parentButton.getAttribute("data-price"))

        addToCart(name, price)
    }

})

// função para adicionar no carrinho
function addToCart(name, price) {
    const existingItem = cart.find(item => item.name === name)

    if (existingItem) {
        //Se o item ja existe, adiciona mais 1
        existingItem.quantity += 1;

    } else {

        cart.push({
            name,
            price,
            quantity: 1,
        })

    }

    updateCartModal()
}

// Atualiza carrinho
function updateCartModal() {
    cartItemsContainer.innerHTML = "";
    let total = 0;

    cart.forEach(item => {
        const cartItemElement = document.createElement("div");
        cartItemElement.classList.add("flex", "justify-between", "mb-4", "flex-col")

        cartItemElement.innerHTML = `
            <div class="flex items-center justify-between">
                <div>
                    <p class="font-medium">${item.name}</p>
                    <p>Qtd: ${item.quantity}</p>
                    <p class="font-medium mt-2">R$ ${item.price.toFixed(2)}</p>
                </div>

                <button class="mr-1 remove-from-cart-btn hover:scale-110 duration-300" data-name="${item.name}">
                Remover <i class="fa fa-trash"></i>
                </button>
        
            </div>
        `

        total += item.price * item.quantity;

        cartItemsContainer.appendChild(cartItemElement)

    })

    cartTotal.textContent = total.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });

    // cartCounter.innerHTML =  cart.length;
    // Para deixar o numero de (veja carrinho) com a quantidade de itens que tem dentro 

}

// O tanto de vezes que clicou para add item ao carrinho em veja meu carrinho
let car = 0;

menu.addEventListener("click", (event) => {
    let vercart = event.target.closest(".add-to-cart-btn")
    if (vercart) {
        cartCounter.innerHTML = (car += 1)
    }   
})

cartItemsContainer.addEventListener("click", (event) => {
    let removecart = event.target.closest(".remove-from-cart-btn")
    if (removecart) {
        cartCounter.innerHTML = (car -= 1)
    }
    
})

// remove-from-cart-btn.addEventListener("click", )

//Funçao para remover o item do carrinho
cartItemsContainer.addEventListener("click", function (event){
    if (event.target.classList.contains("remove-from-cart-btn")) {
    const name = event.target.getAttribute("data-name")
    
        removeItemCart(name);
    }
})

function removeItemCart(name) {
    const index = cart.findIndex(item => item.name === name);

    if (index !== -1) {
        const item = cart[index];

        if (item.quantity > 1) {
            item.quantity -= 1;
            updateCartModal();
            return;
        }

        cart.splice(index, 1);
        updateCartModal();
    }
}

//Pegar endereço de entrega dentro do input
addressInput.addEventListener("input", function (event) {
    let inputValue = event.target.value;

    if (inputValue !== "") {
        addressInput.classList.remove("border-red-500")
        addressWarn.classList.add("hidden")
    }

})

// Ver se tem algo dentro do input e finalizar pedido
checkoutBtn.addEventListener("click", function () {

    const isOpen = checkRestaurantOpen();
    if (!isOpen) {
        
        // Alerta top
        Toastify({
            text: "Putz, o restaurante está fechado!",
            duration: 3000,
            close: true,
            gravity: "top", // `top` or `bottom`
            position: "right", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
              background: "linear-gradient(to right, rgb(153 27 27), rgb(239 68 68))",
            },
            onClick: function(){} // Callback after click
          }).showToast();

        return;
    }

    if (cart.length === 0) return;
    if(addressInput1.value === ""){
        addressWarn.classList.remove("hidden")
        addressInput1.classList.add("border-red-500")
        return;
    }
    if (cart.length === 0) return;
    if(addressInput2.value === ""){
        addressWarn.classList.remove("hidden")
        addressInput2.classList.add("border-red-500")
        return;
    }
    if (cart.length === 0) return;
    if(addressInput3.value === ""){
        addressWarn.classList.remove("hidden")
        addressInput3.classList.add("border-red-500")
        return;
    }

    //Enviar o pedido para api whats
    const cartItems = cart.map((item) => {
        return (
            `\n *Pedido Nome:* \n ${item.name} \n *Quantidade:* ${item.quantity}\n *Preço:* R$${item.price}\n `  
        )
    }).join("")

    const message = encodeURIComponent(cartItems)
    const phone = "+5579998416681"

    window.open(`https://wa.me/${phone}?text=${message} Nome: ${addressInput1.value}, "_blank"  Endereço: ${addressInput2.value}, "_blank"
    Complemento: ${addressInput3.value}`, "_blank")

    // cart.length = 0;
    cart = [];
    cartCounter.innerHTML = (car -= car);
    updateCartModal();

})

// Verificar a hora a manipular o card horário
function checkRestaurantOpen() {
    const data = new Date();
    const hora = data.getHours();
    return hora >= 7 && hora < 23; 
    //true = restaurante está aberto
}

const spanItem = document.getElementById("date-span")
const isOpen = checkRestaurantOpen();

if (isOpen) {
    spanItem.classList.remove("bg-red-700")
    spanItem.classList.add("bg-green-600")
} else {
    spanItem.classList.remove("bg-green-600")
    spanItem.classList.add("bg-red-700")
}