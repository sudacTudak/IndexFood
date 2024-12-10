
    const shoppingCounter = document.querySelector('.shopping-counter');
    const modalCart = document.querySelector('.modal-cart');
    const cartWrapper = modalCart.querySelector('.cart-wrapper');
    const totalPrice = modalCart.querySelector('.total-price');

    const showCartCounter = (totalCount) => {
        shoppingCounter.classList.add('not-empty');
        shoppingCounter.textContent = `${totalCount}`;
    }

    const hideCartCounter = () => {
        shoppingCounter.classList.remove('not-empty');
        shoppingCounter.textContent = '0';
    }

    const clearCart = () => {
        modalCart.classList.add('is-empty');

        localStorage.removeItem('cart');

        cartWrapper.innerHTML = ``;
        totalPrice.innerHTML = '0 &#8381'

        hideCartCounter();
    }

    const sendCart = (cartArray) => {
        fetch('https://jsonplaceholder.typicode.com/posts', {
            method: 'post',
            body: cartArray
        })
        .then(response => {
            if (response.ok) {
                alert('Заказ принят!');

                clearCart();
                closeModal(modalCart);
            }
        })
        .catch(error => {
            alert('Ошибка при формировании заказа');
        })
    }

    const incrementCount = (id) => {
        if (localStorage.getItem('cart')) {
            const cartArray = JSON.parse(localStorage.getItem('cart'));

            cartArray.forEach(item => {
                if (item.id === id) {item.count++;}
            })

            localStorage.setItem('cart', JSON.stringify(cartArray));
            cartRender(cartArray)
        }
    }

    const decrementCount = (id) => {
        if (localStorage.getItem('cart')) {
            const cartArray = JSON.parse(localStorage.getItem('cart'));

            cartArray.forEach(item => {
                if (item.id !== id || item.count < 1) {
                    return;
                }
                item.count--;
            })

            localStorage.setItem('cart', JSON.stringify(cartArray));
            cartRender(cartArray);
        }
    }

    const cartRender = (data) => {
        cartWrapper.innerHTML = '';
        let totalCount = 0;
        let amount = 0;

        data.forEach(item => {
            const {name, id, price, count} = item;

            const cartItem = document.createElement('div');
            cartItem.classList.add('cart-item');

            cartItem.innerHTML = `
                <div class="item-name">${name}</div>
                <div class="item-count">
                    <button data-index="${id}" class="button-decrement">-</button>
                    <div class="item-counter">${count}</div>
                    <button data-index="${id}" class="button-increment">+</button>
                </div>
                <span class="item-price">${price * count} &#8381;</span>
            `

            cartWrapper.append(cartItem);

            amount += price * count;

            totalCount += count;
        })

        modalCart.classList.remove('is-empty');

        totalPrice.innerHTML = amount + ' &#8381;'

        if (totalCount > 0) {
            showCartCounter(totalCount);
        } else {
            hideCartCounter();
        }
    }

    if(localStorage.getItem('cart')) {
        const data = JSON.parse(localStorage.getItem('cart'));

        cartRender(data);
    }

    modalCart.addEventListener('click', e => {
        if (e.target.classList.contains('button-increment')) {
            incrementCount(e.target.dataset.index);
        }

        if (e.target.classList.contains('button-decrement')) {
            decrementCount(e.target.dataset.index);
        }

        if (e.target.closest('.cart-clear')) {
            if (!modalCart.classList.contains('is-empty')) {
                clearCart();
            }
        }

        if (e.target.closest('.cart-send') && localStorage.getItem('cart')) {
			  if (localStorage.getItem('cart')) {
				  sendCart(JSON.parse(localStorage.getItem('cart')));
			  }
		  }
	 });