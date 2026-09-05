# Financial Dashboard

A personal finance dashboard built with Next.js, shadcn/ui, and Zustand — track income, exposes, and savings, visualize spending with charts, and set savings goals you can track to completion.

## Features

- **Authentication** — simple login against seeded user data
- **Transactions** — add, edit, and delete income/exposes/savings entries with category, amount, date, and an optional note
- **Savings goals** — create a goal with a title and target amount, mark savings transactions toward it, and track progress with a live percentage
- **Buy flow** — once a goal reaches 100%, buy it directly from the app; this converts the saved amount into an expose and clears the goal
- **Home page** — transaction table with pagination, responsive down to a stacked card list on mobile
- **Analytics page**
  - Pie chart of category breakdown for the selected type, with a color-matched category table below it
  - Stacked bar chart by month when no single type is selected, showing Income/Expense/Savings side by side
- **Profile page** — view and edit personal information, with a change password flow
- **Responsive layout** — sidebar navigation on desktop, a slide-out drawer with a hamburger menu on mobile

## Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) (App Router)
- **UI Components:** [shadcn/ui](https://ui.shadcn.com/) (built on [Base UI](https://base-ui.com/))
- **State Management:** [Zustand](https://zustand-demo.pmnd.rs/)
- **Charts:** [Recharts](https://recharts.org/)
- **Forms & Validation:** [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Icons:** [Lucide](https://lucide.dev/)
- **Language:** TypeScript

## Data Model

For this first version, data lives in-memory in `lib/data.ts` and is managed through Zustand stores — there is no backend or database yet.

### User

| Field    | Type   | Notes    |
| -------- | ------ | -------- |
| id       | string |          |
| username | string |          |
| password | string |          |
| image    | string | optional |

### Transaction

A transaction is one of three variants, modeled as a discriminated union on `type` so that `goal_id` can only exist on a `Savings` transaction:

| Field    | Type   | Notes                                        |
| -------- | ------ | --------------------------------------------- |
| id       | string |                                                |
| user_id  | string |                                                |
| amount   | number |                                                |
| type     | string | `"Income"` \| `"Expose"` \| `"Savings"`       |
| category | string | depends on `type`, see below                  |
| date     | Date   |                                                |
| goal_id  | string | only present when `type` is `"Savings"`       |

**Categories by type:**
- **Income:** Salary, Bonus, Petty Cash, Others
- **Expose (Expense):** Transport, Beauty, Social Life, Education, Food, Health, Gift, Others
- **Savings:** Save for Future

### Goal

| Field   | Type   | Notes |
| ------- | ------ | ----- |
| id      | string |       |
| user_id | string |       |
| title   | string |       |
| amount  | number | target amount to save |

A goal's saved amount and percentage are derived at read time by summing every `Savings` transaction where `goal_id` matches the goal's `id` — there's no stored running total.

## Getting Started

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.
