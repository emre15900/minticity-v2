import Link from "next/link";

export const metadata = {
  title: "minticity-v2 | Değişiklik Raporu",
  description:
    "V1 ile V2 arasındaki teknik farkları, eklenen özellikleri ve mimari güncellemeleri listeler.",
};

type Section = {
  title: string;
  items: string[];
};

const v1Summary: Section = {
  title: "V1 kısa özet (baseline)",
  items: [
    "Next.js 14 (App Router) + React 18, Tailwind tabanlı sade layout; rotalar: `/`, `/new`, `/users/[id]` (app/page.js vb.).",
    "Data layer: `lib/api.js` fetch + sabit JSONPlaceholder URL, plain JS (TS yok), temel error handling.",
    "LocalStorage: `lib/userStorage.js` ile custom users + deleted ID listesi; `UserListClient` içinde merge, manuel pagination (5) ve search.",
    "Formlar: `UserForm.js` useState + basit required kontroller; fetch ile create/update/delete; avatar, modal, theme toggle veya advanced validation yok.",
  ],
};

const sections: Section[] = [
  {
    title: "Stack & dependency değişimleri",
    items: [
      "Next.js 16 + React 19 RC + TypeScript; dev komutu Turbopack (`package.json`).",
      "Yeni deps: Ant Design, Redux Toolkit/React Redux, Axios, Formik, Yup, Framer Motion, React Icons. V1’de yalnızca Next + React + Tailwind vardı.",
      "Tailwind config TypeScript’e taşındı (`tailwind.config.ts`), `darkMode: 'class'` ve `features/**` taraması eklendi (V1 JS config ve dar kapsamlı tarama yapıyordu).",
    ],
  },
  {
    title: "Architecture & state management",
    items: [
      "Domain-driven dizin: `features/users/{components,hooks,models,pages,services,store,types}`; ortak UI `components/common` (DynamicTable, ThemeToggle, AppLoader, PageSkeleton).",
      "Providers `app/providers.tsx`: Redux Provider + custom ThemeProvider + Ant Design ConfigProvider; `AppLoader` hydration hazır olana dek loader gösteriyor.",
      "Global store `lib/store.ts`, usersSlice (`features/users/store/usersSlice.ts`) ile createAsyncThunk tabanlı CRUD, avatarMap, loading/creating/updating/deletingIds bayrakları.",
      "`useUsersData` hook’u dispatch + AntD message success yönetimini tek yerde topluyor; liste durumu tek kaynak.",
    ],
  },
  {
    title: "Data layer & persistence",
    items: [
      "Axios client `lib/api/client.ts`: baseURL env’den (`NEXT_PUBLIC_API_BASE`, fallback JSONPlaceholder), isteklerde `X-Request-Id`, response interceptor log kontrollü (skipErrorLog flag).",
      "`features/users/services/usersApi.ts` CRUD: create’te fallback random ID, update’te mevcut ID fallback, delete hata olsa da success simüle.",
      "Local cache: `lib/storage/userStorage.ts` (users) + `lib/storage/avatarStorage.ts` (base64 avatar map); slice `writeLocalUsers` ve `setAvatar/removeAvatar` ile persist.",
      "`fetchUsersThunk` hata alırsa cache’e düşer; `deleteUserThunk` localStorage’ı da temizler; `createUserThunk` ağ hatasında bile fallback ID ile listeyi günceller.",
      "Env helper `lib/config/env.ts` env yoksa uyarır ve default base URL’yi kullanır.",
    ],
  },
  {
    title: "UI/UX ve listeleme deneyimi",
    items: [
      "`UsersPage`: search + mode switch (pagination / infinite) + page/pageSize; search 300ms debounce (`useDebounce`), infinite scroll IntersectionObserver’lı `useInfiniteScroll`.",
      "`UserFilters` (AntD Input + Segmented + action buttons): refresh, reset, “Yeni Kullanıcı” modal aç; `Grid.useBreakpoint` ile mobile/desktop davranışı.",
      "`UserTable` (DynamicTable tabanlı): sütun hide/show + width kontrolü (`useDynamicColumns` + localStorage), email/website/company filters, sorter, mailto/tel links, renkli `UserAvatar`; actions: preview, edit, detail, Popconfirm delete.",
      "Mobile view `MobileUserList` (Collapse) aksiyon butonlarıyla; infinite modda skeleton + “liste sonu” mesajı.",
      "Preview/edit modal akışları: `UserPreviewModal`, `UserCreateModal`, `UserEditModal`; başlık ve kartlarda Framer Motion animasyonları.",
      "Loading/error states AntD Skeleton ve Alert ile; boş liste durum mesajı var.",
    ],
  },
  {
    title: "Formlar, Validasyon & UX",
    items: [
      "`UserForm` Formik + Yup: required/min/email/url doğrulamaları, AntD alanları + ikonlar.",
      "Avatar flow: `UserAvatarUpload` (5MB limit, base64), `UserAvatar` isimden renk üretip fallback gösterir; localStorage’da saklanır.",
      "Leave guard: `useLeaveConfirm` (F5/Ctrl+R/beforeunload yakalayıp modal açar) + `LeavePromptModal` hem create hem detail sayfasında dirty state’i korur.",
      "Data mapping: `userMapper.ts` form ↔ API payload; company/website trim edilir; detail sayfası mapUserToFormValues ile dolar.",
      "Success/operation feedback: `useUsersData` içinde AntD message; create sonrası listeye yönlendir, update/delete sonrası state senkron slice tarafından yapılır.",
    ],
  },
  {
    title: "Theme & Style Sistemi",
    items: [
      "Global stil revamp (`app/globals.css`): light/dark vars, gradient backgrounds, glassmorphism kartlar (`card-like`, `glass-card`, `themed-table`, `themed-surface`), `page-shell` padding.",
      "Tema state `lib/theme/ThemeProvider.tsx`: localStorage key `akilli-ticaret:theme`, `data-theme` + html class, color-scheme set.",
      "`app/layout.tsx` init script (beforeInteractive) ilk paint’te doğru tema; ThemeToggle üst barda; ConfigProvider token’ları tema bazlı (primary colors, radius 12, surface tonları).",
      "Tailwind `darkMode: 'class'`, AntD reset entegre; ThemeToggle framer-motion animasyonlu switch.",
    ],
  },
  {
    title: "Hooks & helpers",
    items: [
      "`useDynamicColumns` sütun visibility/width tercihini localStorage’da saklar; `DynamicTable` Popover + Slider ile yönetir.",
      "`useInfiniteScroll` IntersectionObserver + 200px rootMargin ile batch load; `reset` filtre/mod değişince başa sarar.",
      "`useLeaveConfirm` pending action/reload’u tutar, onayla çalıştırır; F5/Ctrl+R & beforeunload dinler.",
      "`useDebounce` generic gecikmeli değer; arama inputunda kullanılıyor.",
    ],
  },
  {
    title: "Developer deneyimi & dökümantasyon",
    items: [
      "TypeScript yapılandırması (`tsconfig.json`, `next-env.d.ts`) ve lint ayarları güncel Next 16 ile uyumlu; README daha kapsamlı (teknolojiler, dizinler, komutlar).",
      "Araç zinciri npm’den yarn’a geçti (yarn.lock, README `yarn install --ignore-engines`).",
      "Tasarım tokenları ve tema toggling için init script + Providers yapısı eklendi; V1’de global provider katmanı yoktu.",
    ],
  },
];

function SectionBlock({ section }: { section: Section }) {
  return (
    <section className="glass-card p-5 md:p-6 space-y-3">
      <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50">
        {section.title}
      </h3>
      <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed text-slate-700 dark:text-slate-100/90">
        {section.items.map((item, idx) => (
          <li key={idx}>{item}</li>
        ))}
      </ul>
    </section>
  );
}

export default function ChangeReportPage() {
  return (
    <div className="page-shell flex justify-center">
      <div className="flex w-full max-w-6xl flex-col gap-4">
        <header className="flex flex-col gap-3 rounded-2xl border border-slate-200/70 bg-white/90 p-5 shadow-lg shadow-slate-200/40 backdrop-blur dark:border-slate-700/70 dark:bg-slate-900/70 dark:shadow-black/40">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="space-y-1">
              <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-300">
                minticity-v2 değişiklik raporu
              </p>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                What changed in V2?
              </h1>
              <p className="text-sm text-slate-600 dark:text-slate-200/80">
                V1 → V2 teknik farklar, eklenen özellikler ve mimari güncellemeler
                hızlı bir özet halinde.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link
                href="/"
                className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-800 shadow-sm transition hover:border-pink-400 hover:text-pink-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:hover:border-sky-400 dark:hover:text-sky-200"
              >
                Anasayfa
              </Link>
            </div>
          </div>
        </header>

        {sections.map((section) => (
          <SectionBlock key={section.title} section={section} />
        ))}
      </div>
    </div>
  );
}

