new Swiper('.image-slider', {
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },
    pagination: {
        el: '.swiper-pagination',
        clickable:true,
        dynamicBullets: true,
    },
    grabCursor: true,
    mousewheel:{
        sensitivity: 1,
        eventsTarget:".image-slider"
    },
    // autoHeight: true,
    loop: true,
    autoplay:{
        delay: 3000,

    },
    // breakpoints:{
    //     320:{
    //         slidesPerView: 1,
    //     },
    //     480:{
    //         slidesPerView: 2,
    //     },
    //     992:{
    //         slidesPerView: 3,
    //     }
    // },
});
