# Last Bite — Frontend Structure

A simple guide to how this Next.js project is organized. This is a beginner-friendly map: read it top to bottom and you will know where everything lives.

## The big idea (two kinds of state)

The app has TWO kinds of state, and they live in different places:

1. **Server data** (listings, bakeries, orders, products) → **React Query**.
   It fetches, caches, and refreshes it. It is never copied into Redux.
2. **Client state** (current bakery owner, shopping cart, small UI bits) → **Redux**.
   The auth token is kept in an HttpOnly cookie; Redux stores the owner and login status.

The data flow:

```
Page  ->  Hook  ->  API function (axios)  ->  Express backend route
           |                |
           |                +-- React Query hooks call lib/api functions
           +-- useAuth / useCart read and change Redux (client state)
```

One rule to remember: **pages never call the API directly**. Pages use hooks; React Query hooks use `lib/api` functions; `useAuth`/`useCart` use Redux.

## Folder tree

```
frontend/
├── next.config.mjs           # Next.js settings and /api rewrite to Express
├── tsconfig.json             # TypeScript settings (enables the "@/..." alias)
├── package.json
├── .env.local                # real values (API address) - never committed
├── .env.local.example        # template to copy from
├── FRONTEND_STRUCTURE.md     # this file
├── public/
│   └── images/               # static images served as /images/...
├── src/
│   ├── app/                          # PAGES: each folder is a web address
│   │   ├── layout.tsx                # main layout: Providers + navbar + footer
│   │   ├── page.tsx                  # /            (HOME: browse active listings)
│   │   ├── loading.tsx / error.tsx / not-found.tsx
│   │   ├── globals.css               # global styles (Tailwind import)
│   │   ├── dev-test/page.tsx         # TEMPORARY data-layer test page (delete later)
│   │   ├── (customer)/               # PUBLIC pages (the (group) name is not in the address)
│   │   │   ├── listings/page.tsx     # /listings
│   │   │   ├── listings/[id]/page.tsx
│   │   │   ├── bakeries/page.tsx
│   │   │   ├── bakeries/[id]/page.tsx
│   │   │   ├── cart/page.tsx
│   │   │   ├── checkout/page.tsx     # guest checkout
│   │   │   ├── order/[code]/page.tsx # /order/A1B2C3 (pickup code lookup)
│   │   │   └── track-order/page.tsx
│   │   ├── (auth)/bakery/
│   │   │   ├── login/page.tsx        # /bakery/login
│   │   │   └── register/page.tsx     # /bakery/register
│   │   └── bakery/                   # PROTECTED owner area (needs login)
│   │       ├── layout.tsx            # dashboard layout with sidebar
│   │       ├── dashboard/page.tsx
│   │       ├── products/...          # list, new, [id]/edit
│   │       ├── listings/...          # list, new, [id]/edit
│   │       ├── orders/...            # list, [id]
│   │       └── profile/page.tsx
│   ├── store/                        # REDUX (client state only!)
│   │   ├── store.ts                  # makeStore() + setupInterceptors wiring
│   │   ├── hooks.ts                  # useAppDispatch / useAppSelector (typed)
│   │   └── slices/
│   │       ├── authSlice.ts          # user, bakery, and loading/loggedIn/loggedOut status
│   │       ├── cartSlice.ts          # one-bakery cart + selectors + localStorage
│   │       └── uiSlice.ts            # mobile menu / cart drawer open flags
│   ├── providers/
│   │   ├── Providers.tsx             # combines ReduxProvider + QueryProvider
│   │   ├── ReduxProvider.tsx         # creates the store once; hydrates the cart after mount
│   │   └── QueryProvider.tsx         # React Query client + devtools (dev only)
│   ├── components/                   # small reusable UI pieces (placeholders)
│   │   ├── ui/                       # Button, Input, Select, Badge, Modal, Spinner, Toast, EmptyState, ErrorMessage, Skeleton
│   │   ├── layout/                   # Navbar, Footer, MobileMenu, DashboardSidebar, DashboardHeader
│   │   ├── listing/                  # ListingCard, ListingGrid, FilterBar, SearchBar, CountdownTimer, DiscountBadge, StockBadge
│   │   ├── bakery/                   # BakeryCard, BakeryHeader
│   │   ├── cart/                     # CartItem, CartSummary, CartIcon
│   │   ├── checkout/                 # CheckoutForm, OrderSummary
│   │   ├── order/                    # PickupCodeCard, OrderStatusBadge, OrderItemsList
│   │   ├── dashboard/                # StatCard, ProductForm, ListingForm, ProductsTable, OrdersTable, PickupCodeChecker
│   │   └── auth/
│   │       ├── LoginForm.tsx / RegisterForm.tsx
│   │       └── ProtectedRoute.tsx    # client navigation check for logged-out users
│   ├── lib/
│   │   ├── api/                      # PLAIN axios functions (no React, no Redux here)
│   │   │   ├── client.ts             # axios cookie credentials + ApiError + setupInterceptors
│   │   │   ├── types.ts              # types of the backend responses
│   │   │   ├── listings.ts           # /api/listings (public)
│   │   │   ├── bakeries.ts           # /api/bakeries (public)
│   │   │   ├── orders.ts             # /api/orders (guest checkout)
│   │   │   ├── bakeryAuth.ts         # /api/auth/bakery (register, login, me)
│   │   │   ├── bakeryProducts.ts     # /api/bakery/products (FormData image upload)
│   │   │   ├── bakeryListings.ts     # /api/bakery/listings
│   │   │   ├── bakeryOrders.ts       # /api/bakery/orders (+ status, pickup code)
│   │   │   └── bakeryProfile.ts      # /api/bakery/profile
│   │   ├── queryKeys.ts              # all React Query cache keys in one place
│   ├── hooks/
│   │   ├── queries/                  # READ server data (React Query)
│   │   │   ├── useListings.ts        # filters + keepPreviousData
│   │   │   ├── useListing.ts / useBakeries.ts / useBakery.ts / useOrderByCode.ts
│   │   │   ├── useBakeryMe.ts        # result copied into Redux authSlice
│   │   │   └── useMyProducts.ts / useMyListings.ts / useMyOrders.ts / useMyProfile.ts
│   │   ├── mutations/                # CHANGE server data (React Query)
│   │   │   ├── usePlaceOrder.ts      # on success: clearCart() via Redux + refresh listings
│   │   │   ├── useBakeryLogin.ts / useBakeryRegister.ts  # store owner and refresh /me
│   │   │   ├── useCreateProduct.ts / useUpdateProduct.ts / useDeleteProduct.ts
│   │   │   ├── useCreateListing.ts / useUpdateListing.ts / useDeleteListing.ts
│   │   │   ├── useUpdateOrderStatus.ts
│   │   │   └── useUpdateProfile.ts
│   │   ├── useAuth.ts                # thin helper over Redux auth + "me" query
│   │   ├── useCart.ts                # thin helper over the Redux cart
│   │   ├── useCountdown.ts           # time left, ticks every second, ended flag
│   │   └── useDebounce.ts            # wait until the user stops typing
│   ├── utils/
│   │   ├── formatPrice.ts            # 250 -> "Rs. 250.00"
│   │   ├── formatDate.ts             # time left "2h 15m" + readable dates
│   │   └── constants.ts              # order statuses + labels, sorts, cities
│   ├── styles/
│   │   └── theme.ts                  # colors, fonts, radius (fill in later)
│   └── proxy.ts                      # server gate: checks for the auth cookie
└── (next to frontend/)
    └── frontend-reference/           # design material, outside the app
```

## Hook -> API function -> backend route

### Reading data (React Query)

| Hook | API function | Backend route |
|---|---|---|
| `useListings(filters)` | `getListings(filters)` | `GET /api/listings?city&search&sort&page&limit` |
| `useListing(id)` | `getListing(id)` | `GET /api/listings/:id` |
| `useBakeries(city?)` | `getBakeries({city})` | `GET /api/bakeries?city` |
| `useBakery(id)` | `getBakery(id)` | `GET /api/bakeries/:id` |
| `useOrderByCode(code)` | `getOrderByCode(code)` | `GET /api/orders/pickup/:code` |
| `useBakeryMe()` (via useAuth) | `getBakeryMe()` | `GET /api/auth/bakery/me` |
| `useMyProducts()` | `getMyProducts()` | `GET /api/bakery/products` |
| `useMyListings(status?)` | `getMyListings({status})` | `GET /api/bakery/listings?status` |
| `useMyOrders(filters)` | `getMyOrders(filters)` | `GET /api/bakery/orders?status` |
| `useMyProfile()` | `getMyProfile()` | `GET /api/bakery/profile` |

### Changing data (React Query mutations + Redux side effects)

| Hook | API function | Backend route |
|---|---|---|
| `usePlaceOrder()` | `placeOrder(data)` | `POST /api/orders` — success: `clearCart()` (Redux) + refresh listings |
| `useBakeryLogin()` | `loginBakery(data)` | `POST /api/auth/bakery/login` — sets cookie and refreshes the `/me` query |
| `useBakeryRegister()` | `registerBakery(data)` | `POST /api/auth/bakery/register` — sets cookie and refreshes the `/me` query |
| `useAuth().logout()` | `logoutBakery()` | `POST /api/auth/bakery/logout` — clears cookie, Redux auth, and query cache |
| `useCreateProduct()` | `createMyProduct(data)` | `POST /api/bakery/products` (FormData image field: `image`) |
| `useUpdateProduct()` | `updateMyProduct(id, data)` | `PUT /api/bakery/products/:id` |
| `useDeleteProduct()` | `deleteMyProduct(id)` | `DELETE /api/bakery/products/:id` |
| `useCreateListing()` | `createMyListing(data)` | `POST /api/bakery/listings` |
| `useUpdateListing()` | `updateMyListing(id, data)` | `PUT /api/bakery/listings/:id` |
| `useDeleteListing()` | `deleteMyListing(id)` | `DELETE /api/bakery/listings/:id` |
| `useUpdateOrderStatus()` | `updateMyOrderStatus(id, status)` | `PATCH /api/bakery/orders/:id/status` |
| `useUpdateProfile()` | `updateMyProfile(data)` | `PUT /api/bakery/profile` |

Also in `lib/api` (used by pages/other hooks): `getMyProduct(id)` → `GET /api/bakery/products/:id`, `getMyOrder(id)` → `GET /api/bakery/orders/:id`, `findMyOrderByPickupCode(code)` → `GET /api/bakery/orders/pickup/:code`.

## How the pieces work together (home page example)

```
src/app/page.tsx
   └─ useListings(filters)                     ← React Query hook (server data)
        └─ getListings(filters)                ← plain API function (axios)
             └─ axios.get("/listings?...")     ← client.ts: calls same-origin /api; Next rewrites to Express
                  → GET /api/listings           (your Express backend through Next.js)
   └─ useCart()                                ← Redux hook (client state)
        └─ "Add to cart" button → cart.add(listing, ...)
```

1. `app/page.tsx` calls `useListings()`. React Query fetches through `getListings` and returns `{ data, isPending, error }`. With `placeholderData: keepPreviousData`, the previous page's listings stay on screen while new filters/page load.
2. The same page also calls `useCart()` (Redux) for the cart count/total. Two hooks, two stores, no overlap: React Query never owns the cart, Redux never owns the listings.
3. A mutation like `usePlaceOrder` does both: it calls `POST /api/orders` through React Query, then `dispatch(clearCart())` (Redux) and `invalidateQueries(listings)` (React Query refresh).

## The rules to remember

- **React Query = server data. Redux = client state.** Never copy a server list into Redux.
- **Pages** live in `src/app/**`; each folder is a web address. `(customer)`/`(auth)` are invisible route groups; `[id]`/`[code]` are dynamic values.
- **`lib/api` files are plain axios functions** — no React Query, no Redux. Easy to test and reuse. Errors always arrive as an `ApiError` with `message` + `status`.
- The axios client needs the store's `logout` action on a protected 401 but cannot import the store (circular import), so `store.ts` calls `setupInterceptors(...)` once.
- **Auth uses an HttpOnly `token` cookie.** On app start, the shared `/api/auth/bakery/me` query checks it and stores the user and bakery in Redux. The browser never reads the token.
- **Only the cart lives in localStorage** and is loaded after mount (`hydrateCart`), avoiding hydration mismatches.
- Cart rules: items from ONE bakery only (adding from another returns `false` → UI asks "Replace your cart?" → `replaceWith`), quantity clamped to `1..quantity_left`.
- **Protection of `/bakery/*`:** `src/proxy.ts` checks that the `token` cookie exists and redirects missing-cookie visitors to login. This is only a quick page check; Express verifies the JWT on every protected API request.
- `.env.local` sets `NEXT_PUBLIC_API_URL=/api` and `BACKEND_URL=http://localhost:5000`. The browser talks to its own Next.js origin; the rewrite forwards `/api/*` to Express.
- **Logout** calls `POST /api/auth/bakery/logout`, then clears Redux auth state and the React Query cache.
- Cookies are HttpOnly, SameSite=Lax, and Secure in production. API state changes accept JSON or multipart requests; configure `CLIENT_URL` to the frontend origin in the backend `.env`.
- `src/app/dev-test/page.tsx` is a **temporary** test page for the data layer — delete the file when real pages exist.
