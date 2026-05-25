# Vehicle photos

Drop your vehicle photos in this folder with these exact filenames and the cards will render them automatically:

| File | Vehicle |
|---|---|
| `jetour-t2.jpg` | Jetour T2 (brand new) |
| `camry-xse.jpg` | Toyota Camry 2018 XSE |
| `civic-touring.jpg` | Honda Civic Touring 2016 |
| `sonata.jpg` | Hyundai Sonata 2017 |

Any image format works as long as the filename matches and the extension is `.jpg`. If you prefer a different extension or path, update `imageUrl` in `lib/seed.ts` and the file already saved in localStorage will keep its old value — clear browser storage or use the "Reset" affordance to re-seed.

Recommended size: 1200×800 (16:9), under 500KB. The card crops to 16:9 with object-cover.

If a file is missing, the card falls back to the default car icon — no broken images.
