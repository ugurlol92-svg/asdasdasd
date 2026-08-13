/* =========================================================
   Bayramov Theme — Cart JS
   Ajax add/change/remove, drawer refresh, header bubble
   ========================================================= */
(function () {
  'use strict';

  function qs(sel, ctx) { return (ctx || document).querySelector(sel); }
  function qsa(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }

  function updateCartCount(count) {
    qsa('[data-cart-count]').forEach(function (el) {
      el.textContent = count;
      el.classList.toggle('hidden', count === 0);
    });
  }

  function refreshCartDrawer() {
    fetch('/?section_id=cart-drawer')
      .then(function (res) { return res.text(); })
      .then(function (html) {
        var parser = new DOMParser();
        var doc = parser.parseFromString(html, 'text/html');
        var newDrawer = doc.querySelector('#CartDrawer');
        var oldDrawer = qs('#CartDrawer');
        if (newDrawer && oldDrawer) {
          var wasOpen = oldDrawer.classList.contains('is-open');
          newDrawer.classList.toggle('is-open', wasOpen);
          oldDrawer.replaceWith(newDrawer);
          bindCartControls(newDrawer);
        }
      })
      .catch(function () {});
  }

  function refresh() {
    fetch('/cart.js')
      .then(function (res) { return res.json(); })
      .then(function (cart) {
        updateCartCount(cart.item_count);
        if (qs('#CartDrawer')) refreshCartDrawer();
        if (qs('.cart-page')) window.location.reload();
      })
      .catch(function () {});
  }

  function changeLine(key, quantity) {
    return fetch('/cart/change.js', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ id: key, quantity: quantity })
    })
      .then(function (res) { return res.json(); })
      .then(function (cart) {
        updateCartCount(cart.item_count);
        return cart;
      });
  }

  function bindCartControls(scope) {
    scope = scope || document;

    qsa('[data-cart-quantity-increase]', scope).forEach(function (btn) {
      btn.addEventListener('click', function () {
        var key = btn.getAttribute('data-key');
        var field = qs('[data-cart-quantity-field][data-key="' + key + '"]', scope);
        var qty = (parseInt(field.value, 10) || 1) + 1;
        field.value = qty;
        changeLine(key, qty).then(refreshAfterChange);
      });
    });

    qsa('[data-cart-quantity-decrease]', scope).forEach(function (btn) {
      btn.addEventListener('click', function () {
        var key = btn.getAttribute('data-key');
        var field = qs('[data-cart-quantity-field][data-key="' + key + '"]', scope);
        var qty = Math.max(0, (parseInt(field.value, 10) || 1) - 1);
        field.value = qty;
        changeLine(key, qty).then(refreshAfterChange);
      });
    });

    qsa('[data-cart-quantity-field]', scope).forEach(function (field) {
      field.addEventListener('change', function () {
        var key = field.getAttribute('data-key');
        var qty = Math.max(0, parseInt(field.value, 10) || 0);
        changeLine(key, qty).then(refreshAfterChange);
      });
    });

    qsa('[data-cart-remove]', scope).forEach(function (btn) {
      btn.addEventListener('click', function () {
        var key = btn.getAttribute('data-key');
        changeLine(key, 0).then(refreshAfterChange);
      });
    });

    qsa('[data-cart-note]', scope).forEach(function (note) {
      var timer;
      note.addEventListener('input', function () {
        clearTimeout(timer);
        timer = setTimeout(function () {
          fetch('/cart/update.js', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
            body: JSON.stringify({ note: note.value })
          });
        }, 500);
      });
    });
  }

  function refreshAfterChange(cart) {
    if (qs('#CartDrawer')) refreshCartDrawer();
    if (qs('.cart-page')) window.location.reload();
  }

  window.BayramovCart = window.BayramovCart || {};
  window.BayramovCart.refresh = refresh;

  document.addEventListener('DOMContentLoaded', function () {
    bindCartControls(document);
    fetch('/cart.js')
      .then(function (res) { return res.json(); })
      .then(function (cart) { updateCartCount(cart.item_count); })
      .catch(function () {});
  });
})();
