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
    categoryHeading = document.querySelector('.category-heading');


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

    buttonOut.addEventListener('click', logOut);


}

const notAuthorized = () => {
    //console.log('не авторизован');
    buttonAuth.style.display = '';

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
                                <button class="button button-primary button-add-cart">
                                    <span class="button-card-text">В корзину</span>
                                    <span class="button-cart-svg"></span>
                                </button>
                                <strong class="card-price-bold">${good.price} ₽</strong>
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
        window.scrollTo(0,0);
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




const init = () => {
    getData('./db/partners.json').then(function(data) {
        data.forEach(createCardRestaurant);
    });


    cardsRestaurants.addEventListener('click', openGoods);

    logo.addEventListener('click', () => {
        restaurants.classList.remove('hide');
        containerPromo.classList.remove('hide');
        menu.classList.add('hide');
    });

    cartButton.addEventListener("click", toggleModal);
    close.addEventListener("click", toggleModal);
};


init();