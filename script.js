'use strict';

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const header = document.querySelector(".header");
const btnScrollTo = document.querySelector(".btn--scroll-to");
const section1 = document.querySelector("#section--1");
const tabs = document.querySelectorAll(".operations__tab");
const tabContainer = document.querySelector(".operations__tab-container");
const tabContent = document.querySelectorAll(".operations__content");
const nav = document.querySelector(".nav");

///////////////////////////////////////
/// Navigation bar

function handleHover(e) {
  if (e.target.classList.contains("nav__link")) {
    const link = e.target;
    const siblings = link.closest(".nav").querySelectorAll(".nav__link");
    const logo = link.closest(".nav").querySelector("img");

    siblings.forEach((el) => {
      if (el !== link) {
        el.style.opacity = this;
      }
    })
    logo.style.opacity = this;
  }
}

nav.addEventListener("mouseover", handleHover.bind(0.5));
nav.addEventListener("mouseout", handleHover.bind(1))

const navHeight = nav.getBoundingClientRect().height;
function stickyNav(entries) {
  const [entry] = entries;
  if (!entry.isIntersecting) nav.classList.add("sticky");
  else nav.classList.remove("sticky");
}

const options = {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`
}
const headerObserver = new IntersectionObserver(stickyNav, options);
headerObserver.observe(header);

////////////////////////////////////////
/// Section Animation

const section = document.querySelectorAll(".section");

function revealSection(entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;
  entry.target.classList.remove("section--hidden");

  observer.unobserve(entry.target);
}

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15
});
section.forEach((section) => {
  sectionObserver.observe(section);
  section.classList.add("section--hidden");
});

///////////////////////////////////////
/// Modal window

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach((btn) => btn.addEventListener('click', openModal))

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

const message = document.createElement("div");
message.classList.add("cookie-message");
message.innerHTML = "We use cookies for improved functionality and analytics. <button class='btn btn--close-cookie'>Got it</button>";
header.append(message);

document.querySelector(".btn--close-cookie").addEventListener("click", function () {
  message.remove();
});

///////////////////////////////////////////
///Scrolling
btnScrollTo.addEventListener("click", function () {
  section1.scrollIntoView({ behavior: "smooth" });
});

document.querySelector(".nav__links").addEventListener("click", function (e) {
  e.preventDefault();

  if (e.target.classList.contains("nav__link") && !e.target.classList.contains("nav__link--btn")) {
    const id = e.target.getAttribute("href");
    document.querySelector(id).scrollIntoView({ behavior: "smooth" });
  }
});

///////////////////////////////////////////
/// Operations Tab
tabContainer.addEventListener("click", function (e) {
  const clicked = e.target.closest(".operations__tab");

  if (!clicked) return;

  tabs.forEach(tabs => tabs.classList.remove("operations__tab--active"));
  clicked.classList.add("operations__tab--active");

  tabContent.forEach(content => content.classList.remove("operations__content--active"));
  document.querySelector(`.operations__content--${clicked.dataset.tab}`).classList.add("operations__content--active");
});

///////////////////////////////////////////
/// lazy loading
const images = document.querySelectorAll("img[data-src]");

function loading(entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;
  entry.target.src = entry.target.dataset.src;

  entry.target.addEventListener("load", function () {
    entry.target.classList.remove("lazy-img");
  });

  observer.unobserve(entry.target);
}

const imgObserver = new IntersectionObserver(loading, {
  root: null,
  threshold: 0,
  rootMargin: "-100px"
});
images.forEach((img) => imgObserver.observe(img));

/////////////////////////////////////////
/// Slider

function slider() {
  const slides = document.querySelectorAll(".slide");
  const btnLeft = document.querySelector(".slider__btn--left");
  const btnRight = document.querySelector(".slider__btn--right");
  const dotsContainer = document.querySelector(".dots");
  const dots = document.querySelectorAll(".dots__dot");

  let curSlide = 0;
  const maxSlide = slides.length;

  function createDots() {
    slides.forEach((_, i) => dotsContainer.insertAdjacentHTML("beforeend", `<bytton class='dots__dot' data-slide='${i}'></button>`))
  }

  function goToSlide(slide) {
    slides.forEach((s, i) => s.style.transform = `translateX(${100 * (i - slide)}%)`);
  }

  function nextSlide() {
    if (curSlide === maxSlide - 1) {
      curSlide = 0;
    } else {
      curSlide++;
    }

    goToSlide(curSlide);
    activeDot(curSlide);
  }
  function prevSlide() {
    if (curSlide === 0) {
      curSlide = maxSlide - 1;
    } else {
      curSlide--;
    }

    goToSlide(curSlide);
    activeDot(curSlide);
  }

  function activeDot(slide) {
    document.querySelectorAll(".dots__dot").forEach((dot) => dot.classList.remove("dots__dot--active"));

    document.querySelector(`.dots__dot[data-slide="${slide}"]`).classList.add("dots__dot--active")
  }

  function init() {
    goToSlide(0);
    createDots();
    activeDot(0);
  }
  init();


  document.addEventListener("keydown", function (e) {
    if (e.key === "ArrowLeft") prevSlide();
    if (e.key === "ArrowRight") nextSlide();
  })


  btnRight.addEventListener("click", nextSlide);
  btnLeft.addEventListener("click", prevSlide);

  dotsContainer.addEventListener("click", function (e) {
    if (e.target.classList.contains("dots__dot")) {
      goToSlide(e.target.dataset.slide);
      activeDot(e.target.dataset.slide);
    }
  })
}

slider();