const backdrop = document.querySelector(".backdrop");
const modal = document.querySelector(".modal");
const closeModalBtn = document.querySelector(".close-modal");
const openCartModal = document.querySelector(".header__cart-icon");

const productDOM = document.querySelector(".product__section");
const cartTotal = document.querySelector(".cart-total");
const cartItems = document.querySelector(".header__cart-badge");
const cartModalBody = document.querySelector(".modal__body");
const removeButton = document.querySelector(".btn__modal-delete");

openCartModal.addEventListener("click", openCartFunction);
closeModalBtn.addEventListener("click", closeCartFunction);
backdrop.addEventListener("click", closeCartFunction);

import { productsData } from "./products.js";

let cart = [];
let buttonsDOM = [];
// Get Products
class Products {
  getProducts() {
    return productsData;
  }
}

// Display Products
class UI {
  displayProducts(products) {
    let results = "";
    products.forEach((item) => {
      results += `
         <div class="product">
          <div class="product__img-container">
            <img class="product-image" src=${item.image} alt="product-image" />
          </div>
          <div class="product__body">
            <p class="product__title">${item.title}</p>
            <p class="product__description">
              ${item.description}
            </p>
            <p class="product__price">$ ${item.price}</p>
          </div>
          <div class="product__footer">
            <button class="btn__add" data-id = ${item.id}>Add To Cart</button>
          </div>
        </div>`;
      productDOM.innerHTML = results;
    });
  }
  getAddToCardBtns() {
    const addToCard = [...document.querySelectorAll(".btn__add")];

    buttonsDOM = addToCard;

    addToCard.forEach((btn) => {
      const id = btn.dataset.id;
      const isInCard = cart.find((p) => p.id === parseInt(id));
      if (isInCard) {
        btn.innerText = "In Cart";
        btn.disabled = true;
      }
      btn.addEventListener("click", (event) => {
        event.target.innerText = "In Cart";
        event.target.disabled = true;

        const addedProducts = { ...Storage.getProducts(id), quantity: 1 };

        cart = [...cart, addedProducts];

        Storage.saveCart(cart);

        this.setCartValue(cart);

        this.addCartItem(addedProducts);
      });
    });
  }

  setCartValue(cart) {
    let tempCardItem = 0;

    const totalPrice = cart.reduce((acc, curr) => {
      tempCardItem += curr.quantity;
      return acc + curr.quantity * curr.price;
    }, 0);
    cartTotal.innerText = ` $${totalPrice.toFixed(2)}`;
    cartItems.innerText = tempCardItem;
  }

  addCartItem(cartItem) {
    const emptyMsg = cartModalBody.querySelector(".empty-cart");
    if (emptyMsg) {
      emptyMsg.remove();
    }

    const existingItem = cartModalBody.querySelector(`[data-cart-id="${cartItem.id}"]`);
    if (existingItem) return;

    let finalRes = "";
    finalRes = `     <div class="selected__products">
      <div class="product__img-container">
            <img class="product-image" src=${cartItem.image} alt="" />
          </div>
          <div class="selected__products-body">
            <p class="selected__products-title">${cartItem.title}</p>
            <p class="product-price">$ ${cartItem.price}</p>
            <div class="counter">
              <button class="decrease" data-id=${cartItem.id}>-</button>
              <span class="count">${cartItem.quantity}</span>
              <button class="increase" data-id=${cartItem.id}>+</button>
            </div>
            <button class="delete" data-id=${cartItem.id}>Remove</button>
          </div>
          </div>`;

    cartModalBody.innerHTML += finalRes;
  }

  setupApp() {
    cart = Storage.getCart() || [];
    if (cart.length === 0) {
      this.showEmptyCartMessage();
    } else {
      cart.forEach((cartItem) => this.addCartItem(cartItem));
    }
    this.setCartValue(cart);
  }

  cartLogic() {
    removeButton.addEventListener("click", () => this.clearCart());

    cartModalBody.addEventListener("click", (event) => {
      console.log(event.target);

      if (event.target.classList.contains("increase")) {
        const addQuantity = event.target;

        // get item from card
        const addedItem = cart.find((cItem) => cItem.id === parseInt(addQuantity.dataset.id));

        addedItem.quantity++;
        // update card value
        this.setCartValue(cart);
        // save cart
        Storage.saveCart(cart);

        addQuantity.previousElementSibling.innerText = addedItem.quantity;
      } else if (event.target.classList.contains("decrease")) {
        const subQuantity = event.target;

        const subsItem = cart.find((cItem) => cItem.id === parseInt(subQuantity.dataset.id));
        if (subsItem.quantity === 1) {
          this.removeItem(subsItem.id);
          cartModalBody.removeChild(subQuantity.parentElement.parentElement.parentElement);
        }
        subsItem.quantity--;
        this.setCartValue(cart);
        Storage.saveCart(cart);
        subQuantity.nextElementSibling.innerText = subsItem.quantity;
      } else if (event.target.classList.contains("delete")) {
        const removeItem = event.target;

        const _removedItem = cart.find((cItem) => cItem.id === parseInt(removeItem.dataset.id));
        this.removeItem(_removedItem.id);
        Storage.saveCart(cart);
        cartModalBody.removeChild(removeItem.parentElement.parentElement);
      }
    });
  }

  clearCart() {
    cart.forEach((cItem) => this.removeItem(cItem.id));
    while (cartModalBody.children.length) {
      cartModalBody.removeChild(cartModalBody.children[0]);
    }
    this.showEmptyCartMessage();
    closeCartFunction();
  }

  removeItem(id) {
    cart = cart.filter((cItem) => cItem.id !== id);

    this.setCartValue(cart);

    Storage.saveCart(cart);

    this.getSingleButton(id);
    if (cart.length === 0) this.showEmptyCartMessage();
  }

  getSingleButton(id) {
    const button = buttonsDOM.find((btn) => parseInt(btn.dataset.id) === parseInt(id));
    button.innerText = "Add To Cart";
    button.disabled = false;
  }
  showEmptyCartMessage() {
    const hasItems = cartModalBody.querySelectorAll(".selected__products").length > 0;
    if (!hasItems) {
      cartModalBody.innerHTML = `<p class="empty-cart">Your cart is empty.</p>`;
    }
  }
}

// Save Products
class Storage {
  static saveProducts(products) {
    localStorage.setItem("products", JSON.stringify(products));
  }
  static getProducts(id) {
    const _products = JSON.parse(localStorage.getItem("products"));
    return _products.find((p) => p.id === parseInt(id));
  }

  static saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
  }
  static getCart() {
    return JSON.parse(localStorage.getItem("cart"));
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const products = new Products();
  const productsData = products.getProducts();
  const ui = new UI();
  ui.setupApp();
  ui.displayProducts(productsData);
  ui.getAddToCardBtns();
  ui.cartLogic();
  Storage.saveProducts(productsData);
});

function openCartFunction() {
  backdrop.classList.add("show");
  modal.classList.add("show");
}

function closeCartFunction() {
  modal.classList.remove("show");
  backdrop.classList.remove("show");
}
