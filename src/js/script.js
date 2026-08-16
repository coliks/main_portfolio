document.addEventListener("DOMContentLoaded", () => {
  const slides = document.querySelectorAll(".about-slide");
      const dots = document.querySelectorAll(".carousel-dot");

      let current = 0;
      let autoPlay;

      function getSideOffset() {
        const w = window.innerWidth;
        if (w < 480) return 90;
        if (w < 640) return 105;
        if (w < 768) return 120;
        if (w < 1024) return 130;
        return 140;
      }

      function updateCarousel() {
        const offset = getSideOffset();

        slides.forEach((slide, index) => {
          let position = index - current;

          // Make carousel infinite
          if (position > 2) {
            position -= slides.length;
          }

          if (position < -2) {
            position += slides.length;
          }

          // CENTER
          if (position === 0) {
            slide.style.transform = "translate(-50%, -50%) scale(1)";
            slide.style.opacity = "1";
            slide.style.zIndex = "30";
            slide.style.filter = "none";
            slide.style.pointerEvents = "auto";
          }

          // LEFT
          else if (position === -1) {
            slide.style.transform = `translate(calc(-50% - ${offset}px), -50%) scale(.88)`;
            slide.style.opacity = ".85";
            slide.style.zIndex = "20";
            slide.style.filter = "brightness(.85)";
            slide.style.pointerEvents = "auto";
          }

          // RIGHT
          else if (position === 1) {
            slide.style.transform = `translate(calc(-50% + ${offset}px), -50%) scale(.88)`;
            slide.style.opacity = ".85";
            slide.style.zIndex = "20";
            slide.style.filter = "brightness(.85)";
            slide.style.pointerEvents = "auto";
          }

          // HIDDEN
          else {
            slide.style.transform = "translate(-50%, -50%) scale(.75)";
            slide.style.opacity = "0";
            slide.style.zIndex = "10";
            slide.style.pointerEvents = "none";
          }
        });

        // Update dots
        dots.forEach((dot, index) => {
          if (index === current) {
            dot.classList.remove("w-2.5", "bg-gray-300");
            dot.classList.add("w-7", "bg-[#ef4160]");
          } else {
            dot.classList.remove("w-7", "bg-[#ef4160]");
            dot.classList.add("w-2.5", "bg-gray-300");
          }
        });
      }

      // ==========================================
      // CLICK ANY VISIBLE IMAGE
      // ==========================================

      slides.forEach((slide, index) => {
        slide.addEventListener("click", () => {
          // Already active
          if (index === current) {
            return;
          }

          // Move clicked image to center
          current = index;

          updateCarousel();

          // Restart autoplay
          restartAutoPlay();
        });
      });

      // ==========================================
      // CLICK DOTS
      // ==========================================

      dots.forEach((dot, index) => {
        dot.addEventListener("click", () => {
          current = index;

          updateCarousel();

          restartAutoPlay();
        });
      });

      // ==========================================
      // AUTOPLAY
      // ==========================================

      function startAutoPlay() {
        autoPlay = setInterval(() => {
          current = (current + 1) % slides.length;
          updateCarousel();
        }, 4000);
      }

      function restartAutoPlay() {
        clearInterval(autoPlay);
        startAutoPlay();
      }

      // Recompute slide offsets on resize
      let resizeTimeout;
      window.addEventListener("resize", () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(updateCarousel, 150);
      });

      const navbar = document.getElementById("navbar");

      window.addEventListener("scroll", () => {
        if (window.scrollY > 50) {
          navbar.classList.add("bg-white", "shadow-sm", "border-b");
        } else {
          navbar.classList.remove("bg-white", "shadow-sm", "border-b");
        }
      });

      // ==========================================
      // MOBILE MENU
      // ==========================================

      const menuBtn = document.getElementById("menuBtn");
      const mobileMenu = document.getElementById("mobileMenu");

      menuBtn.addEventListener("click", () => {
        mobileMenu.classList.toggle("hidden");
        mobileMenu.classList.toggle("flex");
      });

      document.querySelectorAll(".navlink-mobile").forEach((link) => {
        link.addEventListener("click", () => {
          mobileMenu.classList.add("hidden");
          mobileMenu.classList.remove("flex");
        });
      });

      const navLinks = document.querySelectorAll(".navlink");
      const sections = document.querySelectorAll("section[id]");

      function setActiveLink(id) {
        navLinks.forEach((link) => {
          link.classList.toggle(
            "active-navlink",
            link.getAttribute("href") === `#${id}`,
          );
        });
      }

      const observer = new IntersectionObserver(
        (entries) => {
          const visibleSection = entries
            .filter((entry) => entry.isIntersecting)
            .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

          if (visibleSection) {
            setActiveLink(visibleSection.target.id);
          }
        },
        {
          rootMargin: "-20% 0px -60% 0px",
          threshold: [0, 0.25, 0.5, 0.75, 1],
        },
      );

      sections.forEach((section) => observer.observe(section));

      // Set Home as active immediately when the page loads
      if (window.scrollY < 100) {
        setActiveLink("home");
      }

      // Keep Home active when at the very top
      window.addEventListener("scroll", () => {
        if (window.scrollY < 100) {
          setActiveLink("home");
        }
      });

      // ==========================================
      // CONTACT FORM (Formspree via fetch)
      // ==========================================

      const contactForm = document.querySelector("#contact form");
      const toast = document.getElementById("toast");
      const toastCard = document.getElementById("toastCard");
      const toastIconWrap = document.getElementById("toastIconWrap");
      const toastIconSuccess = document.getElementById("toastIconSuccess");
      const toastIconError = document.getElementById("toastIconError");
      const toastIconLoading = document.getElementById("toastIconLoading");
      const toastTitle = document.getElementById("toastTitle");
      const toastMessage = document.getElementById("toastMessage");
      const toastClose = document.getElementById("toastClose");
      const toastProgress = document.getElementById("toastProgress");

      let toastTimeout;
      let progressTimeout;

      function showToast(state, title, message) {
        clearTimeout(toastTimeout);
        clearTimeout(progressTimeout);

        // Reset icons
        toastIconSuccess.classList.add("hidden");
        toastIconError.classList.add("hidden");
        toastIconLoading.classList.add("hidden");

        // Reset icon wrap color
        toastIconWrap.className =
          "shrink-0 w-9 h-9 rounded-full flex items-center justify-center";

        if (state === "loading") {
          toastIconLoading.classList.remove("hidden");
          toastIconWrap.classList.add("bg-[#5D3BF1]/10", "text-[#5D3BF1]");
          toastProgress.classList.add("bg-[#5D3BF1]");
        } else if (state === "success") {
          toastIconSuccess.classList.remove("hidden");
          toastIconWrap.classList.add("bg-emerald-50", "text-emerald-500");
          toastProgress.classList.remove("bg-[#5D3BF1]", "bg-red-500");
          toastProgress.classList.add("bg-emerald-500");
        } else if (state === "error") {
          toastIconError.classList.remove("hidden");
          toastIconWrap.classList.add("bg-red-50", "text-red-500");
          toastProgress.classList.remove("bg-[#5D3BF1]", "bg-emerald-500");
          toastProgress.classList.add("bg-red-500");
        }

        toastTitle.textContent = title;
        toastMessage.textContent = message;

        // Slide in
        toast.classList.remove("translate-x-[120%]", "opacity-0");

        // Animate progress bar (only for success/error, auto-dismiss states)
        toastProgress.style.transition = "none";
        toastProgress.style.transform = "scaleX(1)";

        if (state !== "loading") {
          progressTimeout = setTimeout(() => {
            toastProgress.style.transition = "transform 4s linear";
            toastProgress.style.transform = "scaleX(0)";
          }, 50);

          toastTimeout = setTimeout(hideToast, 4000);
        }
      }

      function hideToast() {
        toast.classList.add("translate-x-[120%]", "opacity-0");
        clearTimeout(toastTimeout);
        clearTimeout(progressTimeout);
      }

      toastClose.addEventListener("click", hideToast);

      if (contactForm) {
        contactForm.addEventListener("submit", async (e) => {
          e.preventDefault();

          const submitBtn = contactForm.querySelector(
            'button[type="submit"], button:not([type])',
          );
          const originalBtnHTML = submitBtn.innerHTML;

          submitBtn.disabled = true;
          submitBtn.classList.add("opacity-70", "cursor-not-allowed");
          submitBtn.innerHTML = "<span>Sending...</span>";

          showToast(
            "loading",
            "Sending message…",
            "Hang tight, this only takes a moment.",
          );

          try {
            const formData = new FormData(contactForm);
            const response = await fetch(contactForm.action, {
              method: "POST",
              body: formData,
              headers: { Accept: "application/json" },
            });

            if (response.ok) {
              showToast(
                "success",
                "Message sent!",
                "Thanks for reaching out — I'll get back to you soon.",
              );
              contactForm.reset();
            } else {
              const data = await response.json().catch(() => null);
              const errMsg =
                data && data.errors && data.errors.length
                  ? data.errors.map((err) => err.message).join(", ")
                  : "Something went wrong. Please try again.";
              showToast("error", "Message not sent", errMsg);
            }
          } catch (err) {
            showToast(
              "error",
              "Message not sent",
              "Network error — please check your connection and try again.",
            );
          } finally {
            submitBtn.disabled = false;
            submitBtn.classList.remove("opacity-70", "cursor-not-allowed");
            submitBtn.innerHTML = originalBtnHTML;
          }
        });
      }

      updateCarousel();
      startAutoPlay();
})