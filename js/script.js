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

// navbar scrollspy
console.clear();
const makeNavLinksSmooth = () => {
    const navLinks = document.querySelectorAll(".menu-item a");
    for (let n in navLinks) {
        console.log(navLinks[n].hash);
        if (navLinks.hasOwnProperty(n)) {
            navLinks[n].addEventListener("click", (e) => {
                e.preventDefault();
                document.querySelector(navLinks[n].hash).scrollIntoView({
                    behavior: "smooth"
                });

            });
        }
    }
};

const spyScrolling = () => {
    const sections = document.querySelectorAll(".ep-main-content section");
    console.log("sections: ", sections);

    window.onscroll = () => {
        const scrollPos =
            document.documentElement.scrollTop || document.body.scrollTop;

        for (let s in sections)
            if (sections.hasOwnProperty(s) && sections[s].offsetTop <= scrollPos) {
                const id = sections[s].id;
                console.log("sections id: ", id);
                document.querySelector("nav li.active").classList.remove("active");
                document
                    .querySelector(`nav li a[href*=${id}]`)
                    .parentNode.classList.add("active");
            }
    };
};

makeNavLinksSmooth();
spyScrolling();

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
    });

});

//Login form
/*global $, document, window, setTimeout, navigator, console, location*/
$(document).ready(function() {

    'use strict';

    var usernameError = true,
        emailError = true,
        passwordError = true,
        passConfirm = true;

    // Detect browser for css purpose
    if (navigator.userAgent.toLowerCase().indexOf('firefox') > -1) {
        $('.form form label').addClass('fontSwitch');
    }

    // Label effect
    $('input').focus(function() {

        $(this).siblings('label').addClass('active');
    });

    // Form validation
    $('input').blur(function() {

        // User Name
        if ($(this).hasClass('name')) {
            if ($(this).val().length === 0) {
                $(this).siblings('span.error').text('Please type your full name').fadeIn().parent('.form-group').addClass('hasError');
                usernameError = true;
            } else if ($(this).val().length > 1 && $(this).val().length <= 6) {
                $(this).siblings('span.error').text('Please type at least 6 characters').fadeIn().parent('.form-group').addClass('hasError');
                usernameError = true;
            } else {
                $(this).siblings('.error').text('').fadeOut().parent('.form-group').removeClass('hasError');
                usernameError = false;
            }
        }
        // Email
        if ($(this).hasClass('email')) {
            if ($(this).val().length == '') {
                $(this).siblings('span.error').text('Please type your email address').fadeIn().parent('.form-group').addClass('hasError');
                emailError = true;
            } else {
                $(this).siblings('.error').text('').fadeOut().parent('.form-group').removeClass('hasError');
                emailError = false;
            }
        }

        // PassWord
        if ($(this).hasClass('pass')) {
            if ($(this).val().length < 8) {
                $(this).siblings('span.error').text('Please type at least 8 charcters').fadeIn().parent('.form-group').addClass('hasError');
                passwordError = true;
            } else {
                $(this).siblings('.error').text('').fadeOut().parent('.form-group').removeClass('hasError');
                passwordError = false;
            }
        }

        // PassWord confirmation
        if ($('.pass').val() !== $('.passConfirm').val()) {
            $('.passConfirm').siblings('.error').text('Passwords don\'t match').fadeIn().parent('.form-group').addClass('hasError');
            passConfirm = false;
        } else {
            $('.passConfirm').siblings('.error').text('').fadeOut().parent('.form-group').removeClass('hasError');
            passConfirm = false;
        }

        // label effect
        if ($(this).val().length > 0) {
            $(this).siblings('label').addClass('active');
        } else {
            $(this).siblings('label').removeClass('active');
        }
    });


    // form switch
    $('a.switch').click(function(e) {
        $(this).toggleClass('active');
        e.preventDefault();

        if ($('a.switch').hasClass('active')) {
            $(this).parents('.form-peice').addClass('switched').siblings('.form-peice').removeClass('switched');
        } else {
            $(this).parents('.form-peice').removeClass('switched').siblings('.form-peice').addClass('switched');
        }
    });


    // Form submit
    $('form.signup-form').submit(function(event) {
        event.preventDefault();

        if (usernameError == true || emailError == true || passwordError == true || passConfirm == true) {
            $('.name, .email, .pass, .passConfirm').blur();
        } else {
            $('.signup, .login').addClass('switched');

            setTimeout(function() { $('.signup, .login').hide(); }, 700);
            setTimeout(function() { $('.brand').addClass('active'); }, 300);
            setTimeout(function() { $('.heading').addClass('active'); }, 600);
            setTimeout(function() { $('.success-msg p').addClass('active'); }, 900);
            setTimeout(function() { $('.success-msg a').addClass('active'); }, 1050);
            setTimeout(function() { $('.form').hide(); }, 700);
        }
    });

    // Reload page
    $('a.profile').on('click', function() {
        location.reload(true);
    });


});