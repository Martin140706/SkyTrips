// Efecto parallax para el hero
window.addEventListener("scroll", function () {
  const hero = document.querySelector(".hero");
  let scrollPosition = window.pageYOffset;
  hero.style.backgroundPositionY = scrollPosition * 0.5 + "px";
});

// Tasa de cambio USD a ARS
const exchangeRate = 1250;

// Datos de seguros por destino
const insuranceData = {
  "París, Francia": {
    cost: 50,
    description:
      "Cobertura médica de €50,000, cancelación por emergencia y pérdida de equipaje hasta €1,000.",
  },
  "Oslo, Noruega": {
    cost: 100,
    description:
      "Cobertura médica de €100,000, rescate en montaña y cancelación por emergencia.",
  },
  "Estocolmo, Suecia": {
    cost: 75,
    description:
      "Cobertura médica de €75,000, cancelación por emergencia y pérdida de equipaje hasta €1,500.",
  },
  "Bari, Italia": {
    cost: 60,
    description: "Cobertura médica de €60,000 y cancelación por emergencia.",
  },
  "Mallorca, España": {
    cost: 50,
    description: "Cobertura médica de €50,000 y cancelación por emergencia.",
  },
};

// Carrito de compras
let cart = [];

// Cargar ciudades desde el JSON
async function loadCities() {
  try {
    const response = await fetch("ciudades.json");
    const data = await response.json();
    return data.paises;
  } catch (error) {
    console.error("Error al cargar las ciudades:", error);
    return [];
  }
}

// Rellenar selectores de ciudades
async function populateCitySelectors() {
  const paises = await loadCities();
  const origenSelect = document.getElementById("origen");
  const destinoSelect = document.getElementById("destino");

  origenSelect.innerHTML =
    '<option value="" selected disabled>Selecciona origen</option>';
  destinoSelect.innerHTML =
    '<option value="" selected disabled>Selecciona destino</option>';

  paises.forEach((pais) => {
    pais.ciudades.forEach((ciudad) => {
      const optionText = `${ciudad}, ${pais.nombre}`;
      const origenOption = document.createElement("option");
      origenOption.value = optionText;
      origenOption.textContent = optionText;
      origenSelect.appendChild(origenOption.cloneNode(true));
      destinoSelect.appendChild(origenOption.cloneNode(true));
    });
  });
}

// Contador de pasajeros
function setupPassengerCounter() {
  const passengerInput = document.getElementById("passengers");
  const minusBtn = document.getElementById("passenger-minus");
  const plusBtn = document.getElementById("passenger-plus");

  minusBtn.addEventListener("click", () => {
    let current = parseInt(passengerInput.value) || 1;
    if (current > 1) passengerInput.value = current - 1;
  });

  plusBtn.addEventListener("click", () => {
    let current = parseInt(passengerInput.value) || 1;
    if (current < 8) passengerInput.value = current + 1;
  });
}

// Función para actualizar el precio en el modal
function updateModalPrice() {
  const modalPrice = document.getElementById("modalPrice");
  const insuranceToggle = document.getElementById("insuranceToggle");
  const insuranceCostElement = document.getElementById("insuranceCost");
  const modalPassengerInput = document.getElementById("modalPassengers");
  const modalTotalPrice = document.getElementById("modalTotalPrice");

  const basePrice = parseInt(modalPrice.textContent.replace(/\D/g, "")) || 0;
  const insurancePrice = insuranceToggle.checked
    ? parseInt(insuranceCostElement.textContent)
    : 0;
  const passengers = parseInt(modalPassengerInput.value) || 1;
  const totalUSD = (basePrice + insurancePrice) * passengers;
  const totalARS = totalUSD * exchangeRate;

  modalTotalPrice.textContent = `$${totalUSD.toLocaleString()} USD (≈ $${totalARS.toLocaleString()} ARS)`;
}

// Configurar modal
function setupModal() {
  const modalOverlay = document.getElementById("modalOverlay");
  const modalClose = document.querySelector(".modal-close");
  const modalTitle = document.getElementById("modalTitle");
  const modalImage = document.getElementById("modalImage");
  const modalPrice = document.getElementById("modalPrice");
  const activitiesList = document.getElementById("activitiesList");
  const insuranceInfo = document.getElementById("insuranceInfo");
  const modalPassengerInput = document.getElementById("modalPassengers");
  const modalPassengerMinus = document.getElementById("modalPassengerMinus");
  const modalPassengerPlus = document.getElementById("modalPassengerPlus");
  const insuranceToggle = document.getElementById("insuranceToggle");
  const insuranceCostElement = document.getElementById("insuranceCost");
  const modalTotalPrice = document.getElementById("modalTotalPrice");
  const modalBookButton = document.querySelector(".modal-book-button");

  const flightTypeBtns = document.querySelectorAll(".flight-type-btn");
  const modalReturnDateContainer = document.getElementById(
    "modalReturnDateContainer"
  );
  const modalDepartureDate = document.getElementById("modalDepartureDate");
  const modalReturnDate = document.getElementById("modalReturnDate");

  // Configurar fecha mínima (hoy)
  const today = new Date().toISOString().split("T")[0];
  modalDepartureDate.min = today;

  // Toggle entre solo ida e ida/vuelta
  flightTypeBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      flightTypeBtns.forEach((b) => b.classList.remove("active"));
      this.classList.add("active");

      if (this.dataset.type === "oneway") {
        modalReturnDateContainer.style.display = "none";
        modalReturnDate.required = false;
      } else {
        modalReturnDateContainer.style.display = "block";
        modalReturnDate.required = true;
      }
      updateModalPrice();
    });
  });

  // Validación de fechas
  modalDepartureDate.addEventListener("change", function () {
    if (this.value) {
      const minReturnDate = new Date(this.value);
      minReturnDate.setDate(minReturnDate.getDate() + 1);
      modalReturnDate.min = minReturnDate.toISOString().split("T")[0];

      if (
        modalReturnDate.value &&
        new Date(modalReturnDate.value) < minReturnDate
      ) {
        modalReturnDate.value = "";
      }
    }
    updateModalPrice();
  });

  modalReturnDate.addEventListener("change", updateModalPrice);

  // Configurar botones de pasajeros del modal
  modalPassengerMinus.addEventListener("click", () => {
    let current = parseInt(modalPassengerInput.value) || 1;
    if (current > 1) {
      modalPassengerInput.value = current - 1;
      updateModalPrice();
    }
  });

  modalPassengerPlus.addEventListener("click", () => {
    let current = parseInt(modalPassengerInput.value) || 1;
    if (current < 8) {
      modalPassengerInput.value = current + 1;
      updateModalPrice();
    }
  });

  modalPassengerInput.addEventListener("change", () => {
    let current = parseInt(modalPassengerInput.value) || 1;
    if (current < 1) modalPassengerInput.value = 1;
    if (current > 8) modalPassengerInput.value = 8;
    updateModalPrice();
  });

  // Configurar toggle de seguro
  insuranceToggle.addEventListener("change", updateModalPrice);

  // Configurar botones "Conocer más"
  document.querySelectorAll(".card-button").forEach((button) => {
    button.addEventListener("click", function (e) {
      e.preventDefault();
      const card = this.closest(".travel-card");
      const title = card.querySelector(".card-title").textContent;
      const price = card.querySelector(".card-price").textContent;
      const imageSrc = card.querySelector(".card-image").src;

      modalTitle.textContent = title;
      modalPrice.textContent = price;
      modalImage.src = imageSrc;

      const insuranceInfoData =
        insuranceData[title] || insuranceData["París, Francia"];
      insuranceCostElement.textContent = insuranceInfoData.cost;
      insuranceInfo.textContent = insuranceInfoData.description;
      insuranceToggle.checked = true;

      // Resetear valores
      modalPassengerInput.value = 1;
      modalDepartureDate.value = "";
      modalReturnDate.value = "";
      flightTypeBtns[0].click(); // Seleccionar ida y vuelta por defecto

      updateModalPrice();
      modalOverlay.style.display = "flex";
      document.body.style.overflow = "hidden";
    });
  });

  // Configurar botón de reservar
  // Configurar botón de reservar
  modalBookButton.addEventListener("click", function () {
    const destination = modalTitle.textContent;

    // Verificar si el destino ya está en el carrito
    const isAlreadyInCart = cart.some(
      (item) => item.destination === destination
    );

    if (isAlreadyInCart) {
      alert(`¡${destination} ya está en tu carrito!`);
      return;
    }

    const basePrice = parseInt(modalPrice.textContent.replace(/\D/g, "")) || 0;
    const insurancePrice = insuranceToggle.checked
      ? parseInt(insuranceCostElement.textContent)
      : 0;
    const passengers = parseInt(modalPassengerInput.value) || 1;
    const departureDate = modalDepartureDate.value;
    const returnDate =
      document.querySelector(".flight-type-btn.active").dataset.type ===
      "roundtrip"
        ? modalReturnDate.value
        : null;
    const imageSrc = modalImage.src;
    const totalARS = (basePrice + insurancePrice) * exchangeRate;

    cart.push({
      destination,
      basePrice,
      insurancePrice,
      totalUSD: basePrice + insurancePrice,
      totalARS,
      passengers,
      departureDate,
      returnDate,
      imageSrc,
      hasInsurance: insuranceToggle.checked,
      tripType: document.querySelector(".flight-type-btn.active").dataset.type,
    });

    updateCart();
    modalOverlay.style.display = "none";
    document.body.style.overflow = "auto";
    alert(`¡${destination} agregado al carrito!`);
  });

  modalClose.addEventListener("click", () => {
    modalOverlay.style.display = "none";
    document.body.style.overflow = "auto";
  });

  modalOverlay.addEventListener("click", (e) => {
    if (e.target === modalOverlay) {
      modalOverlay.style.display = "none";
      document.body.style.overflow = "auto";
    }
  });
}

// Actualizar carrito
function updateCart() {
  const cartItems = document.getElementById("cartItems");
  const cartCount = document.getElementById("cartCount");
  const cartTotalPrice = document.getElementById("cartTotalPrice");

  cartItems.innerHTML = "";
  let totalARS = 0;

  cart.forEach((item, index) => {
    const itemTotal = item.totalARS * item.passengers;
    totalARS += itemTotal;

    const itemElement = document.createElement("div");
    itemElement.className = "cart-item";
    itemElement.innerHTML = `
      <img src="${item.imageSrc}" alt="${
      item.destination
    }" class="cart-item-image">
      <div class="cart-item-details">
        <div class="cart-item-header">
          <div class="cart-item-title">${item.destination}</div>
          <button class="remove-item" data-index="${index}">&times;</button>
        </div>
        <div>
          <span>Pasajeros: </span>
          <input type="number" class="cart-passengers" value="${
            item.passengers
          }" min="1" max="8" data-index="${index}">
        </div>
        <div>${item.tripType === "roundtrip" ? "Ida y vuelta" : "Solo ida"} • ${
      item.hasInsurance ? "Con seguro" : "Sin seguro"
    }</div>
        <div class="cart-item-price">$${itemTotal.toLocaleString()} ARS</div>
      </div>
    `;
    cartItems.appendChild(itemElement);
  });

  // Eventos para eliminar items y cambiar pasajeros
  document.querySelectorAll(".remove-item").forEach((button) => {
    button.addEventListener("click", function () {
      const index = parseInt(this.getAttribute("data-index"));
      cart.splice(index, 1);
      updateCart();
    });
  });

  document.querySelectorAll(".cart-passengers").forEach((input) => {
    input.addEventListener("change", function () {
      const index = parseInt(this.getAttribute("data-index"));
      const newPassengers = parseInt(this.value) || 1;
      if (newPassengers >= 1 && newPassengers <= 8) {
        cart[index].passengers = newPassengers;
        updateCart();
      } else {
        this.value = cart[index].passengers;
      }
    });
  });

  cartCount.textContent = cart.length;
  cartTotalPrice.textContent = `$${totalARS.toLocaleString()} ARS`;
}

// Configurar carrito
function setupCart() {
  const cartButton = document.getElementById("cartButton");
  const cartOverlay = document.getElementById("cartOverlay");
  const cartClose = document.getElementById("cartClose");
  const checkoutButton = document.getElementById("checkoutButton");
  const clearCartButton = document.getElementById("clearCartButton");

  cartButton.addEventListener("click", function () {
    cartOverlay.classList.add("open");
    document.body.style.overflow = "hidden";
  });

  cartClose.addEventListener("click", function () {
    cartOverlay.classList.remove("open");
    document.body.style.overflow = "auto";
  });

  checkoutButton.addEventListener("click", function () {
    if (cart.length > 0) {
      const total = cart.reduce(
        (sum, item) => sum + item.totalARS * item.passengers,
        0
      );
      alert(
        `¡Compra finalizada con éxito! Total: $${total.toLocaleString()} ARS`
      );
      cart = [];
      updateCart();
      cartOverlay.classList.remove("open");
      document.body.style.overflow = "auto";
    } else {
      alert("El carrito está vacío");
    }
  });

  clearCartButton.addEventListener("click", function () {
    if (
      cart.length > 0 &&
      confirm("¿Estás seguro de que quieres vaciar el carrito?")
    ) {
      cart = [];
      updateCart();
    }
  });
}

// Configurar validación de fechas
function setupDateValidation() {
  const today = new Date();
  const departureDateInput = document.querySelector(
    '[placeholder="Fecha de ida"]'
  );
  const returnDateInput = document.querySelector(
    '[placeholder="Fecha de vuelta"]'
  );

  const todayFormatted = today.toISOString().split("T")[0];
  departureDateInput.min = todayFormatted;

  const minReturnDate = new Date(today);
  minReturnDate.setDate(today.getDate() + 3);
  returnDateInput.min = minReturnDate.toISOString().split("T")[0];

  departureDateInput.addEventListener("change", function () {
    if (this.value) {
      const selectedDepartureDate = new Date(this.value);
      const minReturnDate = new Date(selectedDepartureDate);
      minReturnDate.setDate(selectedDepartureDate.getDate() + 3);
      returnDateInput.min = minReturnDate.toISOString().split("T")[0];

      if (
        returnDateInput.value &&
        new Date(returnDateInput.value) < minReturnDate
      ) {
        returnDateInput.value = "";
      }
    }
  });
}

// Inicialización al cargar el DOM
document.addEventListener("DOMContentLoaded", function () {
  const carousel = document.getElementById("carousel");
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");
  const cardWidth = document.querySelector(".travel-card").offsetWidth + 20;

  // Configurar carrusel
  prevBtn.addEventListener("click", () =>
    carousel.scrollBy({ left: -cardWidth, behavior: "smooth" })
  );
  nextBtn.addEventListener("click", () =>
    carousel.scrollBy({ left: cardWidth, behavior: "smooth" })
  );

  // Configurar tipo de vuelo
  const flightTypeBtns = document.querySelectorAll(".flight-type-btn");
  const searchForm = document.querySelector(".search-form");

  flightTypeBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      flightTypeBtns.forEach((b) => b.classList.remove("active"));
      this.classList.add("active");
      searchForm.classList.toggle("oneway", this.dataset.type === "oneway");
    });
  });

  searchForm.addEventListener("submit", function (e) {
    e.preventDefault();
    if (searchForm.classList.contains("oneway")) {
      document.querySelector(
        '[placeholder="Fecha de vuelta"]'
      ).required = false;
    }
    alert("Búsqueda de vuelos realizada (simulación)");
  });

  // Inicializar componentes
  populateCitySelectors();
  setupPassengerCounter();
  setupDateValidation();
  setupModal();
  setupCart();
  updateCart();
});

document.querySelectorAll(".cart-passengers").forEach((input) => {
  input.addEventListener("change", function () {
    const index = parseInt(this.getAttribute("data-index"));
    const newPassengers = parseInt(this.value) || 1;
    if (newPassengers >= 1 && newPassengers <= 8) {
      cart[index].passengers = newPassengers;
      updateCart();
    } else {
      this.value = cart[index].passengers;
    }
  });
});
