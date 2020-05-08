'use strict';








/////// day 1 ////////////////

const buttonAuth = document.querySelector('.button-auth'),
    modalAuth = document.querySelector('.modal-auth'),
    closeAuth = document.querySelector('.close-auth'),
    logInForm = document.querySelector('#logInForm'),
    loginInput = document.querySelector('#login'),
    userName = document.querySelector('.user-name'),
    buttonOut = document.querySelector('.button-out'),
    cardsRestaurants = document.querySelector('.cards-restaurants'),
    containerPromo = document.querySelector('.container-promo'),
    menu = document.querySelector('.menu'),
    restaurants = document.querySelector('.restaurants'),
    logo = document.querySelector('.logo'),
    cardsMenu = document.querySelector('.cards-menu'),
    cartButton = document.querySelector("#cart-button"),
    modal = document.querySelector(".modal"),
    close = document.querySelector(".close"),
    restaurantTitle = document.querySelector('.restaurant-title'),
    ratingHeading = document.querySelector('.rating-heading'),
    priceHeading = document.querySelector('.price-heading'),
    categoryHeading = document.querySelector('.category-heading'),
    modalBody = document.querySelector('.modal-body'),
    modalPriceTag = document.querySelector('.modal-pricetag'),
    buttonClearCart = document.querySelector('.clear-cart');

let cart = [];

let login = localStorage.getItem('deliveryLogin');


const getData = async (url) => {
    const response = await fetch(url);

    if (!response.ok)
        throw new Error(`Ошибка по адресу ${url}, статус ошибки ${response.status} !`);
    else
        return await response.json();

};



const toggleModalAuth = () => {
    modalAuth.classList.toggle('is-open');
};

function toggleModal() {
    modal.classList.toggle("is-open");
};


const authorized = () => {
    console.log('авторизован');
    buttonAuth.style.display = 'none';
    userName.textContent = login;
    userName.style.display = 'inline';
    buttonOut.style.display = 'flex';

    const logOut = () => {
        login = null;

        userName.style.display = '';
        buttonOut.style.display = '';

        buttonOut.removeEventListener('click', logOut);
        localStorage.removeItem('deliveryLogin');
        checkAuth();
    }
    cartButton.style.display = 'flex';
    buttonOut.addEventListener('click', logOut);


}

const notAuthorized = () => {
    //console.log('не авторизован');
    buttonAuth.style.display = '';
    cartButton.style.display = '';

    function logIn(event) {
        event.preventDefault();
        //console.log(loginInput.value);

        if (loginInput.value !== '') {
            login = loginInput.value;
            localStorage.setItem('deliveryLogin', login);
            toggleModalAuth();
        } else
            alert('Так а смысл ? Вводить пустой логин...');

        buttonAuth.removeEventListener('click', toggleModalAuth);
        closeAuth.removeEventListener('click', toggleModalAuth);
        logInForm.removeEventListener('submit', logIn);

        logInForm.reset();
        checkAuth();
    }
    buttonAuth.addEventListener('click', toggleModalAuth);
    closeAuth.addEventListener('click', toggleModalAuth);
    logInForm.addEventListener('submit', logIn);
}


const checkAuth = () => {
    if (login)
        authorized();
    else
        notAuthorized();
}

checkAuth();


const createCardRestaurant = (restaurant) => {
    const card = `
                    <a class="card card-restaurant" data-products="${restaurant.products}">
                        <img src="${restaurant.image}" alt="image" class="card-image" />
                        <div class="card-text">
                            <div class="card-heading">
                                <h3 class="card-title">${restaurant.name}</h3>
                                <span class="card-tag tag">${restaurant.time_of_delivery}</span>
                            </div>
                            <!-- /.card-heading -->
                            <div class="card-info">
                                <div class="rating">
                                    4.5
                                </div>
                                <div class="price">${restaurant.price}</div>
                                <div class="category">${restaurant.kitchen}</div>
                            </div>
                            <!-- /.card-info -->
                        </div>
                        <!-- /.card-text -->
                    </a>
                    `;

    cardsRestaurants.insertAdjacentHTML('beforeend', card);

}



const createCardGood = (good) => {
    const card = document.createElement('div');
    card.className = 'card';
    card.insertAdjacentHTML('beforeend', `
                        <img src="${good.image}" alt="image" class="card-image" />
                        <div class="card-text">
                            <div class="card-heading">
                                <h3 class="card-title card-title-reg">${good.name}</h3>
                            </div>
                            <div class="card-info">
                                <div class="ingredients">${good.description}
                                </div>
                            </div>
                            <div class="card-buttons">
                                <button class="button button-primary button-add-cart" id="${good.id}">
                                    <span class="button-card-text">В корзину</span>
                                    <span class="button-cart-svg"></span>
                                </button>
                                <strong class="card-price card-price-bold">${good.price} ₽</strong>
                            </div>
                        </div>
    `);
    cardsMenu.insertAdjacentElement('beforeend', card);
    //console.log(card);
};

const openGoods = (e) => {
    const target = (e.target);
    const restaurant = target.closest('.card-restaurant');
    //console.log(restaurant);

    if (restaurant) {
        window.scrollTo(0, 0);
        restaurants.classList.add('hide');
        containerPromo.classList.add('hide');
        menu.classList.remove('hide');

        cardsMenu.textContent = '';

        getData(`./db/${restaurant.dataset.products}`).then(function(data) {
            data.forEach(createCardGood);

            restaurantTitle.textContent = (restaurant.querySelector('.card-title')).textContent;
            ratingHeading.textContent = (restaurant.querySelector('.rating')).textContent;
            priceHeading.textContent = (restaurant.querySelector('.price')).textContent;
            categoryHeading.textContent = (restaurant.querySelector('.category')).textContent;
        });


    }
};


const addToCart = (event) => {
    const target = event.target;

    const buttonAddToCart = target.closest('.button-add-cart');

    if (buttonAddToCart) {
        const card = target.closest('.card');
        const title = card.querySelector('.card-title-reg').textContent;
        const cost = card.querySelector('.card-price').textContent;
        const id = buttonAddToCart.id;

        const food = cart.find((item) => (item.id === id));

        if (food)
            food.count += 1;
        else
            cart.push({
                id,
                title,
                cost,
                count: 1
            });
    }
}


const renderCart = () => {
    modalBody.textContent = '';

    for (let i = 0; i < cart.length; i++) {
        const itemCard = `
                <div class="food-row">
                    <span class="food-name">${cart[i].title}</span>
                    <strong class="food-price">${cart[i].cost}</strong>
                    <div class="food-counter">
                        <button class="counter-button counter-minus" data-id="${cart[i].id}">-</button>
                        <span class="counter">${cart[i].count}</span>
                        <button class="counter-button counter-plus" data-id="${cart[i].id}">+</button>
                    </div>
                </div>
                        `;
        modalBody.insertAdjacentHTML('beforeend', itemCard);
    }


    const totalPrice = cart.reduce(function(result, item) {
        return result + parseFloat(item.cost) * parseFloat(item.count);
    }, 0);


    modalPriceTag.textContent = totalPrice + '₽';
}


const changeCount = (event) => {
    const target = event.target;

    if (target.classList.contains('counter-button')) {
        const food = cart.find(function(item) {
            return item.id === target.dataset.id;
        });

        if (target.classList.contains('counter-plus'))
            food.count++;
        if (target.classList.contains('counter-minus'))
            {
                food.count--;
                if (food.count === 0)
                    cart.splice(cart.indexOf(food),1);
            }

        renderCart();
    }

}



const init = () => {
    getData('./db/partners.json').then(function(data) {
        data.forEach(createCardRestaurant);
    });


    cardsRestaurants.addEventListener('click', openGoods);

    cardsMenu.addEventListener('click', addToCart);

    logo.addEventListener('click', () => {
        restaurants.classList.remove('hide');
        containerPromo.classList.remove('hide');
        menu.classList.add('hide');
    });

    cartButton.addEventListener("click", () => {
        toggleModal();
        renderCart();
    });
    buttonClearCart.addEventListener('click',()=>{
        cart.length = 0;
        renderCart();
    });
    modalBody.addEventListener('click', changeCount);
    close.addEventListener("click", toggleModal);
};


init();