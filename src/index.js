import { getProductsFromJson } from "./request.js";

let allProducts = [];

const getFromLocalStorage = () => {
  return JSON.parse(localStorage.getItem("productos")) || [];
}

let cartProducts = getFromLocalStorage () || [];

const saveLocalStorage = (cartList) => {
  localStorage.setItem("productos", JSON.stringify(cartList));
};


const cardContainer = document.querySelector(".product-container");
const donutConAlcohol =document.getElementById("alcohol");
const donutFrutal = document.getElementById("frutal");
const todasLasDonut = document.getElementById("todas");
const donutConCrema = document.getElementById("crema");
const donutDeChocolate = document.getElementById("chocolate");
const donutTradicional = document.getElementById("tradicional");
const cart = document.querySelector(".btn-cart");
const cartContainer = document.querySelector(".cart-container");
const cartItems = document.querySelector(".item-list");
const totalPrice = document.querySelector(".total-price")
const cartBubble = document.getElementById("cart-account");
const menu = document.querySelector(".btn-menu")
const menuContainer = document.querySelector(".nav-menu")
const nameMessages = document.getElementById("name-msg")
const emailMessages = document.getElementById("email-msg")
const textMesagge = document.getElementById("text-msg")
const formMesagges = document.getElementById("form-for-messages")
const emailSub = document.getElementById("email-sub")
const formSub = document.getElementById("form-for-suscribe")

formMesagges.addEventListener("submit", e => {
  e.preventDefault()
  let regexEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  if(!regexEmail.test(emailMessages.value.trim())){
    alert ("Email inválido. Por favor, ingresa una dirección de correo con formato correcto Ej: ejemplo@dominio.com)");
    return;
  }
  if(nameMessages.value.length <6 ){
    alert (" El nombre es muy corto, minimo 6 caracteres");
    return;
  }
  if (textMesagge.value.trim().length < 10) {
    alert ("El mensaje ingresado es muy corto, ingresa un mensaje de por lo menos 10 caracteres")
    return;
  }
  alert("¡Mensaje enviado con éxito!");
    formMesagges.reset();
});

formSub.addEventListener("submit", e => {
  e.preventDefault()
  let regexEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  if(!regexEmail.test(emailSub.value.trim())){
    alert ("Email inválido. Por favor, ingresa una dirección de correo con formato correcto Ej: ejemplo@dominio.com)");
    return;
  }
  alert("¡Sucripto a Healthy Donuts con éxito!");
    formSub.reset();
})


const toggleEventCart = () => { 
    menuContainer.classList.remove("toggle-menu");
    cartContainer.classList.toggle("toggle-cart");
};

const toggleEventMenu = () => {
    cartContainer.classList.remove("toggle-cart");
    menuContainer.classList.toggle("toggle-menu");
};


const closeMenuIfScroll = () => {
    if (
        menuContainer.classList.contains("toggle-menu")
    ) {
        menuContainer.classList.remove("toggle-menu");
    }
};

const setUpEventListenersBtnToggle = () => {
  cart.addEventListener("click", toggleEventCart)
  menu.addEventListener("click", toggleEventMenu)
}

//funcion para agregar cards al carrito
const displayItemCardCart = (product) =>{
  const { name, price, productImg, quantity} = product;

    return `
    <div class="item">
      <div class="cart-item">
        <div class="img-background">
          <img src="${productImg}" alt="${name}" class="cart-item-img">
        </div>
        <div class="item-info">
          <h3>${name}</h3>
          <span>$${price}</span>
        </div>
      </div>
      <div class="item-add">
        <button id="quantity-up" data-name="${name}">+</button>
        <span>${quantity}</span>
        <button id="quantity-down" data-name="${name}">-</button>
      </div>
    </div>
  `;  
};

const addItem = (e) => {
  if (!e.target.classList.contains("btn-add")) return;
  const { name, price, img } = e.target.dataset;
  const product = cartProducts.find(item => item.name === name);
  if (product) {
    product.quantity++;
  } else {
    cartProducts.push({ name, price: +price, productImg: img, quantity: 1 });
  }
  helperUpdateCart();
  Swal.fire({
    toast: true,
    position: 'top-end',
    icon: 'success',
    title: `¡Dona añadida! 🍩`,
    showConfirmButton: false,
    timer: 1500
  });
};

const setUpEventListenerAddAction = () =>{
  cardContainer.addEventListener("click", addItem);
}

const anyItemInCart = (cartList) => {
  if (cartList.length === 0) {
    cartItems.innerHTML = `
    <div class="item">
      <div class="empty-cart-container">
        <p>Tu carrito está vacío😢</p>
        <p>¡Agregá algunas Healthy Donuts! 🍩</p>
      </div>
    </div>
    `;
    return;
  }
  cartItems.innerHTML = cartList
  .map(product => displayItemCardCart(product))
  .join("");
};

const summary = () => {
  return cartProducts.reduce((acc, cur) => {
    return acc + (cur.price * cur.quantity);
  }, 0);
};

const cartSummary = () => {
  const total = summary();
  totalPrice.innerHTML = `$${total.toFixed(2)}`;
}

const updateCartBubble = () => {
  const totalQuantity = cartProducts.reduce((acc, cur) => acc + cur.quantity, 0);
  cartBubble.textContent = totalQuantity;
};


const helperUpdateCart = () => {
  saveLocalStorage(cartProducts);
  anyItemInCart(cartProducts);
  cartSummary();
  updateCartBubble();
}

const handleQuantityChange = (e) => {
  const { name } = e.target.dataset;
  const { id } = e.target;

  if (!name) return;
  const product = cartProducts.find(item => item.name === name);
  if (!product) return;

  if (id === "quantity-up") {
    product.quantity++;
    return helperUpdateCart(); 
  }

  if (id === "quantity-down") {
    if (product.quantity > 1) {
      product.quantity--;
      helperUpdateCart();
    } else {
      confirmDeleteProduct(name); 
    }
  }
};

const confirmDeleteProduct = (name) => {
  Swal.fire({
    title: '¿Quitar del carrito?',
    text: `¿Estás seguro de que quieres eliminar "${name}" del carrito?`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Confirmar',
    cancelButtonText: 'Cancelar',
    reverseButtons: true 
  }).then((result) => {
    if (result.isConfirmed) {
      cartProducts = cartProducts.filter(item => item.name !== name);
      helperUpdateCart();
    }
  });
};


const setUpEventListenerCartActions = () => {
  cartItems.addEventListener("click", handleQuantityChange);
};


const filterProducts = (category) => {
  if (category === 'todas') {
    renderCards(allProducts);
    return;
  }
  const filtered = allProducts.filter(product => 
    product.category.includes(category)
  );

  renderCards(filtered);
};


const setUpEventListenersFilters = () => {
  donutConAlcohol.addEventListener("click", () => filterProducts('alcohol'));
  donutFrutal.addEventListener("click", () => filterProducts('frutal'));
  donutConCrema.addEventListener("click", () => filterProducts('crema'));
  donutDeChocolate.addEventListener("click", () => filterProducts('chocolate'));
  donutTradicional.addEventListener("click", () => filterProducts('tradicional'));
  todasLasDonut.addEventListener("click", () => filterProducts('todas'));
};


const displayCardsProducts = (product) => {
  const { name, desc, price, productImg, category} = product;

    return `
    <div class="card" id="${category}" >
      <div class="info-img">
        <img src="${productImg}" alt="${name}" class="card-img">
      </div>
      <div class="info-top">
        <h3>${name}</h3>
        <p>${desc}</p>
      </div>
      <div class="info-buy">
        <div class="price">
          <span>$${price}</span>
        </div>
        <button class="btn-add"
        data-name='${name}'
        data-price='${price}'
        data-img='${productImg}'
        >ADD</button>
      </div>
    </div>
  `;  
};


const renderCards = (productsList) => {
    cardContainer.innerHTML = productsList.map(displayCardsProducts).join("");
};


const loadProducts = async () => {
  allProducts = await getProductsFromJson();
  console.log(allProducts);
  renderCards(allProducts);
};


const init = async () => {
    try {
        await loadProducts();
        setUpEventListenersFilters();
        setUpEventListenersBtnToggle();
        window.addEventListener("scroll", closeMenuIfScroll);
        setUpEventListenerAddAction();
        setUpEventListenerCartActions();
        helperUpdateCart();
    } catch (error) {
        console.error("Se rompió el init:", error);
    }

};

init();

