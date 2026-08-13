/* =========================================================
   Bayramov Theme — Product page JS
   Gallery, variant picker, add to cart
   ========================================================= */
(function () {
  'use strict';

  function qs(sel, ctx) { return (ctx || document).querySelector(sel); }
  function qsa(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }

  function formatMoney(cents, format) {
    if (typeof cents !== 'number') cents = parseInt(cents, 10) || 0;
    format = format || (window.Bayramov && window.Bayramov.moneyFormat) || '{{amount}}';
    var value;
    function defaultTo(a, b) { return isNaN(a) ? b : a; }
    function formatWithDelimiters(number, precision, thousands, decimal) {
      precision = defaultTo(precision, 2);
      thousands = thousands || ',';
      decimal = decimal || '.';
      if (isNaN(number)) return 0;
      number = (number / 100.0).toFixed(precision);
      var parts = number.split('.');
      var dollars = parts[0].replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1' + thousands);
      var cents2 = parts[1] ? decimal + parts[1] : '';
      return dollars + cents2;
    }
    var match = format.match(/\{\{\s*(\w+)\s*\}\}/);
    var placeholder = match ? match[1] : 'amount';
    switch (placeholder) {
      case 'amount': value = formatWithDelimiters(cents, 2); break;
      case 'amount_no_decimals': value = formatWithDelimiters(cents, 0); break;
      case 'amount_with_comma_separator': value = formatWithDelimiters(cents, 2, '.', ','); break;
      case 'amount_no_decimals_with_comma_separator': value = formatWithDelimiters(cents, 0, '.', ','); break;
      default: value = formatWithDelimiters(cents, 2);
    }
    return format.replace(match ? match[0] : '{{amount}}', value);
  }

  qsa('product-info[data-product-info-root]').forEach(function (root) {
    var jsonScript = qs('[data-product-json]', root);
    if (!jsonScript) return;
    var variants;
    try { variants = JSON.parse(jsonScript.textContent); } catch (e) { variants = []; }

    var optionGroups = qsa('[data-option-index]', root);
    var selected = {};
    optionGroups.forEach(function (group) {
      var active = qs('.is-active', group);
      if (active) selected[group.getAttribute('data-option-index')] = active.getAttribute('data-option-value');
    });

    function findVariant() {
      return variants.find(function (v) {
        var opts = [v.option1, v.option2, v.option3];
        return Object.keys(selected).every(function (idx) {
          return opts[parseInt(idx, 10)] === selected[idx];
        });
      });
    }

    function updateUI(variant) {
      var addBtn = qs('[data-add-to-cart]', root);
      var addText = qs('[data-add-to-cart-text]', root);
      var hiddenInput = qs('[data-selected-variant-id]', root);
      var priceBlock = qs('[data-product-price]', root);

      if (!variant) {
        if (addBtn) addBtn.disabled = true;
        if (addText) addText.textContent = window.Bayramov.strings.soldOut;
        return;
      }

      if (hiddenInput) hiddenInput.value = variant.id;

      if (history.replaceState) {
        var url = new URL(window.location.href);
        url.searchParams.set('variant', variant.id);
        history.replaceState({}, '', url);
      }

      if (priceBlock) {
        var onSale = variant.compare_at_price && variant.compare_at_price > variant.price;
        var html = '<div class="price ' + (onSale ? 'price--on-sale' : '') + '">';
        if (!variant.available) {
          html += '<span class="price__badge price__badge--sold-out">' + window.Bayramov.strings.soldOut + '</span>';
        }
        html += '<span class="price__container">';
        if (onSale) {
          html += '<s class="price__compare-at">' + formatMoney(variant.compare_at_price) + '</s>';
          html += '<span class="price__sale">' + formatMoney(variant.price) + '</span>';
        } else {
          html += '<span class="price__regular">' + formatMoney(variant.price) + '</span>';
        }
        html += '</span></div>';
        priceBlock.innerHTML = html;
      }

      if (addBtn) addBtn.disabled = !variant.available;
      if (addText) addText.textContent = variant.available ? window.Bayramov.strings.addToCart : window.Bayramov.strings.soldOut;

      if (variant.featured_media) {
        var layoutRoot = root.closest('.product-layout');
        var slide = layoutRoot && qs('[data-gallery-slide][data-media-id="' + variant.featured_media.id + '"]', layoutRoot);
        if (slide && window.BayramovGallery) {
          window.BayramovGallery.goTo(parseInt(slide.getAttribute('data-index'), 10));
        }
      }
    }

    optionGroups.forEach(function (group) {
      var buttons = qsa('.swatch, .pill', group);
      buttons.forEach(function (btn) {
        btn.addEventListener('click', function () {
          buttons.forEach(function (b) { b.classList.remove('is-active'); });
          btn.classList.add('is-active');
          var idx = group.getAttribute('data-option-index');
          selected[idx] = btn.getAttribute('data-option-value');
          var label = qs('[data-selected-option-value]', group);
          if (label) label.textContent = selected[idx];
          updateUI(findVariant());
        });
      });
    });
  });

  /* ---------- Add to cart (AJAX) ---------- */
  qsa('.product-form').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var btn = qs('[data-add-to-cart]', form);
      var spinner = qs('[data-add-to-cart-spinner]', form);
      var textEl = qs('[data-add-to-cart-text]', form);
      if (btn) btn.disabled = true;
      if (spinner) spinner.hidden = false;
      var formData = new FormData(form);
      fetch('/cart/add.js', {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: formData
      })
        .then(function (res) { return res.json(); })
        .then(function (data) {
          if (spinner) spinner.hidden = true;
          if (data.status) {
            if (btn) btn.disabled = false;
            var errorMsg = data.description || 'Bir hata oluştu';
            if (textEl) textEl.textContent = errorMsg;
            setTimeout(function () { if (textEl) textEl.textContent = window.Bayramov.strings.addToCart; }, 2500);
            return;
          }
          if (btn) btn.disabled = false;
          if (window.BayramovCart && window.BayramovCart.refresh) window.BayramovCart.refresh();
          if (window.Bayramov.cartType === 'drawer' && window.BayramovCart) {
            window.BayramovCart.open();
          } else {
            window.location.href = window.Bayramov.routes.cart_url;
          }
        })
        .catch(function () {
          if (spinner) spinner.hidden = true;
          if (btn) btn.disabled = false;
        });
    });
  });

  /* ---------- Product gallery ---------- */
  qsa('[data-product-gallery]').forEach(function (galleryRoot) {
    var slides = qsa('[data-gallery-slide]', galleryRoot);
    var thumbs = qsa('[data-gallery-thumb]', galleryRoot);
    var prevBtn = qs('[data-gallery-prev]', galleryRoot);
    var nextBtn = qs('[data-gallery-next]', galleryRoot);
    var index = 0;

    function goTo(i) {
      if (!slides.length) return;
      slides[index].classList.add('hidden');
      if (thumbs[index]) thumbs[index].classList.remove('is-active');
      index = (i + slides.length) % slides.length;
      slides[index].classList.remove('hidden');
      if (thumbs[index]) thumbs[index].classList.add('is-active');
    }

    if (prevBtn) prevBtn.addEventListener('click', function () { goTo(index - 1); });
    if (nextBtn) nextBtn.addEventListener('click', function () { goTo(index + 1); });
    thumbs.forEach(function (thumb, i) {
      thumb.addEventListener('click', function () { goTo(i); });
    });

    window.BayramovGallery = window.BayramovGallery || {};
    window.BayramovGallery.goTo = goTo;
  });
})();
