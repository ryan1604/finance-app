# Finance App

This project is a finance app that allows users to track their financials, with an interactive dashboard, changeable chart types, and intuitive filters.

Try it [here](https://finance-app-three-flame.vercel.app/).

## Features

- **Interactive Charts**: Graphical representation of a user's income and expenses.
- **Account/Date Filters**: Filter transactions by accounts and date range.
- **Account Management**: Create, edit, and delete accounts.
- **Transaction History**: Create, edit, delete transactions, or import them from CSV file.
- **Category Management**: Create, edit, and delete categories.
- **Subscription**: Monthly/Yearly subscription to unlock different chart types and ability to import CSV files.
- **Intuitive UI**: Easy and simple to use buttons to create/edit/delete accounts, transactions, and categories.

## Tools

- **Frontend**:
  - Developed using `React` and `Next.js` for a responsive and dynamic user interface.
  - State management via `Tanstack React Query`.
  - Styled with `TailwindCSS` and `shadcn` components to ensure a modern and aesthetic design.
- **Backend**:
  - Managed with `Drizzle` and `Postgres` using `NeonDB` for efficient database operations.
  - API via `Hono.js`.
- **Payments and Authentication**: Integrated with `Stripe` for secure payment processing and `Clerk` for user authentication.

## Installation

- Fork/Clone the repo to your desktop
- run `npm install` in the root dir of the project
- setup `.env.local` file:
  ```
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
  CLERK_PUBLISHABLE_KEY=
  CLERK_SECRET_KEY=
  
  NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
  NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
  
  DATABASE_URL=
  
  NEXT_PUBLIC_APP_URL=http://localhost:3000
  
  STRIPE_API_KEY=
  STRIPE_WEBHOOK_SECRET=
  ```
- run `npm run dev`
- try it out at `localhost:3000`
