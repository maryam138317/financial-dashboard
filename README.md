## Financial Dashboard

### Project Structure
financial-dashboard/
├── app/
│   ├── (auth)/
│   │   └── login/
│   │       └── page.tsx
│   ├── (app)/
│   │   ├── layout.tsx              # shared shell: sidebar/nav, auth guard
│   │   ├── profile/
│   │   │   └── page.tsx            # personal info + change password
│   │   ├── goals/
│   │   │   └── page.tsx
│   │   └── (dashboard)/
│   │       ├── layout.tsx          # the SHARED filter bar (time + type) for home+analytics
│   │       ├── home/
│   │       │   └── page.tsx        # transactions table
│   │       └── analytics/
│   │           └── page.tsx        # pie/bar chart + breakdown table
│   ├── layout.tsx                  # root layout
│   └── globals.css
│
├── components/
│   ├── ui/                         # shadcn generated components
│   ├── filters/
│   │   ├── filter-bar.tsx          # month picker + type tabs (income/expense/saving/all)
│   │   └── use-filter-params.ts    # reads/writes URL search params
│   ├── transactions/
│   │   ├── transaction-table.tsx
│   │   ├── transaction-form.tsx    # add transaction, incl. "save for future" + goal title
│   │   └── transaction-row-actions.tsx
│   ├── analytics/
│   │   ├── category-pie-chart.tsx
│   │   ├── monthly-bar-chart.tsx
│   │   ├── type-summary-cards.tsx  # income/expense/saving side-by-side (type = "all")
│   │   └── category-breakdown-table.tsx
│   ├── goals/
│   │   ├── goal-card.tsx           # progress bar + Buy button
│   │   └── goal-form.tsx
│   └── layout/
│       ├── app-sidebar.tsx
│       └── user-nav.tsx
│
├── lib/
│   ├── types.ts                    # Transaction, Goal, User, TransactionType
│   ├── data.ts                     # seed/mock data (source swapped out later)
│   ├── analytics.ts                # getAnalyticsView(time, type), aggregation helpers
│   └── utils.ts                    # shadcn's cn(), formatters (currency, date)
│
├── store/
│   ├── useAuthStore.ts             # isAuthenticated, current user (persisted)
│   ├── useTransactionStore.ts      # add/update/delete, markAsSaving
│   ├── useGoalStore.ts             # add/contribute/purchaseGoal
│   └── selectors.ts                # derived/filtered data selectors
│
├── hooks/
│   └── use-filtered-transactions.ts # combines URL filters + transaction store
│
├── components.json                 # shadcn config
├── tailwind.config.ts
└── package.json