
    const modalOpeners = document.querySelectorAll('.modal-caller');
    const modalClosers = document.querySelectorAll('.modal-close');
    const contentWrapper = document.querySelector('.wrapper');
    const lockPadding = document.querySelectorAll('.lock-padding');
    const body = document.body;
    
    let unlock = true;
    const timeout = 800;

    const unlockBody = () => {
        setTimeout(() => {
            if (lockPadding) {
                lockPadding.forEach(item => {
                    item.style.paddingRight = 0 + 'px';
                })
            }

            body.style.paddingRight = 0 + 'px';
            body.classList.remove('locked');
        }, timeout);

        unlock = false;
        setTimeout(() => {
            unlock = true;
        }, timeout);
    }

    const lockBody = () => {
        const lockPaddingValue = window.innerWidth - contentWrapper.offsetWidth + 'px';

        if (lockPadding) {
            lockPadding.forEach(item => {
                item.style.paddingRight = lockPaddingValue;
            })
        }

        body.style.paddingRight = lockPaddingValue;
        body.classList.add('locked');

        unlock = false;
        setTimeout(() => {
            unlock = true;
        }, timeout);
    }

    const checkClickTarget = (e) => {
        if (!e.target.closest('.modal-content')) {
            closeModal(e.target.closest('.modal'));
        }
    }

    const openModal = (currentModal) => {
        if (unlock) {
            currentModal.classList.add('is-open');
            currentModal.addEventListener('click', checkClickTarget, 'once');
            lockBody();
        }
    }

    const closeModal = (currentModal) => {
        if (unlock) {
            currentModal.classList.remove('is-open');
            currentModal.removeEventListener('click', checkClickTarget);
            unlockBody();
        }
    }

    if (modalOpeners.length > 0) {
        modalOpeners.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();

                const modalName = item.getAttribute('href').replace('#', '');
                const modalCurrent = document.getElementById(modalName);

                openModal(modalCurrent);
            })
        })
    }

    if (modalClosers.length > 0) {
        modalClosers.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();

                closeModal(item.closest('.modal'));
            })
        })
    }
