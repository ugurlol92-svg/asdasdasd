/* =========================================================
   Bayramov Theme — Global JS
   Mobile menu, drawers, slideshow, announcement bar,
   countdown timer, predictive search, quick add, filters.
   ========================================================= */
(function () {
  'use strict';

  document.documentElement.classList.remove('no-js');

  /* ---------- Helpers ---------- */
  function qs(sel, ctx) { return (ctx || document).querySelector(sel); }
  function qsa(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }
  function trapFocus(container) {
    var focusable = qsa('a, button, input, textarea, select', container);
    if (focusable.length) focusable[0].focus();
  }

  /* ---------- Mobile menu ---------- */
  var mobileMenu = qs('[data-mobile-menu]');
  qsa('[data-menu-toggle]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      if (!mobileMenu) return;
      var isOpen = mobileMenu.classList.toggle('is-open');
      mobileMenu.setAttribute('aria-hidden', String(!isOpen));
      document.body.style.overflow = isOpen ? 'hidden' : '';
      var toggle = qs('.header__menu-toggle');
      if (toggle) toggle.setAttribute('aria-expanded', String(isOpen));
    });
  });

  /* ---------- Cart drawer ---------- */
  var cartDrawer = qs('#CartDrawer');
  function openCartDrawer() {
    if (!cartDrawer) { window.location.href = window.Bayramov.routes.cart_url; return; }
    cartDrawer.classList.add('is-open');
    cartDrawer.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }
  function closeCartDrawer() {
    if (!cartDrawer) return;
    cartDrawer.classList.remove('is-open');
    cartDrawer.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }
  qsa('[data-cart-drawer-open]').forEach(function (el) {
    el.addEventListener('click', function (e) {
      if (window.Bayramov.cartType !== 'drawer') return;
      e.preventDefault();
      openCartDrawer();
    });
  });
  qsa('[data-cart-drawer-close]').forEach(function (el) { el.addEventListener('click', closeCartDrawer); });
  window.BayramovCart = window.BayramovCart || {};
  window.BayramovCart.open = openCartDrawer;
  window.BayramovCart.close = closeCartDrawer;

  /* ---------- Search drawer ---------- */
  var searchDrawer = qs('#SearchDrawer');
  function openSearchDrawer() {
    if (!searchDrawer) return;
    searchDrawer.classList.add('is-open');
    searchDrawer.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    var input = qs('[data-predictive-search-input]', searchDrawer);
    if (input) setTimeout(function () { input.focus(); }, 100);
  }
  function closeSearchDrawer() {
    if (!searchDrawer) return;
    searchDrawer.classList.remove('is-open');
    searchDrawer.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }
  qsa('[data-search-drawer-open]').forEach(function (el) { el.addEventListener('click', openSearchDrawer); });
  qsa('[data-search-drawer-close]').forEach(function (el) { el.addEventListener('click', closeSearchDrawer); });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      closeCartDrawer();
      closeSearchDrawer();
      if (mobileMenu && mobileMenu.classList.contains('is-open')) {
        mobileMenu.classList.remove('is-open');
        document.body.style.overflow = '';
      }
    }
  });

  /* ---------- Predictive search ---------- */
  var searchInput = qs('[data-predictive-search-input]');
  var resultsEl = qs('[data-predictive-search-results]');
  var searchTimer;
  if (searchInput && resultsEl) {
    searchInput.addEventListener('input', function () {
      var term = searchInput.value.trim();
      clearTimeout(searchTimer);
      if (term.length < 2) { resultsEl.innerHTML = ''; return; }
      searchTimer = setTimeout(function () { runPredictiveSearch(term); }, 280);
    });
  }
  function runPredictiveSearch(term) {
    var url = '/search/suggest.json?q=' + encodeURIComponent(term) + '&resources[type]=product,collection,article,page&resources[limit]=6&section_id=predictive-search';
    fetch(url)
      .then(function (res) { return res.json(); })
      .then(function (data) {
        var resources = data.resources && data.resources.results;
        if (!resources) { resultsEl.innerHTML = ''; return; }
        var html = '';
        if (resources.products && resources.products.length) {
          html += '<div class="predictive-search__group"><p class="predictive-search__group-title">Ürünler</p>';
          resources.products.forEach(function (p) {
            html += '<a class="predictive-search__item" href="' + p.url + '">' +
              (p.featured_image ? '<img src="' + p.featured_image.url + '" alt="" width="56" height="56">' : '') +
              '<span class="predictive-search__item-title">' + p.title + '</span></a>';
          });
          html += '</div>';
        }
        ['collections', 'articles', 'pages'].forEach(function (key) {
          if (resources[key] && resources[key].length) {
            html += '<div class="predictive-search__group"><p class="predictive-search__group-title">' + key + '</p>';
            resources[key].forEach(function (item) {
              html += '<a class="predictive-search__item" href="' + item.url + '"><span class="predictive-search__item-title">' + item.title + '</span></a>';
            });
            html += '</div>';
          }
        });
        resultsEl.innerHTML = html || '<p class="predictive-search__empty">' + (window.Bayramov.strings.noResults || 'Sonuç bulunamadı') + '</p>';
      })
      .catch(function () { resultsEl.innerHTML = ''; });
  }

  /* ---------- Announcement bar rotation ---------- */
  var announcementBar = qs('[data-announcement-bar]');
  if (announcementBar) {
    var items = qsa('[data-announcement-item]', announcementBar);
    var current = 0;
    var speed = parseInt(announcementBar.getAttribute('data-speed'), 10) || 5000;
    var autoplay = announcementBar.getAttribute('data-autoplay') === 'true';
    if (autoplay && items.length > 1) {
      setInterval(function () {
        items[current].hidden = true;
        current = (current + 1) % items.length;
        items[current].hidden = false;
      }, speed);
    }
  }

  /* ---------- Slideshow ---------- */
  qsa('[data-slideshow]').forEach(function (slideshow) {
    var slides = qsa('[data-slide]', slideshow);
    var dots = qsa('[data-slide-dot]', slideshow);
    var prevBtn = qs('[data-slide-prev]', slideshow);
    var nextBtn = qs('[data-slide-next]', slideshow);
    var index = 0;
    var timer;
    var speed = parseInt(slideshow.getAttribute('data-speed'), 10) || 6000;
    var autoplay = slideshow.getAttribute('data-autoplay') === 'true';

    function goTo(i) {
      slides[index].classList.add('hidden');
      if (dots[index]) dots[index].classList.remove('is-active');
      index = (i + slides.length) % slides.length;
      slides[index].classList.remove('hidden');
      if (dots[index]) dots[index].classList.add('is-active');
      restartAnimations(slides[index]);
    }
    function restartAnimations(slide) {
      qsa('.animate-in', slide).forEach(function (el) {
        el.style.animation = 'none';
        void el.offsetWidth;
        el.style.animation = '';
      });
    }
    function next() { goTo(index + 1); }
    function prev() { goTo(index - 1); }
    function restart() {
      clearInterval(timer);
      if (autoplay && slides.length > 1) timer = setInterval(next, speed);
    }
    if (prevBtn) prevBtn.addEventListener('click', function () { prev(); restart(); });
    if (nextBtn) nextBtn.addEventListener('click', function () { next(); restart(); });
    dots.forEach(function (dot, i) {
      dot.addEventListener('click', function () { goTo(i); restart(); });
    });
    restart();
  });

  /* ---------- Countdown timer ---------- */
  qsa('[data-countdown-timer]').forEach(function (timerEl) {
    var end = new Date(timerEl.getAttribute('data-end').replace(' ', 'T')).getTime();
    var daysEl = qs('[data-days]', timerEl);
    var hoursEl = qs('[data-hours]', timerEl);
    var minutesEl = qs('[data-minutes]', timerEl);
    var secondsEl = qs('[data-seconds]', timerEl);
    function pad(n) { return String(n).padStart(2, '0'); }
    function tick() {
      var diff = end - Date.now();
      if (isNaN(end) || diff <= 0) {
        [daysEl, hoursEl, minutesEl, secondsEl].forEach(function (el) { if (el) el.textContent = '00'; });
        return;
      }
      var d = Math.floor(diff / 86400000);
      var h = Math.floor((diff % 86400000) / 3600000);
      var m = Math.floor((diff % 3600000) / 60000);
      var s = Math.floor((diff % 60000) / 1000);
      if (daysEl) daysEl.textContent = pad(d);
      if (hoursEl) hoursEl.textContent = pad(h);
      if (minutesEl) minutesEl.textContent = pad(m);
      if (secondsEl) secondsEl.textContent = pad(s);
    }
    tick();
    setInterval(tick, 1000);
  });

  /* ---------- Video embed play ---------- */
  qsa('[data-video-embed]').forEach(function (wrapper) {
    var playBtn = qs('[data-video-play]', wrapper);
    if (!playBtn) return;
    playBtn.addEventListener('click', function () {
      var url = wrapper.getAttribute('data-video-url');
      var embedUrl = url;
      if (url.indexOf('youtube.com') > -1 || url.indexOf('youtu.be') > -1) {
        var ytId = (url.match(/(?:v=|\.be\/)([\w-]{11})/) || [])[1];
        embedUrl = 'https://www.youtube.com/embed/' + ytId + '?autoplay=1';
      } else if (url.indexOf('vimeo.com') > -1) {
        var vimeoId = (url.match(/vimeo\.com\/(\d+)/) || [])[1];
        embedUrl = 'https://player.vimeo.com/video/' + vimeoId + '?autoplay=1';
      }
      wrapper.innerHTML = '<iframe src="' + embedUrl + '" frameborder="0" allow="autoplay; fullscreen" allowfullscreen style="position:absolute;inset:0;width:100%;height:100%;"></iframe>';
    });
  });

  /* ---------- Generic quantity inputs (not cart-bound) ---------- */
  qsa('[data-quantity-input]').forEach(function (wrapper) {
    if (wrapper.hasAttribute('data-cart-bound')) return;
    var field = qs('[data-quantity-field]', wrapper);
    var decrease = qs('[data-quantity-decrease]', wrapper);
    var increase = qs('[data-quantity-increase]', wrapper);
    if (!field) return;
    if (decrease) decrease.addEventListener('click', function () {
      field.value = Math.max(1, (parseInt(field.value, 10) || 1) - 1);
      field.dispatchEvent(new Event('change', { bubbles: true }));
    });
    if (increase) increase.addEventListener('click', function () {
      field.value = (parseInt(field.value, 10) || 1) + 1;
      field.dispatchEvent(new Event('change', { bubbles: true }));
    });
  });

  /* ---------- Quick add (product cards) ---------- */
  qsa('quick-add-card').forEach(function (el) {
    var btn = qs('button', el);
    if (!btn) return;
    btn.addEventListener('click', function () {
      var hasOnlyDefault = el.getAttribute('data-has-only-default-variant') === 'true';
      if (!hasOnlyDefault) {
        window.location.href = '/products/' + el.getAttribute('data-product-handle');
        return;
      }
      var variantId = el.getAttribute('data-variant-id');
      btn.disabled = true;
      var originalText = btn.textContent;
      btn.textContent = '...';
      fetch('/cart/add.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ id: variantId, quantity: 1 })
      })
        .then(function (res) { return res.json(); })
        .then(function () {
          btn.textContent = originalText;
          btn.disabled = false;
          if (window.BayramovCart && window.BayramovCart.refresh) window.BayramovCart.refresh();
          if (window.Bayramov.cartType === 'drawer') openCartDrawer();
        })
        .catch(function () { btn.textContent = originalText; btn.disabled = false; });
    });
  });

  /* ---------- Collection filters (mobile) ---------- */
  var filtersPanel = qs('[data-filters-panel]');
  qsa('[data-filters-toggle]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      if (!filtersPanel) return;
      filtersPanel.classList.toggle('is-open');
    });
  });

  /* ---------- Sort select ---------- */
  var sortSelect = qs('[data-sort-select]');
  if (sortSelect) {
    sortSelect.addEventListener('change', function () {
      var url = new URL(window.location.href);
      url.searchParams.set('sort_by', sortSelect.value);
      window.location.href = url.toString();
    });
  }

  /* ---------- Marquee pause on hover ---------- */
  qsa('[data-marquee]').forEach(function (marquee) {
    marquee.addEventListener('mouseenter', function () {
      qsa('.brand-logos__group', marquee).forEach(function (g) { g.style.animationPlayState = 'paused'; });
    });
    marquee.addEventListener('mouseleave', function () {
      qsa('.brand-logos__group', marquee).forEach(function (g) { g.style.animationPlayState = 'running'; });
    });
  });
})();
