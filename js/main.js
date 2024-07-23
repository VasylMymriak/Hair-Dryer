$(document).ready(function () {
  // Отримуємо значення цін з HTML
  function calculateDiscounts(container) {
    const oldPrices = $(container).find(".oldPriceValue");
    const newPrices = $(container).find(".newPriceValue");
    const discountPercents = $(container).find(".discountPercent");

    function calculateDiscountPercent(oldPrice, newPrice) {
      const discount = oldPrice - newPrice;
      const discountPercent = Math.round((discount / oldPrice) * 100);
      return discountPercent;
    }

    oldPrices.each(function (index) {
      const oldPrice = parseFloat($(this).text());
      const newPrice = parseFloat(newPrices.eq(index).text());
      const discountPercent = calculateDiscountPercent(oldPrice, newPrice);
      discountPercents.eq(index).text(`-${discountPercent}%`);
    });
  }

  // При кліку на модальному вікні викликаємо функцію обчислення знижок
  $(".modal").on("click", function () {
    // Визначте правильний селектор для модального вікна
    const $modalProductCard = $(this).find(".product__card");
    calculateDiscounts($modalProductCard);
  });

  // Викликаємо функцію для основної сторінки
  calculateDiscounts("body");

  // Викликаємо функцію для модального вікна
  $("#myModal").on("shown.bs.modal", function () {
    calculateDiscounts(this);
  });

  // Викликаємо функцію для другого модального вікна
  $("#myModal-2").on("shown.bs.modal", function () {
    calculateDiscounts(this);
  });
  /////-----Validation-----////
  $("form").submit(function (event) {
    const name = $("#name").val();
    const phone = $("#phone").val();
    const product = $("#product").val();
    const productTwo = $("#product-2").val();

    if (name === "" || phone === "" || (product === "" && productTwo === "")) {
      alert("Будь ласка, заповніть всі поля форми");
      event.preventDefault(); // Перешкоджуємо відправці форми
    }
  });

  //--------Таймер--------
  const currentDate = new Date();

  // Оновлення targetDate без затримки
  let targetDate = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    currentDate.getDate() + 1,
    0,
    0,
    0
  ).getTime();

  // Оновлення таймера один раз без затримки
  updateTimer();

  // Функція оновлення таймера
  function updateTimer() {
    const now = new Date().getTime();
    let distance = targetDate - now;
    const hours = Math.floor(
      (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    const hoursFirstDigit = Math.floor(hours / 10);
    const hoursSecondDigit = hours % 10;
    const minutesFirstDigit = Math.floor(minutes / 10);
    const minutesSecondDigit = minutes % 10;
    const secondsFirstDigit = Math.floor(seconds / 10);
    const secondsSecondDigit = seconds % 10;

    $(".hours-first").text(hoursFirstDigit);
    $(".hours-second").text(hoursSecondDigit);
    $(".minutes-first").text(minutesFirstDigit);
    $(".minutes-second").text(minutesSecondDigit);
    $(".seconds-first").text(secondsFirstDigit);
    $(".seconds-second").text(secondsSecondDigit);

    if (distance < 0) {
      $(".hours-digit").text("2");
      $(".hours-second").text("3");
      $(".minutes-digit").text("5");
      $(".minutes-second").text("9");
      $(".seconds-digit").text("5");
      $(".seconds-second").text("9");

      // Оновлення targetDate для наступного дня
      targetDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        currentDate.getDate() + 2,
        0,
        0,
        0
      ).getTime();
    }

    // Запускаємо оновлення таймера через 1 секунду
    setTimeout(updateTimer, 1000);
  }

  const initialProducts = 26;
  let totalProducts = initialProducts;

  // Функція для оновлення лічильника
  function updateCounter() {
    const now = new Date();
    const midnight = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      0,
      0,
      0
    );
    const nextMidnight = new Date(midnight.getTime() + 24 * 60 * 60 * 1000);
    const remaining = nextMidnight - now;

    if (remaining <= 0) {
      // Оновити кількість продуктів на початкове значення після 00:00:00
      totalProducts = initialProducts;
    } else {
      // Віднімати 1 продукт щогодини
      const hoursRemaining = Math.floor(remaining / (1000 * 60 * 60));
      totalProducts = initialProducts - (24 - hoursRemaining);
    }

    updateDisplay();
  }
  // Функція для оновлення відображення на сторінці
  function updateDisplay() {
    $(".product-count").text(totalProducts);
  }
  // Оновлювати лічильник щосекунди
  setInterval(updateCounter, 1000);
  // Оновити лічильник відразу при завантаженні сторінки
  updateCounter();

  $("[data-fancybox]").fancybox({
    type: "iframe",
    iframe: {
      preload: false,
    },
  });
  //------slider----//
  $(".slide-link").magnificPopup({
    type: "image",
    gallery: {
      enabled: true,
    },
    zoom: {
      enabled: true,
      duration: 300,
      easing: "ease-in-out",
    },
    showCloseBtn: true,
    pinchToClose: true,
    callbacks: {
      open: function () {
        // При відкритті зуму змінюємо ширину на 80%
        this.contentContainer.css("width", "80%");
      },
    },
  });
  $(".slider").slick({
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    dots: false,
    prevArrow: $(".slider-prev"),
    nextArrow: $(".slider-next"),
    adaptiveHeight: true,
    autoplay: true,
    autoplaySpeed: 5000,
  });

  //------Modal-Window-----//
  function getProductDescription(product, formId) {
    switch (product) {
      case "5-nozzles-pink":
        return `
        <div class="product__card">
          <img class="product_card-img" src="img/product-img-1.png" alt="img" />
          <div class="product__card-box">
            <div class="product__card-title">Фен стайлер PRO Super Hair Dryer з 5 насадками рожевий</div>
            <div class="modal__price-box">
            <div class="modal__old-price old__price price ">
              <span class="num oldPriceValue">2599₴</span>
            </div>
            <div class="new__price price modal__new-price">
              <span class="num newPriceValue">1399₴</span>
            </div>
          </div>
        </div>
        `;
      case "5-nozzles-blue":
        return `
        <div class="product__card">
          <img class="product_card-img" src="img/product-img-3.png" alt="img" />
          <div class="product__card-box">
            <div class="product__card-title">Фен стайлер PRO Super Hair Dryer з 5 насадками синій</div>
            <div class="modal__price-box">
            <div class="modal__old-price old__price price ">
              <span class="num oldPriceValue">2599₴</span>
            </div>
            <div class="new__price price modal__new-price">
              <span class="num newPriceValue">1399₴</span>
            </div>
          </div>
        </div>
        `;
      case "5-nozzles-grey":
        return `
        <div class="product__card">
          <img class="product_card-img" src="img/product-img-4.png" alt="img" />
          <div class="product__card-box">
            <div class="product__card-title">Фен стайлер PRO Super Hair Dryer з 5 насадками сірий</div>
            <div class="modal__price-box">
            <div class="modal__old-price old__price price ">
              <span class="num oldPriceValue">2599₴</span>
            </div>
            <div class="new__price price modal__new-price">
              <span class="num newPriceValue">1399₴</span>
            </div>
          </div>
        </div>
        `;
      case "1-nozzle-pink":
        return `
        <div class="product__card">
          <img class="product_card-img" src="img/product-img-2.png" alt="img" />
          <div class="product__card-box">
            <div class="product__card-title">Фен стайлер PRO Super Hair Dryer з 1 насадкою рожевий</div>
            <div class="modal__price-box">
            <div class=" modal__old-price old__price price">
              <span class="num oldPriceValue">1699₴</span>
            </div>
            <div class="new__price price modal__new-price">
              <span class="num newPriceValue">999₴</span>
            </div>
          </div>
        </div>
        `;
      default:
        return "";
    }
  }
  $(".art-stranger").mask("+38(099) 999-99-99");

  // Функція для встановлення курсору у певну позицію в полі вводу телефонного номеру
  $.fn.setCursorPosition = function (pos) {
    if ($(this).get(0).setSelectionRange) {
      $(this).get(0).setSelectionRange(pos, pos);
    } else if ($(this).get(0).createTextRange) {
      var range = $(this).get(0).createTextRange();
      range.collapse(true);
      range.moveEnd("character", pos);
      range.moveStart("character", pos);
      range.select();
    }
  };

  // Встановлення курсору при кліку на полі вводу телефонного номеру
  $('input[type="tel"]').click(function () {
    $(this).setCursorPosition(5); // Встановлюємо позицію номера
  });
  $(".open-modal").click(function () {
    const product = $(this).attr("data-value");
    const productDescription = getProductDescription(product, "myModal");

    // Встановлення значення селектора відповідно до вибраного товару
    const $productSelect = $("#product");
    $productSelect.val(product); // Оновлення значення селектора

    // Оновлення вмісту селектора з допомогою бібліотеки Choices
    choices.setChoiceByValue(product); // Оновлення вмісту селектора

    // Вставлення опису відповідно до вибраного товару
    const $productDescriptionContainer = $("#productDescriptionContainer");
    $productDescriptionContainer.html(productDescription);

    $("#myModal").css("display", "block");
    $("html").addClass("no-skroll");
  });
  // Встановлення опису при зміні вибраного продукту
  $("#product").on("change", function () {
    const selectedProduct = $(this).val();
    const productDescription = getProductDescription(selectedProduct);
    $("#productDescriptionContainer").html(productDescription);
  });


  // Закриття модального вікна при натисканні на хрестик
  $(".close").click(function () {
    $("#myModal").css("display", "none");
    $("html").removeClass("no-skroll");
  });
  // Закриття модального вікна при кліку на поза вікном
  $(window).click(function (event) {
    if (event.target == document.getElementById("myModal")) {
      $("#myModal").css("display", "none");
      $("html").removeClass("no-skroll");
    } 
  });

  const element = document.querySelector(".custom-select");
  const choices = new Choices(element, {
    searchEnabled: false,
    itemSelectText: "",
  });
  // Додайте підключення Choices до другої форми
  const elementwo = document.querySelector("#product-2");
  const choicestwo = new Choices(elementwo, {
    searchEnabled: false,
    itemSelectText: "",
  });

  //-------Modal--Description-----//
  const $productDescriptionContainer = $("#productDescriptionContainer");
  const $productSelect = $("#product");
  // Показуємо опис продукту, вибраного за замовчуванням для першої форми
  const defaultProductValue = $productSelect.val();
  const defaultProductDescription = getProductDescription(defaultProductValue);
  $productDescriptionContainer.html(defaultProductDescription);


  calculateDiscounts($(".product__card"));
});
