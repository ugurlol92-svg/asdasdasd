# Bayramov — Shopify Kozmetik Teması

Shopify'ın resmi **Horizon** temeli üzerine inşa edilmiş, kozmetik/güzellik markaları için özelleştirilmiş bir temadır. Horizon'ın modern "theme blocks" mimarisi sayesinde header, footer, sepet, ürün sayfası, filtreleme, arama gibi tüm karmaşık/riskli parçalar Shopify'ın kendi test ettiği koddur — biz üzerine marka kimliği (renkler, fontlar, metinler, bölüm dizilimi) ekledik.

> Neden Horizon üzerine? Sıfırdan yazılan bir tema, Shopify'ın oldukça ayrıntılı `settings_schema`/`settings_data` kurallarına karşı hataya açık oluyor. Horizon; sepet, varyant seçici, filtreleme, predictive search, çoklu dil gibi kısımları hazır ve test edilmiş getiriyor, biz de üzerine Bayramov kimliğini giydirdik.

## Kuruluma başlarken

1. Bu klasörün içeriğini zip'leyin (klasörün kendisini değil — `layout/`, `sections/`, `templates/` vb. zip'in **kökünde** olmalı).
2. Shopify Admin → **Online Store → Themes → Add theme → Upload zip dosyası**.
3. Yüklenen temayı **Customize** ile açıp logo, menü, görselleri kendi markanıza göre düzenleyin.

Alternatif olarak [Shopify CLI](https://shopify.dev/docs/themes/tools/cli) ile `shopify theme push` de kullanılabilir.

## Neler özelleştirildi

- **Marka kimliği**: `config/settings_schema.json` içindeki `theme_info` → "Bayramov". Renk paleti (`config/settings_data.json` → `color_palette`) kozmetik markasına uygun pudra pembe / bej / sıcak siyah tonlarına çevrildi. Başlık fontu **Playfair Display** (zarif serif), gövde fontu **Jost** (temiz sans-serif) olarak ayarlandı.
- **Varsayılan dil Türkçe**: `locales/tr.default.json` ve `locales/tr.default.schema.json` varsayılan; İngilizce (`en.json`/`en.schema.json`) ikincil dil olarak kaldı. Diğer 25+ dil dosyası da Horizon'dan olduğu gibi geldi (isteğe bağlı aktive edilebilir).
- **Anasayfa** (`templates/index.json`): Hero banner, özellik şeridi (doğal içerik / ücretsiz kargo / güvenli ödeme), kategori vitrin (bento), çok satan ürünler, marka hikayesi (görsel + metin), kayan slogan şeridi, müşteri alıntısı, blog yazıları, bülten kaydı — hepsi Türkçe kozmetik metinleriyle dolduruldu.
- **İletişim sayfası** (`templates/page.contact.json`): Gerçek iletişim formu + gönder butonu Türkçeleştirildi.
- **Footer**: Bülten kaydı, iletişim bilgileri (adres/telefon/e-posta/çalışma saatleri) ve sosyal medya bağlantıları (Instagram/Facebook/TikTok) Bayramov bilgileriyle dolduruldu.
- **Duyuru çubuğu**: "Tüm siparişlerde 500 TL üzeri kargo ücretsiz 🌿"
- Tüm sistem metinleri (404, şifre sayfası, sepet, "bunları da beğenebilirsiniz" vb.) Türkçeleştirildi.

## Yapı (Horizon mimarisi)

```
layout/        theme.liquid, password.liquid
templates/     Her sayfa tipi için JSON şablonlar
sections/      Sayfa bölümleri (header, footer, hero, ürün listesi, koleksiyonlar...)
blocks/        Yeniden kullanılabilir "theme block"lar (metin, görsel, buton, ikon, fiyat, varyant seçici...)
assets/        CSS/JS dosyaları
config/        settings_schema.json (tema ayarları), settings_data.json (mevcut değerler)
locales/       tr.default.json (varsayılan dil) + 25'ten fazla dil dosyası
```

Her bölüm, Shopify tema düzenleyicisinden **section/block olarak eklenip çıkarılabilir, sürüklenip sıralanabilir** — anasayfada hazır gelen dizilimi beğenmezseniz Customize ekranından dilediğiniz gibi yeniden düzenleyebilirsiniz.

## Sonraki adımlar

- **Kategoriler**: Anasayfadaki "Kategoriye Göre Alışveriş" bölümüne, Shopify Admin'den oluşturacağınız koleksiyonları (Cilt Bakımı, Makyaj, Saç Bakımı, Parfüm vb.) Customize ekranından ekleyin — şu an boş bırakıldı çünkü mağazanızda henüz koleksiyon yok.
- **Görseller**: Hero banner ve marka hikayesi bölümlerine kendi ürün/stüdyo fotoğraflarınızı yükleyin.
- **Menü**: Ana menü ve footer menüsünü Shopify Admin → Navigation'dan oluşturun.
- **Blog**: "Blog yazıları" bölümü otomatik olarak seçtiğiniz blogun makalelerini gösterir — bir blog oluşturup birkaç yazı ekleyin.
- **İletişim bilgileri**: Footer'daki adres/telefon/e-posta bilgilerini güncel bilgilerinizle değiştirin.

## Lisans

Bu tema [Shopify Horizon](https://github.com/Shopify/horizon) temelinde geliştirilmiştir (bkz. `LICENSE.md`). Shopify'ın lisansı, bu kodun bir Shopify mağazası için tema geliştirmek amacıyla kopyalanıp özelleştirilmesine izin verir; ayrı bir tema ürünü olarak Shopify Theme Store dışında satılamaz/dağıtılamaz.
