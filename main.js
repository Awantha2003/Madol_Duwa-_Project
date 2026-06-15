/* ==========================================================================
   MADOL DUWA ECO SANCTUARY - INTERACTIVE SCRIPT
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  // DOM Elements
  const navbar = document.getElementById("navbar");
  const menuBtn = document.getElementById("menu-btn");
  const navLinks = document.getElementById("nav-links");
  const menuBtnIcon = menuBtn.querySelector("i");
  const navLinksItems = document.querySelectorAll(".nav__links a");
  const sections = document.querySelectorAll("section, header");
  
  // Date configuration on Booking Widget
  const arrivalInput = document.getElementById("arrival-date");
  const departureInput = document.getElementById("departure-date");
  
  // Setup default date constraints (Today & Tomorrow)
  const today = new Date();
  const yyyy = today.getFullYear();
  let mm = today.getMonth() + 1;
  let dd = today.getDate();
  
  if (mm < 10) mm = '0' + mm;
  if (dd < 10) dd = '0' + dd;
  
  const todayString = `${yyyy}-${mm}-${dd}`;
  
  if (arrivalInput && departureInput) {
    arrivalInput.min = todayString;
    arrivalInput.value = todayString;
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    let tmm = tomorrow.getMonth() + 1;
    let tdd = tomorrow.getDate();
    if (tmm < 10) tmm = '0' + tmm;
    if (tdd < 10) tdd = '0' + tdd;
    
    departureInput.min = `${tomorrow.getFullYear()}-${tmm}-${tdd}`;
    departureInput.value = `${tomorrow.getFullYear()}-${tmm}-${tdd}`;

    // Auto update departure min date when arrival changes
    arrivalInput.addEventListener("change", (e) => {
      const selectedDate = new Date(e.target.value);
      selectedDate.setDate(selectedDate.getDate() + 1);
      
      let dmm = selectedDate.getMonth() + 1;
      let ddd = selectedDate.getDate();
      if (dmm < 10) dmm = '0' + dmm;
      if (ddd < 10) ddd = '0' + ddd;
      
      departureInput.min = `${selectedDate.getFullYear()}-${dmm}-${ddd}`;
      if (new Date(departureInput.value) <= new Date(e.target.value)) {
        departureInput.value = `${selectedDate.getFullYear()}-${dmm}-${ddd}`;
      }
    });
  }

  /* ==========================================================================
     STICKY NAVIGATION & SCROLL ACTIVE LINKS
     ========================================================================== */
  window.addEventListener("scroll", () => {
    // Scroll state for sticky header
    if (window.scrollY > 50) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }

    // Scroll active link highlight
    let current = "";
    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (window.scrollY >= sectionTop - 150) {
        current = section.getAttribute("id");
      }
    });

    navLinksItems.forEach((link) => {
      link.classList.remove("active");
      if (link.getAttribute("href") === `#${current}`) {
        link.classList.add("active");
      }
    });
  });

  /* ==========================================================================
     MOBILE HAMBURGER MENU
     ========================================================================== */
  menuBtn.addEventListener("click", () => {
    navLinks.classList.toggle("open");
    const isOpen = navLinks.classList.contains("open");
    menuBtnIcon.setAttribute("class", isOpen ? "ri-close-line" : "ri-menu-line");
  });

  // Close nav on link click
  navLinksItems.forEach(item => {
    item.addEventListener("click", () => {
      navLinks.classList.remove("open");
      menuBtnIcon.setAttribute("class", "ri-menu-line");
    });
  });

  /* ==========================================================================
     MUTE/UNMUTE INTRO VIDEO
     ========================================================================== */
  const introVideo = document.querySelector(".intro__video video");
  const muteBtn = document.getElementById("video-mute-toggle");
  
  if (muteBtn && introVideo) {
    muteBtn.addEventListener("click", () => {
      introVideo.muted = !introVideo.muted;
      const icon = muteBtn.querySelector("i");
      if (introVideo.muted) {
        icon.setAttribute("class", "ri-volume-mute-line");
        showToast("Muted", "Video volume muted", "info");
      } else {
        icon.setAttribute("class", "ri-volume-up-line");
        showToast("Unmuted", "Eco sanctuary ambient audio playing", "info");
      }
    });
  }

  /* ==========================================================================
     DINING TABS FILTER
     ========================================================================== */
  const tabButtons = document.querySelectorAll(".menu-tab-btn");
  const menuItems = document.querySelectorAll("#menu-items-list li");

  tabButtons.forEach(btn => {
    btn.addEventListener("click", (e) => {
      // Set active button
      tabButtons.forEach(b => b.classList.remove("active"));
      e.target.classList.add("active");

      const category = e.target.getAttribute("data-tab");

      // Filter animation
      menuItems.forEach((item, index) => {
        const itemCategory = item.getAttribute("data-category");
        if (category === "all" || itemCategory === category) {
          item.classList.remove("hide");
          // Staggered fade in
          item.style.animationDelay = `${index * 50}ms`;
          item.classList.add("show");
        } else {
          item.classList.remove("show");
          item.classList.add("hide");
        }
      });
    });
  });

  /* ==========================================================================
     FAQ ACCORDION
     ========================================================================== */
  const faqQuestions = document.querySelectorAll(".faq__question");

  faqQuestions.forEach(btn => {
    btn.addEventListener("click", () => {
      const item = btn.parentElement;
      const answer = btn.nextElementSibling;
      const isActive = item.classList.contains("active");

      // Close all open FAQs
      document.querySelectorAll(".faq__item").forEach(el => {
        el.classList.remove("active");
        el.querySelector(".faq__answer").style.maxHeight = null;
      });

      // Toggle current
      if (!isActive) {
        item.classList.add("active");
        answer.style.maxHeight = answer.scrollHeight + "px";
      }
    });
  });

  /* ==========================================================================
     TESTIMONIALS SLIDER (SWIPER JS)
     ========================================================================== */
  new Swiper('.testimonial-swiper', {
    loop: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false,
    },
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
    speed: 800,
    slidesPerView: 1,
    spaceBetween: 30,
  });

  /* ==========================================================================
     TOAST NOTIFICATIONS UTILITY
     ========================================================================== */
  window.showToast = function(title, msg, type = "success") {
    const container = document.getElementById("toast-container");
    if (!container) return;

    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;
    
    let iconClass = "ri-checkbox-circle-fill";
    if (type === "error") iconClass = "ri-error-warning-fill";
    if (type === "info") iconClass = "ri-information-fill";

    toast.innerHTML = `
      <i class="${iconClass}"></i>
      <div class="toast__content">
        <div class="toast__title">${title}</div>
        <div class="toast__msg">${msg}</div>
      </div>
    `;

    container.appendChild(toast);

    // Auto remove toast
    setTimeout(() => {
      toast.classList.add("removing");
      toast.addEventListener("animationend", () => {
        toast.remove();
      });
    }, 4000);
  };

  /* ==========================================================================
     ROOM DETAILS DATA & MODAL LOGIC
     ========================================================================== */
  const roomsData = {
    "floating-suite": {
      title: "Floating Suite (Over Water)",
      price: 65000,
      image: "assets/room1.jpg",
      badge: "Popular",
      specs: { size: "65 m²", guests: "2 Guests", view: "Lake View", bed: "King Size" },
      desc: "Perched gracefully above the tranquil waters of Koggala Lake, our Floating Suite offers a sensory immersion into nature. Step onto your private timber deck to watch rare migratory birds glide over the waters, or dive straight in for a refreshing morning swim. The suite features sliding glass walls, exposing panoramic lake views directly from your plush bed. Clean local stone floors and natural teak furniture create a beautiful minimalist feel.",
      amenities: ["Direct Lake Access", "Private Sun Deck", "Eco Toiletries", "Free Lagoon Kayak", "Complimentary Wi-Fi", "Espresso Machine", "Mini Bar", "Air Conditioning"]
    },
    "honeymoon-cabin": {
      title: "Luxury Honeymoon Eco-Cabin",
      price: 75000,
      image: "assets/room2.jpg",
      badge: "Romantic",
      specs: { size: "80 m²", guests: "2 Guests", view: "Forest Canopy", bed: "Four-Poster Canopy King" },
      desc: "Designed exclusively for couples seeking intimate seclusion. Enveloped by lush mangrove gardens, this eco-cabin features glass floor observation panels to peek at aquatic life below, and a private wooden canopy terrace complete with a copper outdoor soaking tub. Handcrafted organic fabrics, warm golden lighting, and the therapeutic silence of the sanctuary combine to offer a restorative retreat for you and your loved one.",
      amenities: ["Outdoor Soaking Tub", "Four-Poster Canopy Bed", "Glass Floor Panels", "Bespoke Couple Tour", "Organic Herbal Tea Set", "Premium Sound System", "Private Butler Service", "Minibar Refreshments"]
    },
    "family-villa": {
      title: "Luxury Family Eco-Villa",
      price: 85000,
      image: "assets/room3.jpg",
      badge: "Spacious",
      specs: { size: "140 m²", guests: "4-5 Guests", view: "Reserve & Gardens", bed: "1 King + 2 Single Beds" },
      desc: "Our two-story family eco-villa is constructed from reclaimed local brick and mud plaster, generating natural thermal insulation. Perfectly adapted for families or groups wishing to explore the eco-reserve together. The villa features spacious living areas, open-air rainwater shower bathrooms, a private organic garden patch, and wide balconies overlooking the tropical wetland canopy.",
      amenities: ["Two Levels of Living", "Balcony & Hammock", "Rainwater Shower", "Family Dining Area", "Eco Educational Kits", "Personal Naturalist Guide", "Complimentary Wi-Fi", "Refrigerator & Pantry"]
    }
  };

  const roomModal = document.getElementById("room-detail-modal");
  const roomDetailBody = document.getElementById("room-detail-body");

  window.openRoomDetail = function(roomId) {
    const room = roomsData[roomId];
    if (!room) return;

    let amenitiesHTML = "";
    room.amenities.forEach(am => {
      amenitiesHTML += `<li><i class="ri-checkbox-circle-line"></i> ${am}</li>`;
    });

    roomDetailBody.innerHTML = `
      <div class="room-detail__header">
        <span>${room.badge} Accommodation</span>
        <h2>${room.title}</h2>
      </div>
      <div class="room-detail__slider">
        <img src="${room.image}" alt="${room.title}" />
      </div>
      <div class="room-detail__grid">
        <div class="room-detail__desc">
          <h4>Room Description</h4>
          <p>${room.desc}</p>
          <div class="room__specs" style="margin-bottom:0">
            <span><i class="ri-fullscreen-line"></i> ${room.specs.size}</span>
            <span><i class="ri-user-line"></i> ${room.specs.guests}</span>
            <span><i class="ri-eye-line"></i> ${room.specs.view}</span>
            <span><i class="ri-hotel-bed-line"></i> ${room.specs.bed}</span>
          </div>
        </div>
        <div class="room-detail__amenities">
          <h4>Included Amenities</h4>
          <ul class="amenities-list">
            ${amenitiesHTML}
          </ul>
        </div>
      </div>
      <div class="room-detail__footer">
        <h3>LKR ${room.price.toLocaleString()} <span>/night</span></h3>
        <button class="btn btn-primary" onclick="initiateBooking('${roomId}')">Book This Suite Now</button>
      </div>
    `;

    roomModal.classList.add("open");
  };

  window.closeRoomDetail = function() {
    roomModal.classList.remove("open");
  };

  // Close modals when clicking outside content
  window.addEventListener("click", (e) => {
    if (e.target === roomModal) {
      closeRoomDetail();
    }
    if (e.target === bookingModal) {
      closeBookingModal();
    }
  });

  /* ==========================================================================
     BOOKING WIDGET & RESERVATION CALCULATIONS
     ========================================================================== */
  const bookingModal = document.getElementById("booking-modal");
  
  // Widget Booking Form Submission
  const bookingWidgetForm = document.getElementById("booking-widget-form");
  if (bookingWidgetForm) {
    bookingWidgetForm.addEventListener("submit", (e) => {
      e.preventDefault();
      
      const checkIn = new Date(document.getElementById("arrival-date").value);
      const checkOut = new Date(document.getElementById("departure-date").value);
      const guestVal = document.getElementById("booking-guests").value;
      const roomKey = document.getElementById("booking-room-type").value;
      
      calculateAndShowBooking(roomKey, checkIn, checkOut, guestVal);
    });
  }

  // Header/Nav Booking Click
  const navBookBtn = document.getElementById("nav-book-btn");
  const aboutBookBtn = document.getElementById("about-book-btn");
  const introBookBtn = document.getElementById("intro-book-btn");
  
  const triggerDefaultBooking = () => {
    const checkIn = new Date(arrivalInput.value);
    const checkOut = new Date(departureInput.value);
    const guestVal = document.getElementById("booking-guests").value;
    const roomKey = document.getElementById("booking-room-type").value;
    calculateAndShowBooking(roomKey, checkIn, checkOut, guestVal);
  };

  if (navBookBtn) navBookBtn.addEventListener("click", triggerDefaultBooking);
  if (aboutBookBtn) aboutBookBtn.addEventListener("click", triggerDefaultBooking);
  if (introBookBtn) introBookBtn.addEventListener("click", triggerDefaultBooking);

  // Initiate Booking from Room Modal
  window.initiateBooking = function(roomId) {
    closeRoomDetail();
    
    // Sync booking widget room selection
    const roomSelect = document.getElementById("booking-room-type");
    if (roomSelect) {
      roomSelect.value = roomId;
    }
    
    const checkIn = new Date(arrivalInput.value);
    const checkOut = new Date(departureInput.value);
    const guestVal = document.getElementById("booking-guests").value;
    
    calculateAndShowBooking(roomId, checkIn, checkOut, guestVal);
  };

  // Main Booking Calculator & Modal Populator
  let currentBookingDetails = {}; // Global store for confirmed output

  function calculateAndShowBooking(roomKey, checkIn, checkOut, guests) {
    // 1. Validate dates
    const diffTime = Math.abs(checkOut - checkIn);
    const diffNights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (isNaN(diffNights) || diffNights <= 0) {
      showToast("Date Error", "Departure date must be after arrival date.", "error");
      return;
    }

    // 2. Fetch Room Details
    let roomTitle = "Floating Suite (Over Water)";
    let rate = 65000;
    
    if (roomKey === "honeymoon-cabin" || roomKey === "Luxury Honeymoon Eco-Cabin") {
      roomTitle = "Luxury Honeymoon Eco-Cabin";
      rate = 75000;
    } else if (roomKey === "family-villa" || roomKey === "Luxury Family Eco-Villa") {
      roomTitle = "Luxury Family Eco-Villa";
      rate = 85000;
    }

    // 3. Calculation breakdown
    const subtotal = rate * diffNights;
    const serviceCharge = subtotal * 0.10;
    const tax = subtotal * 0.15;
    const total = subtotal + serviceCharge + tax;

    // Save state
    currentBookingDetails = {
      roomTitle,
      arrival: checkIn.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }),
      departure: checkOut.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }),
      guests,
      nights: diffNights,
      total
    };

    // 4. Populate Modal DOM
    document.getElementById("summary-room-name").textContent = roomTitle;
    document.getElementById("summary-dates").textContent = `${currentBookingDetails.arrival} - ${currentBookingDetails.departure}`;
    document.getElementById("summary-guests").textContent = `${guests} Guest(s)`;
    document.getElementById("summary-nights").textContent = `${diffNights} Night(s)`;
    document.getElementById("summary-rate").textContent = `LKR ${rate.toLocaleString()}`;
    document.getElementById("summary-subtotal").textContent = `LKR ${subtotal.toLocaleString()}`;
    document.getElementById("summary-service-charge").textContent = `LKR ${serviceCharge.toLocaleString()}`;
    document.getElementById("summary-tax").textContent = `LKR ${tax.toLocaleString()}`;
    document.getElementById("summary-total").textContent = `LKR ${total.toLocaleString()}`;

    // 5. Open Modal
    bookingModal.classList.add("open");
  }

  window.closeBookingModal = function() {
    bookingModal.classList.remove("open");
  };

  // Final Reservation Form Confirmation Submit
  const bookingConfirmationForm = document.getElementById("booking-confirmation-form");
  if (bookingConfirmationForm) {
    bookingConfirmationForm.addEventListener("submit", (e) => {
      e.preventDefault();
      
      const guestName = document.getElementById("guest-name").value;
      
      // Close reservation modal
      closeBookingModal();
      
      // Trigger Sweet Toast Alerts
      setTimeout(() => {
        showToast(
          "Reservation Submitted!", 
          `Ayubowan ${guestName}! Your request for ${currentBookingDetails.roomTitle} (${currentBookingDetails.nights} nights) is received.`,
          "success"
        );
      }, 500);

      // Reset forms
      bookingConfirmationForm.reset();
    });
  }

  /* ==========================================================================
     PRELOADER FADE-OUT
     ========================================================================== */
  const preloader = document.getElementById("preloader");
  if (preloader) {
    const fadeOutPreloader = () => {
      setTimeout(() => {
        preloader.classList.add("fade-out");
      }, 500);
    };

    if (document.readyState === "complete") {
      fadeOutPreloader();
    } else {
      window.addEventListener("load", fadeOutPreloader);
    }

    // Fallback if load event delays significantly
    setTimeout(() => {
      if (!preloader.classList.contains("fade-out")) {
        preloader.classList.add("fade-out");
      }
    }, 2500);
  }

  /* ==========================================================================
     SCROLL PROGRESS BAR
     ========================================================================== */
  const progressBar = document.getElementById("scroll-progress");
  if (progressBar) {
    window.addEventListener("scroll", () => {
      const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = height > 0 ? (winScroll / height) * 100 : 0;
      progressBar.style.width = scrolled + "%";
    });
  }

  /* ==========================================================================
     CUSTOM TRAILING CURSOR (LERP EFFECT)
     ========================================================================== */
  const cursorDot = document.getElementById("custom-cursor-dot");
  const cursorOutline = document.getElementById("custom-cursor");
  
  if (cursorDot && cursorOutline && window.innerWidth > 1024) {
    let mouseX = 0, mouseY = 0; 
    let outlineX = 0, outlineY = 0; 
    let isCursorActive = false;
    const speed = 0.12; // Lerp factor (smaller = slower trailing outline)
    
    window.addEventListener("mousemove", (e) => {
      if (!isCursorActive) {
        cursorDot.style.opacity = "1";
        cursorOutline.style.opacity = "1";
        isCursorActive = true;
      }
      
      mouseX = e.clientX;
      mouseY = e.clientY;
      
      cursorDot.style.left = mouseX + "px";
      cursorDot.style.top = mouseY + "px";
    });
    
    // Lerped outline movement loop
    const updateCursorOutline = () => {
      outlineX += (mouseX - outlineX) * speed;
      outlineY += (mouseY - outlineY) * speed;
      
      cursorOutline.style.left = outlineX + "px";
      cursorOutline.style.top = outlineY + "px";
      
      requestAnimationFrame(updateCursorOutline);
    };
    requestAnimationFrame(updateCursorOutline);
    
    // Hide cursor when leaving page bounds
    document.addEventListener("mouseleave", () => {
      cursorDot.style.opacity = "0";
      cursorOutline.style.opacity = "0";
      isCursorActive = false;
    });
    
    // Hover styling logic for cursor
    const hoverTargets = "a, button, .room__card, .feature__card, .faq__question, .logo-circle, input, select, textarea";
    document.addEventListener("mouseover", (e) => {
      if (e.target.closest(hoverTargets)) {
        document.body.classList.add("cursor-hover");
      }
    });
    
    document.addEventListener("mouseout", (e) => {
      if (e.target.closest(hoverTargets)) {
        document.body.classList.remove("cursor-hover");
      }
    });
  }

  /* ==========================================================================
     SCROLL REVEAL (INTERSECTION OBSERVER)
     ========================================================================== */
  const revealElements = document.querySelectorAll(
    ".reveal-fade, .reveal-slide-up, .reveal-slide-left, .reveal-slide-right, .reveal-zoom"
  );
  
  if (revealElements.length > 0) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("reveal-active");
            observer.unobserve(entry.target); // Reveal only once
          }
        });
      },
      {
        threshold: 0.08,
        rootMargin: "0px 0px -40px 0px"
      }
    );
    
    revealElements.forEach((el) => {
      revealObserver.observe(el);
    });
  }

  /* ==========================================================================
     STATS COUNT-UP ANIMATION
     ========================================================================== */
  const countElements = document.querySelectorAll(".stat-count");
  
  if (countElements.length > 0) {
    const countUp = (el) => {
      const target = parseInt(el.getAttribute("data-target"), 10);
      if (isNaN(target)) return;

      const duration = 1800; // 1.8 seconds
      const startTime = performance.now();
      
      const animate = (currentTime) => {
        const elapsedTime = currentTime - startTime;
        const progress = Math.min(elapsedTime / duration, 1);
        
        // Quad ease-out progression
        const easeProgress = progress * (2 - progress);
        const currentValue = Math.floor(easeProgress * target);
        
        el.textContent = currentValue;
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          el.textContent = target;
        }
      };
      
      requestAnimationFrame(animate);
    };
    
    const statsSection = document.querySelector(".about__stats");
    const menuBanner = document.querySelector(".menu__banner");
    
    const statsObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll(".stat-count").forEach((counter) => {
              countUp(counter);
            });
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    
    if (statsSection) statsObserver.observe(statsSection);
    if (menuBanner) statsObserver.observe(menuBanner);
  }

  /* ==========================================================================
     HERO BACKGROUND PARALLAX
     ========================================================================== */
  const heroHeader = document.querySelector(".header");
  if (heroHeader) {
    window.addEventListener("scroll", () => {
      const scrollVal = window.scrollY;
      if (scrollVal <= window.innerHeight) {
        heroHeader.style.backgroundPositionY = `calc(50% + ${scrollVal * 0.45}px)`;
      }
    });
  }
});
