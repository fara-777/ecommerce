/* CANVAS */
const openOffcanvas = document.querySelector(".open-offcanvas");
const offcanvasMenu = document.querySelector(".offcanvas");
const closeOffcanvas = document.querySelector(".close-offcanvas");
const offcanvasSubmenuIcon = document.querySelector(".offcanvas-middle a i");
const offcanvasSubmenu = document.querySelector(".submenu");

/* MAIN HEDER MENU */
const openMainMenuIcon = document.querySelector(".for-mainmenu, fa-bars");
const openMainMenu = document.querySelector(".for-mainmenu .mainmenu");

/* BASKET MENU */
const openBaskteIcon = document.querySelector(".open-card");
const myCardPanel = document.querySelector(".mycard");

/* PRODUCT LIST */
const productCardList = document.querySelector(".product-card-leftside");

/* TOTAL PRICE */
const total = document.querySelector(".total-price");

/* BASKET COUNT */
const totalQuantity = document.querySelector(".count-quantity");

/* SEARCH BUTTON */
const searchButton = document.querySelector(".header-main-right button");
/* SEARCH INPUT */
const searchInput = document.querySelector(".header-main-right input");

/* FILTER SEARCH */
const categoryFilter = document.getElementById("category-filter");
const priceFilter = document.querySelector(".price-filter select");
const radiButton = document.querySelector(".rate-filter");
const filterButton = document.getElementById("apply-filter");

/* HELP CHAT */
const helpWindow = document.querySelector(".help");
const helpOpenIcon = document.querySelector(".help-process i");
const chatWindow = document.querySelector(".help-chat");

const myQuestion = document.querySelector(".help-process input");

const leftChat = document.querySelector(".help-chat-left");
const rightChat = document.querySelector(".help-chat-right");

/* OFCANVAS OPEN CLOSE */
openOffcanvas.addEventListener("click", function () {
  offcanvasMenu.style.cssText = "left:0%; transition: ease .7s";
});

closeOffcanvas.addEventListener("click", function () {
  offcanvasMenu.style.cssText = "left:-50%; transition: ease .7s";
});

/* OFCANVAS WOMEN'S OPEN CLOSE */
offcanvasSubmenuIcon.addEventListener("click", function () {
  if (offcanvasSubmenu.style.display === "flex") {
    offcanvasSubmenu.style.display = "none";
  } else {
    offcanvasSubmenu.style.display = "flex";
  }
});

/* MAIN MENU OPEN CLOSE */
openMainMenuIcon.addEventListener("click", function () {
  if (openMainMenu.style.display === "flex") {
    openMainMenu.style.display = "none";
  } else {
    openMainMenu.style.display = "flex";
  }
});

/* SLIDER INITIALIZATION */
const swiper = new Swiper(".swiper", {
  spaceBetween: 30,
  centeredSlides: true,
  autoplay: {
    delay: 2500,
    disableOnInteraction: false,
  },
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
  },
});

/* BASKET OPEN CLOSE */
openBaskteIcon.addEventListener("click", function () {
  myCardPanel.style.display = "flex";
});

myCardPanel.addEventListener("mouseleave", function () {
  myCardPanel.style.display = "none";
});

/* PRODUCT LISTS */
let products = [];

fetch("https://fakestoreapi.com/products")
  .then((res) => res.json())
  .then((res) => {
    products = res;
    showProductCard(products);
  })
  .catch((err) => console.log(err));

function showProductCard(products) {
  let cardsHtml = "";

  if (!products.length) {
    cardsHtml = "<p>Product Not Found</p>";
  } else {
    products.forEach((product) => {
      const cardHtml = `
      <div class="card">
      <img src="${product.image}" alt="${product.title}">
      <div class="card-rate">
          <i class="fa-solid fa-star"></i>
          <span>(${product.rating.rate})</span>
      </div>
      <h3>${product.title}</h3>
      <div class="card-process">
          <i class="fa-solid fa-heart"></i>
          <button onclick=addProduct(${product.id})>$${product.price}</button>
      </div>
    </div>`;

      cardsHtml += cardHtml;
    });
  }

  productCardList.innerHTML = cardsHtml;
}

let basket = [];

function addProduct(id) {
  // the product we want to add
  const addBasket = products.find((product) => product.id === id);

  const index = basket.findIndex((product) => product.id === id);

  Toastify({
    text: `${addBasket.title.slice(0, 5) + "...added to cart"}`,
    duration: 1000,
    style: {
      background: "rgb(255, 128, 43)",
      color: "#fff",
    },
  }).showToast();

  if (index !== -1) {
    // add quantity to product
    basket[index].quantity += 1;

    // Select the card of the product to be updated
    const existingCard = document.getElementById(addBasket.id);

    // select the span tag that shows the quantity
    const quantitySpan = existingCard.querySelector(".mycard-price span");
    quantitySpan.textContent = `$${addBasket.price} x ${basket[index].quantity}`;

    // basket price
    const priceSpan = existingCard.querySelector(".mycard-total");
    // price update
    priceSpan.textContent = `$${addBasket.price * basket[index].quantity}`;
  } else {
    // adds an item to the basket if there is no item in the basket
    const newProductHtml = `
    <div class="card" id="${addBasket.id}">
      <img src=${addBasket.image} alt="" />
      <div class="mycard-price">
        <p>${addBasket.title}</p>
        <span>$${addBasket.price}</span>
      </div>
     <div class="mycard-total">$ ${addBasket.price}</div>
    </div>`;

    myCardPanel.innerHTML += newProductHtml;
    // add quantity property
    const newProduct = {
      quantity: 1,
      ...addBasket,
    };
    basket.push(newProduct);
  }
  // update tottal price
  total.innerHTML = basket
    .reduce((total, item) => total + item.price * item.quantity, 0)
    .toFixed(2);

  // basket total count
  totalQuantity.innerHTML = basket.reduce(
    (total, item) => total + item.quantity,
    0
  );
}

// product search function
searchInput.addEventListener("change", function () {
  const searchValue = searchInput.value.toLowerCase();
  const filtredProduct = products.filter((product) =>
    product.title.toLowerCase().includes(searchValue)
  );
  showProductCard(filtredProduct);
});

filterButton.addEventListener("click", function () {
  const selectedCategory = categoryFilter.value;
  const selectedPrice = priceFilter.value;
  const selectedRadio = document.querySelector(
    'input[name="rate-filter"]:checked'
  ).value;

  let filtered = [];
  // Filtering operation
  const filteredProducts = products.filter((product, i) => {
    //categoriler icin
    if (
      product.category === selectedCategory ||
      selectedCategory === "allCategory"
    ) {
      return priceFunc(product, selectedPrice, selectedRadio);
    }
  });

  // Show filtered products
  showProductCard(filteredProducts);
});

function priceFunc(product, selectedPrice, selectedRadio) {
  // All prices option check
  if (selectedPrice === "allPrice") {
    return rateFunc(product, selectedRadio);
  }
  if (selectedPrice === "0-10") {
    // 0-10 price range check
    if (product.price > 0 && product.price < 10) {
      return rateFunc(product, selectedRadio);
    }
  }
  if (selectedPrice === "10-100") {
    // 10-100 price range check
    if (product.price > 10 && product.price < 100) {
      return rateFunc(product, selectedRadio);
    }
  }
  if (selectedPrice === "100-500") {
    // 100-500 price range check
    if (product.price > 100 && product.price < 500) {
      return rateFunc(product, selectedRadio);
    }
  }
  if (selectedPrice === "500-") {
    // 500 and above price check
    if (product.price > 500) {
      return rateFunc(product, selectedRadio);
    }
  }
}

function rateFunc(product, selectedRadio) {
  // All points option check
  if (selectedRadio === "allRate") {
    console.log("RATEFUNC", product);
    return product;
  }
  // 1-5 point range check
  if (selectedRadio === "1-5" && product.rating.rate >= 1) {
    return product;
  }
  // 2-5 point range check
  if (selectedRadio === "2-5" && product.rating.rate >= 2) {
    return product;
  }
  // 3-5 point range check
  if (selectedRadio === "3-5" && product.rating.rate >= 3) {
    return product;
  }
  // 4-5 point range check
  if (selectedRadio === "4-5" && product.rating.rate >= 4) {
    return product;
  }
}

/* HELP CHAT CONTROLL */
helpOpenIcon.addEventListener("click", function () {
  if (chatWindow.style.display === "flex") {
    chatWindow.style.display = "none";
    helpWindow.style.cssText = "right: -250px;";
    helpOpenIcon.className = "fa-solid fa-comment-dots";
  } else {
    chatWindow.style.display = "flex";
    helpWindow.style.cssText = "right:0;";
    helpOpenIcon.className = "fa-solid fa-arrow-right";
  }
});

myQuestion.addEventListener("keypress", () => {
  if (event.key === "Enter") {
    let myQuestionHtml = "";

    myQuestionHtml = `
    <div class="help-chat-right">
       <p>${myQuestion.value}</p>
    </div>
        `;
    // insertAdjacentHTML() inserts the HTML code at the specified location...
    chatWindow.insertAdjacentHTML("beforeend", myQuestionHtml);

    // chatWindow scrollHeight gives the height in px on the horizontal axis
    // takes 2 parameters as (x y) this operation focuses only the scrool on the y axis
    chatWindow.scrollTo(0, chatWindow.scrollHeight);

    const model = "gpt-3.5-turbo";
    const userMessage = { role: "user", content: myQuestion.value };

    // api key
    const key = "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";

    fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: model,
        messages: [userMessage],
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        let response = `
    <div className="help-chat-right">
        <p>${data.choices[0].message.content}</p>
     </div>
    `;
        chatWindow.insertAdjacentHTML("beforeend", response);

        chatWindow.scrollTo(0, chatWindow.scrollHeight);

        myQuestion.value = "";
      })
      .catch((err) => console.log(err));
  }
});
