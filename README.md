# Audio Store E-Commerce Web App.
---
```

src/app 

├── 📂 core/                         # (Singleton: caricati una volta sola all'avvio) 
│   ├── 🛡️ guards/                   # Protezione rotte 
│   │   ├── auth.guard.ts            # Protegge /user [cite: 19] 
│   │   └── admin.guard.ts           # Protegge /admin [cite: 23] 
│   ├── 🔌 interceptors/ 
│   │   ├── jwt.interceptor.ts       # Appende il Token JWT a ogni richiesta [cite: 112] 
│   │   └── error.interceptor.ts     # Gestione globale errori 
│   └── ⚙️ services/ 
│       └── local-storage.service.ts # Per salvare token e carrello guest [cite: 57] 
│
├── 📂 shared/                       # (Componenti Dumb riutilizzabili ovunque) 
│   ├── 🧩 components/ 
│   │   ├── product-card/            # [Input: Product] -> Mostra foto/prezzo 
│   │   ├── badge/                   # [Input: Status] -> Colore stato ordine 
│   │   ├── paginator/               # Navigazione liste 
│   │   └── breadcrumb/              
│   └── 🎨 ui/                       # Design System (Bottoni, Input, Alert) 
│
├── 📂 features/                     # (Bounded Contexts - Il cuore dell'app) 
│ 
│   ├── 🔐 auth/                     # Contesto: Gestione Identità [cite: 15] 
│   │   ├── components/              # (Presentation) 
│   │   │   ├── login-form/          # Smart Component 
│   │   │   ├── register-form/       # Smart Component [cite: 16] 
│   │   │   └── change-password/     # [cite: 22] 
│   │   ├── state/                   # (State - NgRx/Signals) 
│   │   │   ├── auth.store.ts        # Gestisce User, Token, Role 
│   │   └── services/                # (Infrastructure) 
│   │       └── auth-api.service.ts  # Chiamate: login, register, refresh-token 
│   │ 
│   ├── 🎧 catalog/                  # Contesto: Prodotti [cite: 24] 
│   │   ├── components/ 
│   │   │   ├── product-list/        # Griglia prodotti con filtri [cite: 25] 
│   │   │   ├── product-detail/      # Pagina dettaglio completa [cite: 27] 
│   │   │   └── related-products/    # Carosello correlati [cite: 33] 
│   │   ├── state/ 
│   │   │   ├── catalog.store.ts     # Filtri attivi, lista prodotti caricata 
│   │   └── services/ 
│   │       └── catalog-api.service.ts # GET products, GET categories.
│   ├── 🛒 cart/                     # Contesto: Carrello [cite: 49] 
│   │   ├── components/ 
│   │   │   ├── cart-page/           # Tabella riepilogo 
│   │   │   └── cart-widget/         # Icona header con contatore 
│   │   ├── state/ 
│   │   │   ├── cart.store.ts        # Calcola Totale, IVA in tempo reale [cite: 56] 
│   │   └── services/ 
│   │       └── cart.service.ts      # Logica sync Guest/User + localStorage 
│   ├── 💳 checkout/                 # Contesto: Ordine e Spedizione [cite: 60] 
│   │   ├── components/ 
│   │   │   ├── shipping-step/       # Form Indirizzo [cite: 63] 
│   │   │   ├── summary-step/        # Riepilogo finale [cite: 64] 
│   │   │   └── confirmation-page/   # "Grazie per l'ordine" [cite: 82] 
│   │   ├── state/ 
│   │   │   ├── checkout.store.ts    # Dati temporanei del wizard 
│   │   └── services/ 
│   │       └── order-api.service.ts # POST createOrder  
│   ├── 📦 orders/                   # Contesto: Storico Cliente [cite: 140] 
│   │   ├── components/ 
│   │   │   └── order-history/       # Tabella ordini personali 
│   │   └── services/ 
│   │       └── user-orders.service.ts 
│   └── 👔 admin/                    # Contesto: Back-office [cite: 34, 91] 
│       ├── dashboard/               # Statistiche (Grafici vendite) [cite: 92] 
│       ├── products-manage/         # CRUD Prodotti (Tabella + Edit Form) [cite: 35] 
│       ├── categories-manage/       # CRUD Categorie [cite: 44] 
│       ├── orders-manage/           # Cambio stato ordini [cite: 88] 
│       └── services/ 
│           └── admin-api.service.ts # API privilegiate 
└── 📄 app.routes.ts                 # Lazy Loading di tutte le feature sopra 
```
