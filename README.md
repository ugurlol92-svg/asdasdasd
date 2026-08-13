# Bayramov — Shopify Kozmetik Teması

Sıfırdan geliştirilmiş, Online Store 2.0 uyumlu, tamamen **section** tabanlı bir Shopify temasıdır. Kozmetik/güzellik markaları için tasarlanmıştır; tüm sayfalar Shopify tema düzenleyicisinden (Customize) bölüm ekleyip çıkararak, sürükleyip bırakarak özelleştirilebilir.

## Kuruluma başlarken

1. Bu klasörü zip'leyin (klasörün kendisi değil, **içeriği** en üst seviyede olacak şekilde: `layout/`, `sections/`, `templates/` vb. zip'in kökünde olmalı).
2. Shopify Admin → **Online Store → Themes → Add theme → Upload zip dosyası**.
3. Yüklenen temayı **Customize** ile açıp içerikleri (logo, menü, görseller, metinler) kendi markanıza göre düzenleyin.

Alternatif olarak [Shopify CLI](https://shopify.dev/docs/themes/tools/cli) ile `shopify theme push` komutunu da kullanabilirsiniz.

## Yapı

```
layout/           theme.liquid, password.liquid
templates/        Her sayfa tipi için JSON şablonlar (index, product, collection, cart, page, page.contact, 404, search, blog, article, list-collections, customers/*)
sections/         Tüm bölümler (header, footer, homepage blokları, ürün sayfası, koleksiyon, sepet, iletişim, blog...)
snippets/         Tekrar kullanılan parçalar (ürün kartı, fiyat, ikonlar, sayfalama...)
assets/           theme.css, theme.js, product-form.js, cart.js
config/           settings_schema.json (tema ayarları), settings_data.json (varsayılan değerler)
locales/          tr.default.json (varsayılan dil), en.json
```

## Öne çıkan özellikler

- **Tamamen section tabanlı anasayfa**: Slayt gösterisi, kategori listesi, öne çıkan ürünler, görsel+metin, geri sayımlı kampanya bannerı, video, müşteri yorumları, marka şeridi, blog yazıları, Instagram galerisi, bülten kaydı — hepsi eklenebilir/çıkarılabilir/sıralanabilir bloklar.
- **Ürün sayfası** blok tabanlı: başlık, fiyat, varyant seçici (renk/beden yüzeyi), adet seçici, satın alma butonları, açıklama, akordeon bölümler (Kullanım Şekli, İçindekiler, Kargo & İade), paylaşım.
- **Koleksiyon sayfası**: filtreleme (facet), sıralama, sayfalama.
- **Sepet**: açılır panel (drawer) veya sepet sayfası — tema ayarlarından seçilebilir. Ücretsiz kargo ilerleme çubuğu.
- **İletişim sayfası**: form + iletişim bilgileri + harita.
- **Blog & makale sayfaları**, yorum desteği.
- **404** ve **arama sonuçları** sayfaları.
- Tüm renkler 4 renk şeması (scheme-1..4) ile merkezi olarak yönetilir; başlık/gövde fontları Google Fonts seçicisiyle değiştirilebilir.
- Türkçe varsayılan dil (`tr.default.json`), İngilizce alternatif (`en.json`).

## Sonraki adımlar

- `config/settings_schema.json` içindeki "İletişim bilgileri" ve "Sosyal medya" ayarlarını güncelleyin.
- Anasayfadaki örnek görselleri/metinleri kendi ürün fotoğraflarınızla değiştirin.
- Menüleri (Navigation) Shopify Admin'den oluşturup header/footer bölümlerinden seçin.
