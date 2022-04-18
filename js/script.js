const changeNavBarOnScroll = () => {
    let navigation = document.querySelector('.ep-navbar');
    let header = document.querySelector('#ep-header');
    window.addEventListener('scroll', () => {
        if (document.documentElement.scrollTop > header.offsetHeight - navigation.offsetHeight) {
            navigation.classList.remove('nav-at-header');
        } else {
            navigation.classList.add('nav-at-header');
        }
    });

}

changeNavBarOnScroll();

// responsive navbar
const menu = document.querySelector('.menu');
const menuSection = menu.querySelector('.menu-section');
const menuClosed = menu.querySelector('.menu-mobile-close');
const menuToggle = document.querySelector('.menu-mobile-toggle');
const menuOverlay = document.querySelector('.overlay');
let subMenu;

menuSection.addEventListener('click', (e) => {
    if (!menu.classList.contains('active')) {
        return;
    }
});

menuToggle.addEventListener('click', () => {
    toggleMenu();
});

menuClosed.addEventListener('click', () => {
    toggleMenu();
});

menuOverlay.addEventListener('click', () => {
    toggleMenu();
});

// Show & Hide Toggle Menu Function
function toggleMenu() {
    menu.classList.toggle('active');
    menuOverlay.classList.toggle('active');
}


// Windows Screen Resizes Function
window.onresize = function() {
    if (this.innerWidth > 991) {
        if (menu.classList.contains('active')) {
            toggleMenu();
        }
    }
};

//profile tooltip toggle
function hide(element) {
    element.style.display = "none";
}

function toggleTooltip(toggler, tooltip) {
    toggler.addEventListener('mouseover', () => {
        tooltip.classList.remove('hide');
    });
    toggler.addEventListener('mouseout', () => {
        tooltip.classList.add('hide');
    });
}

const navProfileMenuToggler = document.querySelector('.toggle-account #profileThumbnail');
const navProfileMenu = document.querySelector('.toggle-account #profileTooltip');

navProfileMenuToggler.addEventListener('click', () => {
    navProfileMenu.classList.toggle('hide');
});

const navTranslateBtn = document.querySelector('.nav-item-right .translate-btn');
const navToggleTheme = document.querySelector('.nav-item-right .toggle-theme');
const navTranslateBtnTooltip = navTranslateBtn.querySelector('.ep-tooltip');
const navToggleThemeTooltip = navToggleTheme.querySelector('.ep-tooltip');
toggleTooltip(navTranslateBtn, navTranslateBtnTooltip);
toggleTooltip(navToggleTheme, navToggleThemeTooltip);

// reward--slider
$(function() {

    var owl = $('.owl-1');
    owl.owlCarousel({
        loop: false,
        margin: 0,
        nav: false,
        dots: false,
        items: 1,
        smartSpeed: 200,
        autoplay: false,
        navText: ['<span class="icon-keyboard_arrow_left">', '<span class="icon-keyboard_arrow_right">']
    });

    var carousel_nav_a = $('.carousel-nav a');

    carousel_nav_a.each(function(slide_index) {
        var $this = $(this);
        $this.attr('data-num', slide_index);
        $this.click(function(e) {
            owl.trigger('to.owl.carousel', [slide_index, 1000]);
            e.preventDefault();
        })
    })

    owl.on('changed.owl.carousel', function(event) {
        carousel_nav_a.removeClass('active');
        $(".carousel-nav a[data-num=" + event.item.index + "]").addClass('active');
    })


})