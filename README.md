# Mini User Dashboard

JSONPlaceholder `/users` endpointi üzerinde çalışan, modüler ve dinamik bir kullanıcı yönetim paneli.

## Teknolojiler
- Next.js 15 (App Router, React 19 RC)
- TypeScript, TailwindCSS (dark mode class), Ant Design
- Redux Toolkit + React Redux
- Formik + Yup (form doğrulama)
- Axios (interceptor’lı) + custom hooks (debounce, infinite scroll, leave guard)
- Framer Motion (animasyon), react-icons

## Özellikler
- Liste: dinamik Ant Design tablo, kolon göster/gizle, filtreleme, sorter, yoğunluk ayarı, yenile, responsive (mobilde accordion), satıra tıklayınca detay, uzun metin ellipsis.
- Aksiyonlar: tooltip’li ikonlarla önizleme modalı, edit modalı, detay sayfası, silme popconfirm; avatar (URL varsa resim, yoksa baş harf).
- Arama: debounce (300ms), e-posta/telefon tıklanınca `mailto:`/`tel:`.
- Sayfalama / Infinite Scroll: Segmented switch; Intersection Observer + skeleton yükleme.
- Formlar: Formik + Yup; create modalı, edit/güncelleme; leave-guard modal (yenilemeden önce onay).
- Tema: Light/Dark toggle (persist), Ant Design teması senkron.
- Modüler mimari: `features/users/{components,hooks,services,types,models,store}` + `lib/hooks`, `components/common`.

## Kurulum
```bash
yarn install --ignore-engines
yarn dev
# http://localhost:3000
```

## Önemli Diziler
- `features/users/` : Kullanıcıya özel bileşenler, hook’lar, servisler, tipler, store slice.
- `components/common/` : Dinamik tablo, tema toggle vb. ortak bileşenler.
- `lib/api/client.ts` : Axios instance + interceptor.
- `lib/hooks/` : debounce, infinite scroll, dynamic columns, leave confirm vb.
- `lib/theme/ThemeProvider.tsx` : Light/dark state.

## Komutlar
- `yarn dev` : Geliştirme (Turbopack).
- `yarn lint` : ESLint/TypeScript kontrolleri.
