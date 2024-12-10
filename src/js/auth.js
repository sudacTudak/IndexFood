const auth = () => {
    const loginButton = document.querySelector('.login');
    const logoutButton = document.querySelector('.logout');
    const userName = document.querySelector('.user-name');
    const formAuth = document.forms.formAuth;
    const menuCloser = userName.nextElementSibling;
    const menu = menuCloser.nextElementSibling;

    const timeout = 500;

    let isValid = true;
    let menuIsOpen = false;

    const showError = (formInput) => {
        const errorText = formInput.nextElementSibling;

        formInput.classList.add('_error');
        errorText.classList.add('_error');
        errorText.textContent = 'Данное поле не может быть пустым';
    }

    const removeError = (formInput) => {
        const errorText = formInput.nextElementSibling;

        formInput.classList.remove('_error');
        errorText.classList.remove('_error');
        errorText.textContent = '';
    }

    const logout = () => {
        userName.textContent = '';
        userName.style.display = 'none';

        loginButton.style.display = 'block';

        localStorage.removeItem('user');

        closeMenu(menu);
    }

    const login = (user) => {
        loginButton.style.display = 'none';

        userName.textContent = user.name;
        userName.style.display = 'block';

        localStorage.setItem('user', JSON.stringify(user));
    }

    const closeMenu = (menu) => {
        if (menu.classList.contains('is-open') && menuIsOpen) {
            userName.classList.remove('is-open');
            menuCloser.classList.remove('is-open');
            menu.classList.remove('is-open');

            setTimeout(() => {
                menuIsOpen = false;
            }, timeout);
        } 
    }

    const openMenu = (menu) => {
        if (!menu.classList.contains('is-open') && !menuIsOpen) {
            userName.classList.add('is-open');
            menuCloser.classList.add('is-open');
            menu.classList.add('is-open');
            
            setTimeout(() => {
                menuIsOpen = true;
            }, timeout);
        }
    }

    const sendRequest = (user) => {
        fetch('https://jsonplaceholder.typicode.com/posts', {
            method: 'post',
            body: user
        })
        .then(response => {
            if (response.ok) {
                alert('Вход выполнен!');
                closeModal(formAuth.closest('.modal-auth'));
            }
        })
        .catch(error => {
            alert('Произошла ошибка при авторизации. Повторите попытку');
        })
    }

    if (localStorage.getItem('user')) {
        login(JSON.parse(localStorage.getItem('user')));
    }

    for (let elem of formAuth) {
        if (!elem.classList.contains('form-button')) {
            elem.addEventListener('click', () => {
                if (elem.classList.contains('_error')) {
                    removeError(elem);
                }
            })
            
        }
    }

    logoutButton.addEventListener('click', (e) => {
        e.preventDefault();
        
        logout();
    })

    menuCloser.addEventListener('click', () => {
        if (menu) closeMenu(menu);
    })

    userName.addEventListener('click', () => {
        if (menu && localStorage.getItem('user')) openMenu(menu);
    });

    formAuth.addEventListener('submit', (e) => {
        e.preventDefault();

        for (let elem of formAuth.elements) {
            if (!elem.classList.contains('form-button')) {
                if (elem.value === '') {
                    showError(elem);
                    isValid = false;
                } else {
                    isValid = true;
                }
            }
        }

        if (isValid) {
            const user = {};

            user.name = formAuth.login.value;
            user.password = formAuth.password.value;

            login(user);

            sendRequest(user);
        }
    })
}

auth();
