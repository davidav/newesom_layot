$('a[href^="#"], a[href^="."]').click(function () { // если в href начинается с # или ., то ловим клик
    var scroll_el = $(this).attr('href'); // возьмем содержимое атрибута href
    $('html, body').animate({ scrollTop: $(scroll_el).offset().top }, 500); // анимируем скроолинг к элементу scroll_el
    // $('nav ul').slideUp();
    let iconMenu = document.querySelector(".icon-menu");
    let menuBody = document.querySelector(".menu__body");
    iconMenu.classList.remove("_active");
    menuBody.classList.remove("_active");


    return false; // выключаем стандартное действие
});