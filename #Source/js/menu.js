const menu = () => {
    const tabs = document.querySelector('.tabs');
    const tabsContent = document.querySelector('.tabs-content');
    const tabsCards = tabsContent.querySelectorAll('.tabs-card');
    const buttonLoadMore = document.querySelector('._load-more');

    let activeTab = tabs.querySelector('.active');
    let tabsCardsArray = [];

    const addToCart = (cartItem) => {
        const cartArray = localStorage.getItem('cart') ? 
            JSON.parse(localStorage.getItem('cart')) : [];

        if (cartArray.some(item => item.id === cartItem.id)) {
            cartArray.map(item => {
                if (item.id === cartItem.id) {
                    item.count++;
                  //   item.totalPrice = item.price * item.count;
                }
                return item
            })
        } else {
            cartArray.push(cartItem);
        }

        localStorage.setItem('cart', JSON.stringify(cartArray));
        cartRender(cartArray);
    }

    const renderMenu = (data) => {
        data.forEach(({name, description, price, image, weight, category, id}) => {

            const card = document.createElement('article');
            card.classList.add('tabs-card');
            card.dataset.category = category;

            card.innerHTML = `
                <img src="${image}" alt="${name}" class="tabs-image">
                <div class="tabs-card-content">
                    <h3 class="tabs-title">${name}</h3>
                    <p class="text-description">${description}</p>
                    <div class="tabs-info">
                        <div class="tabs-good">
                            <span class="price">${price} ₽</span>
                            <span class="weight">${weight} гр</span>
                        </div>
                        <button data-index="${id}" class="button button-outline button-add-cart">В корзину</button>
                    </div>
                </div>
            `
            card.querySelector('.button-add-cart').addEventListener('click', () => {
                const cartItem = {id, name, price, count: 1};

                addToCart(cartItem);
            })

            tabsContent.append(card);
            tabsCardsArray.push(card);
        })
        // tabsCards = document.querySelectorAll('.tabs-card');
    }

    const requestMenu = () => {
        fetch('./db/menu.json')
        .then(response => {
            if (response.ok) return response.json()
        })
        .then(data => {
            renderMenu(data);
        })
        .catch(error => {
            alert(error);
        })
    }


    const activeTabs = () => {
        tabs.addEventListener('click', e => {

            if (e.target.tagName === 'LI' && !e.target.classList.contains('active')) {
                if (activeTab) activeTab.classList.remove('active');
    
                e.target.classList.add('active');
                activeTab = e.target;
                const category = e.target.dataset.category;
    
                tabsCardsArray.forEach(item => {
                    item.classList.remove('hide');
    
                    if (!item.dataset.category.includes(category) && category !== 'all') {
                        item.classList.add('hide');
                    }
                })
            }
        })

        tabs.firstElementChild.click();
    }

    buttonLoadMore.addEventListener('click', () => {
        requestMenu();
    })

    tabsCards.forEach(item => {
        const btnAddToCart = item.querySelector('.button-add-cart');
        const id = btnAddToCart.dataset.index;
        const price = item.querySelector('.price').dataset.price;
        const name = item.querySelector('.tabs-title').textContent;

        btnAddToCart.addEventListener('click', () => {
            const cartItem = ({id, name, price, count: 1});

            addToCart(cartItem);
        });
        tabsCardsArray.push(item);
    })

    activeTabs();
}

menu();