const lazyLoad = () => {
    const lazyImages = document.querySelectorAll('img[data-src]');
    const windowHeight = document.documentElement.clientHeight;
    const lazyImagesPosition = [];

    let lazyImgCount = 0;

    const showLazyImages = (imgIndex) => {
        const lazyImage = lazyImages[imgIndex];

        lazyImage.src = lazyImage.dataset.src;
        lazyImage.removeAttribute('data-src');
        
        delete lazyImagesPosition[imgIndex];
        lazyImgCount--;
    }

    const lazyScrollCheck = () => {
        if (lazyImagesPosition.length > 0) {
            let imgIndex = lazyImagesPosition.findIndex(
                item => pageYOffset  >= item - windowHeight
            );

            if (imgIndex >= 0) {
                if (lazyImages[imgIndex].dataset.src) {
                    showLazyImages(imgIndex);
                }
            }
        }
    }

    const lazyScroll = () => {
        if (lazyImgCount > 0) {
            lazyScrollCheck();
        }
    }

    if (lazyImages.length > 0) {
        lazyImages.forEach(img => {
            if (img.dataset.src) {
                lazyImagesPosition.push(img.getBoundingClientRect().top + pageYOffset);
                lazyImgCount++;

                lazyScrollCheck();
            }
        })
    }
    

    window.addEventListener('scroll', lazyScroll);
}

lazyLoad();
