const backdrop = document.querySelector(".backdrop");
const modal = document.querySelector(".modal");
const closeModalBtn = document.querySelector(".close-modal");
const openCartModal = document.querySelector(".header__cart-icon");

const productDOM = document.querySelector(".product__section");

openCartModal.addEventListener("click", openCartFunction);
closeModalBtn.addEventListener("click", closeCartFunction);
backdrop.addEventListener("click", closeCartFunction);

import { productsData } from "./products.js";

let cart = [];

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
    const addToCard = document.querySelectorAll(".btn__add");
    const buttons = [...addToCard];

    buttons.forEach((btn) => {
      const id = btn.dataset.id;
      const isInCard = cart.find((p) => p.id === id);
      if (isInCard) {
        btn.innerText = "Added To Cart";
        btn.disabled = true;
      }
      btn.addEventListener("click", (event) => {
        console.log(event.target.dataset.id);
      });
    });
  }
}

// Save Products
class Storage {
  static saveProducts(products) {
    localStorage.setItem("products", JSON.stringify(products));
  }
  static getProducts(id) {
    const _products = JSON.parse(localStorage.getItem("products"));
    return _products.find((p) => p.id === id);
  }

  static saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const products = new Products();
  const productsData = products.getProducts();
  const ui = new UI();
  ui.displayProducts(productsData);
  ui.getAddToCardBtns();
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
