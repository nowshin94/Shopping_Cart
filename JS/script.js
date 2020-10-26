let product_cart = document.querySelectorAll('.add-to-cart');
let prd_container = document.querySelector('.prod_list');
let whole = document.querySelector('.prd-container');
let clear_btn = document.querySelector('#clear_list');

prd_container.addEventListener('click', eventHandler);
clear_btn.addEventListener('click', clearList);

let products = [];

for (let x = 0; x < product_cart.length; x++) {
  products[x] = {
    name: document
      .querySelector(`.cart${x + 1}`)
      .parentElement.getAttribute('name'),
    price: document
      .querySelector(`.cart${x + 1}`)
      .parentElement.getAttribute('value'),
    cart: 0,
  };
}

for (let x = 0; x < product_cart.length; x++) {
  product_cart[x].addEventListener('click', addProduct);
  product_cart[x].addEventListener('click', reload);

  function addProduct(e) {
    productCount(products[x]);
    total(products[x]);
    e.preventDefault();
  }
}

function reload() {
  window.location.reload();
}

function productCount(product) {
  let count = parseInt(localStorage.getItem('productCount'));
  if (count) {
    localStorage.setItem('productCount', count + 1);
  } else {
    localStorage.setItem('productCount', 1);
  }
  setItemInLS(product);
}

function setItemInLS(product) {
  let ci = localStorage.getItem('productsInCart');
  ci = JSON.parse(ci);

  // if(item.cart !=0){
  if (ci != null) {
    if (ci[product.name] == undefined) {
      ci = {
        ...ci,
        [product.name]: product,
      };
    }
    ci[product.name].cart += 1;
  } else {
    product.cart = 1;
    ci = {
      [product.name]: product,
    };
  }
  // }
  localStorage.setItem('productsInCart', JSON.stringify(ci));
}

function total(product) {
  let cost = localStorage.getItem('total');

  if (cost != null) {
    cost = parseInt(cost);
    product.price = parseInt(product.price);

    localStorage.setItem('total', cost + product.price);
  } else {
    localStorage.setItem('total', product.price);
  }
}

function cart() {
  let ci = localStorage.getItem('productsInCart');
  ci = JSON.parse(ci);
  let cost = localStorage.getItem('total');

  if (ci && prd_container) {
    prd_container.innerHTML = '';
    Object.values(ci).map((item) => {
      if (item.cart != 0) {
        prd_container.innerHTML += `
      <div class = "hello row text-center" data-id= "${item.name}">
      <div class = "prd col-md-3">
       <a href="#">✘</a>
       <span>${item.name}</span>
            </div>
            <div class= "quantity col-md-3">
            <input type="button" up="#" class="increase" value="＋"/>
            <span id= "quantity">${item.cart}</span>
            <input type="button" down="#" class="decrease" value="－"/>
            </div>
            <div class= "price col-md-3">
            <span>৳</span><span>${item.price}</span>
            </div>
            
            <div class= "total col-md-3">
            <span>৳${parseInt(item.cart) * parseInt(item.price)} tk</span>
            </div>
            </div>
            
      `;
      }
    });

    prd_container.innerHTML += `
    <div class = "totalInCart text-center">
    <h4 class="ticTitle">Your Total</h4>
    <h4 class="tic">৳${cost}</h4>
    </div>
    `;
  }
}

function eventHandler(e) {
  let count = localStorage.getItem('productCount');
  if (e.target.hasAttribute('up')) {
    increaseItem(e);
  } else if (e.target.hasAttribute('down')) {
    decreaseItem(e);
  } else if (e.target.hasAttribute('href')) {
    removeProduct(e);
    cart();
  } else {
    cart();
  }
}

function increaseItem(e) {
  let ci = localStorage.getItem('productsInCart');
  ci = JSON.parse(ci);

  let count = parseInt(localStorage.getItem('productCount'));
  let cost = localStorage.getItem('total');

  let element1 = e.target.parentNode.childNodes[3].innerHTML;
  let element0 =
    e.target.parentElement.parentElement.childNodes[1].childNodes[3].innerHTML;
  let pr =
    e.target.parentElement.parentElement.childNodes[5].childNodes[2].innerHTML;
  pr = parseInt(pr);

  element1 = parseInt(element1);
  element1 = element1 + 1;
  element1 = element1.toString();
  e.target.parentNode.childNodes[3].innerHTML = element1;

  localStorage.setItem('productCount', count + 1);

  Object.values(ci).map((item, index, arr) => {
    if (arr[index].name == element0) {
      arr[index].cart += 1;
    }
  });
  localStorage.setItem('productsInCart', JSON.stringify(ci));

  if (cost != null) {
    cost = parseInt(cost);

    localStorage.setItem('total', cost + pr);
  }
  cart();
}

function decreaseItem(e) {
  let ci = localStorage.getItem('productsInCart');
  ci = JSON.parse(ci);

  let count = parseInt(localStorage.getItem('productCount'));
  let cost = localStorage.getItem('total');

  let element1 = e.target.parentNode.childNodes[3].innerHTML;
  let element0 =
    e.target.parentElement.parentElement.childNodes[1].childNodes[3].innerHTML;

  let pr =
    e.target.parentElement.parentElement.childNodes[5].childNodes[2].innerHTML;
  pr = parseInt(pr);
  element1 = parseInt(element1);

  if (element1 != 1) {
    element1 = element1 - 1;
    element1 = element1.toString();
    e.target.parentNode.childNodes[3].innerHTML = element1;

    localStorage.setItem('productCount', count - 1);

    Object.values(ci).map((item, index, arr) => {
      if (arr[index].name == element0) {
        arr[index].cart -= 1;
      }
    });
    localStorage.setItem('productsInCart', JSON.stringify(ci));

    if (cost != null) {
      cost = parseInt(cost);

      localStorage.setItem('total', cost - pr);
    }
    cart();
  } else {
    Object.values(ci).map((item, index, arr) => {
      if (arr[index].name == element0) {
        delete ci[arr[index].name];
        let count_less = count - arr[index].cart;

        localStorage.setItem('productsInCart', JSON.stringify(ci));
        localStorage.setItem('productCount', count - arr[index].cart);

        if (count_less == 0) {
          localStorage.clear();
          whole.innerHTML = '';
        }

        localStorage.setItem(
          'total',
          cost - arr[index].cart * arr[index].price
        );
      }
    });
  }
  cart();
}

function clearList(e) {
  whole.innerHTML = '';
  localStorage.clear();
}

function removeProduct(e) {
  let ci = localStorage.getItem('productsInCart');
  let count = localStorage.getItem('productCount');
  let cost = localStorage.getItem('total');

  ci = JSON.parse(ci);

  count = JSON.parse(count);

  if (e.target.hasAttribute('href')) {
    if (confirm('Are you Sure you want to remove the Item?')) {
      let element = e.target.parentElement;
      let eleParent = element.parentElement;
      eleParent.remove();

      let element0 =
        e.target.parentElement.parentElement.childNodes[1].childNodes[3]
          .innerHTML;
      let carts =
        e.target.parentElement.parentElement.childNodes[3].childNodes[3]
          .innerHTML;

      Object.values(ci).map((item, index, arr) => {
        if (arr[index].name == element0) {
          delete ci[arr[index].name];
          count = count - arr[index].cart;
          localStorage.setItem('productsInCart', JSON.stringify(ci));
          localStorage.setItem('productCount', count);
          if (count == 0) {
            localStorage.clear();
            clearList();
          }
          localStorage.setItem(
            'total',
            cost - arr[index].cart * arr[index].price
          );
        }
      });
    }
  }

  e.preventDefault();
}

cart();

location.onload = function () {
  let cart = localStorage.getItem('productCount');
  cart = JSON.parse(cart);
  if (cart != null) {
    whole.style.display = 'block';
  }
};

document.addEventListener('DOMContentLoaded', function (event) {
  var scrollpos = localStorage.getItem('scrollpos');
  if (scrollpos) window.scrollTo(0, scrollpos);
});

window.onbeforeunload = function (e) {
  localStorage.setItem('scrollpos', window.scrollY);
};
