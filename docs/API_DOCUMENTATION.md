# RentLoop API Documentation

**Version:** 1.0.0  
**Project:** RentLoop  
**API type:** Proposed REST API specification  
**Status:** Documentation/specification for the future backend

## 1. Overview

RentLoop is a peer-to-peer rental marketplace prototype where owners can list items and renters can discover items, request rentals, and manage their rental activity.

> **Important implementation note:** The current RentLoop college prototype is frontend-only and persists application state with React Context and browser `localStorage`. The endpoints in this document define the REST API contract for a future Node.js/Express backend. They are not claimed to be live endpoints in the current prototype.

## 2. Proposed backend architecture

```
React Frontend
      |
      | HTTPS / REST
      v
Node.js + Express API
      |
      +---- Authentication
      +---- Listings
      +---- Saved Items
      +---- Rentals
      |
      v
Database
```

## 3. Base URL

Development:

```
http://localhost:5000/api
```

## 4. Authentication

Protected endpoints use a JWT bearer token:

```
Authorization: Bearer <JWT_TOKEN>
```

Roles:

- `renter` — browse listings, save items, and create/manage rental requests.
- `owner` — create/manage listings and approve/reject rental requests.

## 5. Standard response format

### Success

```json
{
  "success": true,
  "message": "Operation successful",
  "data": {}
}
```

### Error

```json
{
  "success": false,
  "message": "Human-readable error message",
  "code": "ERROR_CODE"
}
```

## 6. Authentication APIs

### POST /auth/register

Creates a new user.

**Body**
```json
{
  "name": "Demo User",
  "email": "demo@example.com",
  "password": "Password123!",
  "role": "renter",
  "location": "Chandigarh"
}
```

**Expected status:** `201 Created`

### POST /auth/login

Authenticates a user.

**Body**
```json
{
  "email": "demo@example.com",
  "password": "Password123!"
}
```

**Expected status:** `200 OK`

### GET /auth/me

Returns the authenticated user's profile.

**Authentication:** Required

**Expected status:** `200 OK`

### PUT /auth/profile

Updates allowed profile fields.

**Authentication:** Required

**Body**
```json
{
  "name": "Updated Demo User",
  "location": "Chandigarh",
  "preferences": {
    "notifications": true,
    "nearbyAlerts": true
  }
}
```

**Expected status:** `200 OK`

## 7. Listing APIs

| Method | Endpoint | Auth | Purpose |
|---|---|---|---|
| GET | `/listings` | No | Get published listings |
| GET | `/listings/:id` | No | Get listing details |
| POST | `/listings` | Owner | Create listing |
| PUT | `/listings/:id` | Owner | Update listing |
| DELETE | `/listings/:id` | Owner | Delete listing |
| PATCH | `/listings/:id/publish` | Owner | Publish listing |
| PATCH | `/listings/:id/pause` | Owner | Pause listing |

### POST /listings

**Body**
```json
{
  "title": "Sony Camera",
  "description": "Mirrorless camera for local rental.",
  "category": "Cameras",
  "city": "Chandigarh",
  "pricePerDay": 800,
  "images": [],
  "available": true
}
```

**Expected status:** `201 Created`

### GET /listings

Example filtering:
```
GET /listings?category=Cameras&city=Chandigarh&minPrice=500&maxPrice=1500
```

**Expected status:** `200 OK`

## 8. Saved Item APIs

| Method | Endpoint | Auth | Purpose |
|---|---|---|---|
| GET | `/saved` | Required | Get saved listings |
| POST | `/saved/:listingId` | Required | Save a listing |
| DELETE | `/saved/:listingId` | Required | Remove a saved listing |

## 9. Rental APIs

| Method | Endpoint | Auth | Purpose |
|---|---|---|---|
| POST | `/rentals` | Renter | Create rental request |
| GET | `/rentals` | Required | Get user's rentals/requests |
| GET | `/rentals/:id` | Required | Get rental details |
| PATCH | `/rentals/:id/approve` | Owner | Approve request |
| PATCH | `/rentals/:id/reject` | Owner | Reject request |
| PATCH | `/rentals/:id/cancel` | Renter/Owner | Cancel rental |

### POST /rentals

**Body**
```json
{
  "listingId": "listing_123",
  "startDate": "2026-10-05",
  "endDate": "2026-10-07"
}
```

The backend should validate:

- Both dates are present and valid ISO dates.
- Start date is not in the past.
- End date is not before start date.
- The owner cannot rent their own listing.
- Approved/active rental periods cannot overlap.
- The listing exists and is available.
- The calculated subtotal matches duration × price per day.

**Expected status:** `201 Created`

### PATCH /rentals/:id/approve

**Authentication:** Owner

The backend should re-check date conflicts before approval.

**Expected status:** `200 OK`

### PATCH /rentals/:id/reject

**Body**
```json
{
  "reason": "Dates are no longer available."
}
```

**Expected status:** `200 OK`

## 10. Rental lifecycle

```
PENDING
   |
   +----> REJECTED
   |
   v
APPROVED
   |
   v
ACTIVE
   |
   v
COMPLETED
```

## 11. HTTP status codes

| Status | Meaning |
|---|---|
| 200 | Successful request |
| 201 | Resource created |
| 400 | Invalid request |
| 401 | Authentication required/invalid |
| 403 | Insufficient permissions |
| 404 | Resource not found |
| 409 | Conflict, such as overlapping rental |
| 422 | Validation failure |
| 500 | Internal server error |

## 12. Security requirements for the future backend

The production implementation should:

- Hash passwords securely.
- Never return password hashes.
- Validate request bodies.
- Validate ownership before modifying listings.
- Enforce role-based authorization server-side.
- Use HTTPS.
- Rate-limit authentication endpoints.
- Validate uploaded image types and sizes.
- Never trust client-side availability checks.
- Store secrets in environment variables.
- Use a database instead of browser `localStorage`.

## 13. Postman collection

The repository includes:

```
postman/RentLoop_API.postman_collection.json
```

Import it into Postman to view:

- Authentication
- Listings
- Saved Items
- Rentals

Set the `baseUrl` collection variable to the future backend URL.

## 14. Current prototype vs proposed API

| Capability | Current prototype | Proposed backend |
|---|---|---|
| UI | React | React |
| State | Context API | API + database |
| Persistence | localStorage | Database |
| Authentication | Demo/local | JWT + server auth |
| Listings | Local state | REST API |
| Saved items | localStorage | REST API |
| Rentals | localStorage | REST API |
| Images | Browser data URLs | Cloud/object storage |
| Multi-device sync | No | Yes |
| Real payments | No | Future integration |

## 15. Example rental response

```json
{
  "success": true,
  "message": "Rental request created",
  "data": {
    "id": "rental_456",
    "listingId": "listing_123",
    "status": "pending",
    "startDate": "2026-10-05",
    "endDate": "2026-10-07",
    "durationDays": 3,
    "pricePerDay": 800,
    "subtotal": 2400
  }
}
```

## 16. Error example

```json
{
  "success": false,
  "message": "The selected dates overlap an existing approved rental.",
  "code": "RENTAL_CONFLICT"
}
```

---

**Document status:** API specification for the RentLoop college project.  
**Current frontend:** React + Vite + Context API + localStorage.  
**Future backend:** Node.js/Express + database + JWT-based authentication.
