# RentLoop

> **Don't Buy It. Rent It.**

RentLoop is a functional frontend prototype of a peer-to-peer rental marketplace, built as a college project. It demonstrates the complete renter and owner workflow using browser-local persistence rather than a production backend.

## Overview

RentLoop connects people who need an item temporarily with people who have useful items sitting unused.

Typical examples include:

- Cameras and photography gear
- Projectors and electronics
- Gaming consoles
- Bicycles and sports equipment
- Camping and travel gear
- Tools and event equipment

The prototype is scoped around a Chandigarh/local-area marketplace experience.

## Features

### Renter

- Browse published listings
- Search, filter and sort marketplace items
- View item details and availability
- Select rental dates
- Submit rental requests
- Track pending, upcoming, active and completed rentals
- Save/unsave items for later
- Manage a demo profile

### Owner

- Create listings
- Add up to five listing photos
- Save listings as drafts
- Publish or pause listings
- Edit and delete owned listings
- Review incoming rental requests
- Approve or reject requests
- Track active/completed rentals
- View earnings derived from completed rental records

## Rental Workflow

```text
Explore
  ↓
Item Details
  ↓
Select Dates
  ↓
Booking
  ↓
Rental Request
  ↓
Owner Approval / Rejection
  ↓
Approved Rental
  ↓
Active
  ↓
Completed
```

The data layer validates rental dates, prevents self-rental, checks approved/active date conflicts, and preserves rental history.

## Architecture

```text
React UI
   ↓
Contexts / Hooks
   ↓
Utility + Storage Layer
   ↓
localStorage
```

Main contexts:

- `AuthContext`
- `ListingContext`
- `RentalContext`
- `SavedContext`

The application deliberately keeps the existing frontend architecture rather than adding a backend that is outside the scope of this college prototype.

## Tech Stack

- React 19
- JavaScript
- Vite
- Tailwind CSS
- React Router
- Framer Motion
- Lucide React
- Context API
- Custom hooks
- Browser localStorage

## Project Structure

```text
src/
├── components/
│   ├── auth/
│   ├── dashboard/
│   ├── home/
│   ├── item/
│   ├── listings/
│   ├── marketplace/
│   ├── rentals/
│   └── ui/
├── context/
├── data/
├── hooks/
├── pages/
├── App.jsx
├── index.css
└── main.jsx

tests/
└── rentalUtils.test.js
```

## Routes

| Route | Purpose |
|---|---|
| `/` | Landing page |
| `/explore` | Marketplace |
| `/item/:id` | Item details |
| `/book/:id` | Booking confirmation |
| `/login` | Demo login |
| `/signup` | Demo signup |
| `/renter/dashboard` | Renter dashboard |
| `/renter/rentals` | Renter rentals |
| `/rental/:id` | Rental details |
| `/owner/dashboard` | Owner dashboard |
| `/owner/listings` | Owner listings |
| `/owner/listings/new` | Create listing |
| `/owner/listings/:id/edit` | Edit listing |
| `/owner/requests` | Rental requests |
| `/profile` | Demo profile |

## Local Persistence

RentLoop stores demo state in the browser:

- Authentication session
- Owner listings
- Rental records
- Saved item IDs

This makes the prototype usable without a server and allows the workflow to survive page refreshes on the same browser.

Listing photos are converted to data URLs for the prototype. The image picker limits individual files and total local image storage to reduce browser quota problems.

## Run Locally

Requirements:

- Node.js 20+
- npm

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Run linting:

```bash
npm run lint
```

Run unit tests:

```bash
npm test
```

Build for production:

```bash
npm run build
```

## Demo Accounts

The login page includes demo renter and owner accounts. Users can also create a demo account through the signup flow.

Authentication is intentionally frontend-only. Passwords are used for form validation but are not persisted.

## Important Limitations

This is **not a production marketplace**.

It currently does not provide:

- A real backend/API
- MongoDB/PostgreSQL persistence
- Production authentication, JWT or OAuth
- Real payments
- Email/SMS/push notifications
- KYC or identity verification
- Delivery/logistics integration
- Maps or live geolocation
- Cloud image storage
- Multi-device synchronization
- Real-time WebSocket updates
- Production-grade fraud, trust and safety controls

These are future-scope items for a production implementation.

## Future Scope

A production version could add:

1. Node.js/Express backend
2. MongoDB or PostgreSQL
3. JWT/OAuth authentication
4. Cloud object storage for listing media
5. Payment gateway and refunds
6. Real notifications
7. Owner/renter verification
8. Reviews and ratings
9. Maps and location services
10. Delivery and pickup workflows
11. Real-time request updates
12. Administrative moderation and dispute handling

## Quality Checks

GitHub Actions runs:

- ESLint
- Rental business-rule unit tests
- Vite production build

The main business-rule tests cover valid dates, past dates, invalid ranges, date overlap and rental lifecycle filtering.

---

**RentLoop — a college project demonstrating a complete peer-to-peer rental workflow in a frontend-only environment.**
