// Home page interactions: hero text morph on scroll + scroll-reveal cards.

(function () {
  const text1 = document.getElementById("heroText1");
  const text2 = document.getElementById("heroText2");
  const sub = document.getElementById("heroSub");
  const cue = document.getElementById("scrollCue");

  const MORPH_RANGE = 500; // px of scroll over which the morph completes

  function clamp(v, min, max) {
    return Math.min(max, Math.max(min, v));
  }

  function onScroll() {
    const y = window.scrollY;
    const progress = clamp(y / MORPH_RANGE, 0, 1);

    const t1Opacity = Math.max(0, 1 - progress * 2.2);
    const t2Opacity = clamp((progress - 0.35) * 2.2, 0, 1);
    const t1Blur = progress * 8;
    const lift = progress * -24;

    if (text1) {
      text1.style.opacity = t1Opacity;
      text1.style.filter = `blur(${t1Blur}px)`;
      text1.style.transform = `translateY(${lift}px)`;
    }
    if (text2) {
      text2.style.opacity = t2Opacity;
      text2.style.transform = `translateY(${(1 - t2Opacity) * 24}px)`;
    }
    if (sub) {
      sub.style.opacity = Math.max(0.4, 1 - progress * 0.6);
    }
    if (cue) {
      cue.style.opacity = Math.max(0, 1 - progress * 3);
    }
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // Scroll-reveal for cards
  const revealEls = document.querySelectorAll(".reveal-card");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          setTimeout(() => entry.target.classList.add("in-view"), i * 80);
        }
      });
    },
    { threshold: 0.2 }
  );
  revealEls.forEach((el) => observer.observe(el));
})();