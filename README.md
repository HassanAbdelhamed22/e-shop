# E-Shop Express API

A complete, professional, and secure RESTful API for an E-commerce platform (E-Shop). Built with Node.js, Express, TypeScript, and MongoDB/Mongoose, it handles all core e-commerce functionalities, user access layers, secure card/cash checkout flows, and automated receipt notifications.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Technology Stack](#2-technology-stack)
3. [Installed Packages](#3-installed-packages)
4. [Project Architecture](#4-project-architecture)
5. [Database Schema & Seeders](#5-database-schema--seeders)
6. [Implemented Features](#6-implemented-features)
7. [Security Implementation](#7-security-implementation)
8. [API Documentation & Modules](#8-api-documentation--modules)
9. [Environment Variables](#9-environment-variables)
10. [Error Handling & API Responses](#10-error-handling--api-responses)
11. [Installation & Setup](#11-installation--setup)
12. [Available Scripts](#12-available-scripts)
13. [Testing](#13-testing)
14. [Deployment Considerations](#14-deployment-considerations)
15. [Limitations & Future Recommendations](#15-limitations--future-recommendations)

---

## 1. Project Overview

The **E-Shop Express API** provides the complete backend business logic for a multi-role e-commerce web application. 

### Main Business Purpose
To serve as a robust, high-performance API supporting product listing, inventory tracking, coupon discounts, shopping carts, addresses, wishlists, customer reviews, and payment operations. It provides a secure workflow from product exploration to shopping cart accumulation and card-based payment processing via Stripe.

### Architecture & Pattern
- **Architectural Pattern**: Service-oriented Layered Architecture. It isolates routing, middleware pipelines, payload input validation, orchestrating controllers, underlying business service layers, database models, and response formatting helpers.
- **Language**: Strongly-typed TypeScript compiled to ES Modules.

### Main User Roles
- **Customer (`user`)**: Explore products, manage their profile, shopping cart, wishlist, shipping addresses, place cash or credit card orders, and write product reviews.
- **Manager (`manager`)**: Administer catalogs, manage brands, categories, subcategories, coupons, and update order statuses.
- **Administrator (`admin`)**: Possesses all manager privileges, plus full user management capabilities (create, update, delete users), password modifications, and deletion of reviews/catalog entries.

---

## 2. Technology Stack

- **Runtime Environment**: Node.js (>= 18.0.0)
- **Application Framework**: Express.js (v5)
- **Database & ODM**: MongoDB & Mongoose
- **Language Compiler**: TypeScript & TSX
- **Authentication**: JSON Web Tokens (JWT via `jsonwebtoken`) and `bcryptjs`
- **Validation**: `express-validator` (based on `validator.js`)
- **File Uploads**: `multer` for multipart form data, `sharp` for image resizing and conversion
- **Email Notifications**: SMTP connection via `nodemailer`
- **Payment Processing**: Stripe API Integration
- **Logging & Monitoring**: `morgan` (development request logs)
- **Security Middlewares**: `helmet`, `cors`, `hpp`, `express-mongo-sanitize`, `express-rate-limit`

---

## 3. Installed Packages

Below are the key dependencies configured in this application (see [package.json](file:///d:/JS/Node.js/e-shop-api/package.json)):

### Production Dependencies

| Package | Version | Purpose | Usage in Project |
| :--- | :--- | :--- | :--- |
| `express` | `^5.2.1` | Application framework | Orchestrates HTTP routing, middleware pipeline, and controllers in [app.ts](file:///d:/JS/Node.js/e-shop-api/src/app.ts). |
| `mongoose` | `^9.7.4` | MongoDB ODM | Manages schemas, validation rules, hooks, and queries in `src/models/` and [database.ts](file:///d:/JS/Node.js/e-shop-api/src/config/database.ts). |
| `jsonwebtoken` | `^9.0.3` | Token-based auth | Signs and verifies user identity tokens in [createToken.ts](file:///d:/JS/Node.js/e-shop-api/src/utils/createToken.ts) and [protect.middleware.ts](file:///d:/JS/Node.js/e-shop-api/src/middlewares/protect.middleware.ts). |
| `bcryptjs` | `^3.0.3` | Cryptographic hashing | Hashes user passwords before saving in [user.model.ts](file:///d:/JS/Node.js/e-shop-api/src/models/user.model.ts). |
| `express-validator` | `^7.3.2` | Input validation | Performs parameters/body checks in `src/utils/validators/` before hitting handlers. |
| `express-rate-limit`| `^8.6.1` | Throttling requests | Restricts excessive requests globally and on auth routes in [rateLimit.middleware.ts](file:///d:/JS/Node.js/e-shop-api/src/middlewares/rateLimit.middleware.ts). |
| `express-mongo-sanitize`| `^2.2.0` | Injection mitigation | Sanitizes request payloads of NoSQL query selectors in [app.ts](file:///d:/JS/Node.js/e-shop-api/src/app.ts). |
| `helmet` | `^8.3.0` | Secure HTTP headers | Sets security headers to prevent common attacks in [app.ts](file:///d:/JS/Node.js/e-shop-api/src/app.ts). |
| `hpp` | `^0.2.3` | Parameter pollution guard | Strips duplicate parameters (except whitelisted keys) from query strings in [app.ts](file:///d:/JS/Node.js/e-shop-api/src/app.ts). |
| `cors` | `^2.8.6` | Cross-Origin resource sharing| Configures cross-origin browser resource access in [app.ts](file:///d:/JS/Node.js/e-shop-api/src/app.ts). |
| `compression` | `^1.8.1` | GZIP compression | Compresses response payloads to optimize bandwidth in [app.ts](file:///d:/JS/Node.js/e-shop-api/src/app.ts). |
| `multer` | `^2.2.0` | Multipart form parsing | Handles file/image uploads in [uploadImage.middleware.ts](file:///d:/JS/Node.js/e-shop-api/src/middlewares/uploadImage.middleware.ts). |
| `sharp` | `^0.35.3` | Image manipulation | Resizes, reformats, and compresses uploads to JPEG in [uploadImage.middleware.ts](file:///d:/JS/Node.js/e-shop-api/src/middlewares/uploadImage.middleware.ts). |
| `nodemailer` | `^9.0.3` | Email distribution | Connects to SMTP server to email verification and reset codes in [sendEmail.ts](file:///d:/JS/Node.js/e-shop-api/src/utils/sendEmail.ts). |
| `stripe` | `^22.3.2` | Stripe payment gateway | Creates checkout sessions and handles card webhook checks in [order.service.ts](file:///d:/JS/Node.js/e-shop-api/src/services/order.service.ts). |
| `slugify` | `^1.6.9` | URL slug generation | Automates slug creations on categories, brands, products, and users schemas. |
| `dotenv` | `^17.4.2` | Environmental loader | Loads configuration constants from files in [server.ts](file:///d:/JS/Node.js/e-shop-api/server.ts). |
| `morgan` | `^1.11.0` | HTTP request logging | Logs incoming endpoints to the console in development mode in [app.ts](file:///d:/JS/Node.js/e-shop-api/src/app.ts). |
| `colors` | `^1.4.0` | Console visual styling | Colorizes log statements in development database connections and seeders. |

### Development Dependencies

| Package | Version | Purpose | Usage in Project |
| :--- | :--- | :--- | :--- |
| `typescript` | `(implicit)`| Type compiling | Compiles TS source code into clean JS structures using [tsconfig.json](file:///d:/JS/Node.js/e-shop-api/tsconfig.json). |
| `nodemon` | `^3.1.14` | Hot reloading server | Restarts development server automatically when source files change. |
| `cross-env` | `^10.1.0` | Cross-platform envs | Defines target configurations (e.g. `NODE_ENV=production`) consistently across OS environments. |
| `eslint` | `^10.7.0` | Code Linting | Static analysis tool to enforce code guidelines (Note: Currently unconfigured/unused without an active `.eslintrc` file). |

---

## 4. Project Architecture

The codebase is structured around a clear separation of concerns:

```
├── config.env                 # Configuration properties for environment contexts
├── server.ts                  # Application bootstrap, server listeners, and uncaught rejection handlers
├── tsconfig.json              # TypeScript compilation rules
├── uploads/                   # Local uploads directory (product cover images, brand logos, user avatars)
└── src/
    ├── app.ts                 # Express setup, security configuration, global error middleware registry
    ├── config/
    │   └── database.ts        # Database connection config and global serialization plugins
    ├── controllers/           # HTTP Request/Response handling, factory routing integration
    ├── middlewares/           # Authentication guards, error traps, rate-limit profiles, multer uploads
    ├── models/                # Mongoose database models, schemas, validators, and virtual transforms
    ├── routes/                # Express endpoint mappings, nested sub-route handlers
    ├── services/              # Complex transaction workflows (auth operations, checkout logic, email triggers)
    ├── types/                 # Express types overrides and catalog interfaces definitions
    └── utils/
        ├── apiError.ts        # Unified client error structure class
        ├── apiFeatures.ts     # Query parsing helpers (filters, pagination, sort, fields projection)
        ├── createToken.ts     # JWT payload signer helper
        ├── emailTemplate.ts   # Receipt mail layouts
        ├── htmlTemplates.ts   # Stripe success/cancel static visual assets
        ├── sanitizeData.ts    # DTO helpers for User, Cart, and Order responses
        ├── validators/        # Validation schemas matching express-validator chains
        └── dummyData/         # Seeding source documents and seeder initialization entry point
```

### Request Lifecycle
```
Client Request
      │
      ▼
Express Route (src/routes/)
      │
      ▼
Protect/AllowedTo middlewares (checks token signatures, roles, etc.)
      │
      ▼
Input Validation (src/utils/validators/ validator chains & catcher middleware)
      │
      ▼
Controller (src/controllers/ parses inputs, interacts with services, formats JSON outputs)
      │
      ▼
Service Layer (src/services/ executes calculations, Stripe card requests, email triggers)
      │
      ▼
Database Layer (src/models/ writes documents using Mongoose, executes pre-save hooks)
      │
      ▼
Response Formatting (src/utils/sanitizeData.ts removes internal system keys)
      │
      ▼
Client Response (GZIP compressed & structured JSON)
```

---

## 5. Database Schema & Seeders

### Connection
The database connects to MongoDB (Atlas or Local) inside [database.ts](file:///d:/JS/Node.js/e-shop-api/src/config/database.ts) using Mongoose.

### Models & Key Relationships
- **`User` $\leftrightarrow$ `Product` (Wishlist)**: User model holds an array reference of product IDs to represent the customer's wishlist.
- **`Product` $\leftrightarrow$ `Category`/`Brand`/`SubCategory`**: Products belong to a specific category and brand, and reference an array of subcategories.
- **`Review` $\leftrightarrow$ `Product` & `User`**: Reviews map directly to a single Product and User, with a compound index to ensure one review per user per product.
- **`Cart` $\leftrightarrow$ `User` & `Product`**: Carts belong to a User and contain `cartItems` referencing Product IDs and quantities.
- **`Order` $\leftrightarrow$ `User` & `Product`**: Orders belong to a User, capture delivery parameters, and snapshot purchasing details (quantity, price, color) along with reference Product IDs.

### Database Seeder
The project includes a seeder tool to initialize the database with dummy data for local development. Seeding source documents are located in [src/utils/dummyData/](file:///d:/JS/Node.js/e-shop-api/src/utils/dummyData/).

- **Import Seed Data**:
  ```bash
  npm run db:import
  ```
- **Destroy Seed Data**:
  ```bash
  npm run db:destroy
  ```

---

## 6. Implemented Features

### 1. User & Authentication
- **Registration**: Custom registration flow with automated name slugification.
- **Login**: Token validation returning JWT access credentials.
- **Token Handling**: Standard stateless JWT tokens. No refresh tokens are implemented.
- **Password Reset**: Generates a secure, temporary 6-digit random code sent via email, valid for 10 minutes.
- **Deactivate Profile**: Customers can perform soft-deactivation on their account.

### 2. Catalog & Products
- **Hierarchical Catalogue**: Multi-level routing (Categories $\rightarrow$ Subcategories).
- **Brand Management**: Independent administration for brand records.
- **Product Parameters**: Handles product quantities, pricing, price after discount, colors, sizes, and ratings.
- **Query Utilities (ApiFeatures)**: Built-in capabilities to handle:
  - **Searching**: Regular expression searches on text fields.
  - **Filtering**: Filters on attributes (e.g. `price[gte]=100`).
  - **Sorting**: Order by single or multiple fields.
  - **Fields Projection**: Exclude or include specific fields.
  - **Pagination**: Limit page results.

### 3. Shopping Cart & Checkout
- **Cart Workflows**: Add items, update quantities, delete items, clear cart, and dynamically calculate totals.
- **Coupon & Discounts**: Validate and apply active coupons to deduct cart prices.
- **Wishlist**: Add/remove products from customer favorites list.
- **Addresses**: Save multiple shipping addresses with specific aliases.

### 4. Orders & Payments
- **Cash on Delivery (COD)**: Create cash-based checkout records.
- **Card Processing (Stripe)**: Initiate Stripe checkout sessions and verify incoming payments using Stripe Webhook callbacks.
- **Inventory Updates**: Automatically decrements product quantities and increments sold counters upon order completion.

### 5. Media & Notifications
- **Image Processing**: Multer memory storage parsed through `sharp` to convert uploads to standard resized JPEG files.
- **Email Notifications**: Generates HTML templates to send order receipts and reset codes via Nodemailer.

---

## 7. Security Implementation

This API implements the following security measures:

| Security Mechanism | Protects Against | Implementation Details | Location in Code |
| :--- | :--- | :--- | :--- |
| **Password Hashing** | Credential leakage | Hashes passwords with `bcryptjs` (salt factor 10) in mongoose pre-save hooks. | [user.model.ts](file:///d:/JS/Node.js/e-shop-api/src/models/user.model.ts) |
| **Route Protection** | Unauthorized access | Verifies JWT signatures, user existence, and verifies token issuance timestamp against password change events. | [protect.middleware.ts](file:///d:/JS/Node.js/e-shop-api/src/middlewares/protect.middleware.ts) |
| **Role-Based Access (RBAC)**| Privilege escalation | Restricts routes by role (`user`, `manager`, `admin`). | [allowedTo.middleware.ts](file:///d:/JS/Node.js/e-shop-api/src/middlewares/allowedTo.middleware.ts) |
| **Global Rate Limiting** | DDoS & brute-force | Limits API requests to 100 requests per 15 minutes per IP. | [rateLimit.middleware.ts](file:///d:/JS/Node.js/e-shop-api/src/middlewares/rateLimit.middleware.ts) |
| **Auth Rate Limiting** | Auth brute-force | Limits login/forgot-password requests to 5 attempts per 15 minutes per IP. | [rateLimit.middleware.ts](file:///d:/JS/Node.js/e-shop-api/src/middlewares/rateLimit.middleware.ts) |
| **Helmet Headers** | Clickjacking, XSS | Injects secure HTTP headers into all API responses. | [app.ts](file:///d:/JS/Node.js/e-shop-api/src/app.ts) |
| **NoSQL Injection Guard** | Query selector injection| Strips MongoDB query operators (starting with `$`) from request payloads. Includes an Express 5 writable query patch. | [app.ts](file:///d:/JS/Node.js/e-shop-api/src/app.ts) |
| **Parameter Pollution Guard**| Query manipulation | Excludes duplicate query parameters unless explicitly whitelisted (e.g. `price`, `brand`). | [app.ts](file:///d:/JS/Node.js/e-shop-api/src/app.ts) |
| **Input Sanitization (XSS)** | Injection scripts | Uses `express-validator`'s `.escape()` and `.trim()` filters on input strings. | `src/utils/validators/` |
| **Response Sanitization (DTO)**| Data leakage | Custom DTO mappers and a global Mongoose plugin filter out internal versioning keys (`__v`) and sensitive fields from responses. | [sanitizeData.ts](file:///d:/JS/Node.js/e-shop-api/src/utils/sanitizeData.ts) & [database.ts](file:///d:/JS/Node.js/e-shop-api/src/config/database.ts) |
| **CORS Configuration** | Unauthorized domains | Configured with defaults to block unauthorized cross-origin requests. | [app.ts](file:///d:/JS/Node.js/e-shop-api/src/app.ts) |
| **Secure Token Expiry** | Session hijacking | Short JWT access expiration lifespan (15 minutes). | [config.env](file:///d:/JS/Node.js/e-shop-api/config.env) |
| **Secure Temp Codes** | Token guessing | Hashed 6-digit codes stored in the DB with a short 10-minute validity. | [user.model.ts](file:///d:/JS/Node.js/e-shop-api/src/models/user.model.ts) |
| **MIME Type Validation** | Malicious file execution| Multi-part form filters verify file types and accept only `image/*` formats. | [uploadImage.middleware.ts](file:///d:/JS/Node.js/e-shop-api/src/middlewares/uploadImage.middleware.ts) |
| **Production Error Masking** | System footprinting | Hides stack traces and database error objects in production mode. | [error.middleware.ts](file:///d:/JS/Node.js/e-shop-api/src/middlewares/error.middleware.ts) |

### Missing Security Measures (Recommendations):
- **Refresh Token Rotation**: Missing. The API uses a single short-lived JWT.
- **Secure Cookies (HttpOnly)**: Missing. JWTs are sent via HTTP headers instead of secure cookies.
- **File Upload Size Limits**: Missing. Multer configurations do not set `limits.fileSize`, exposing the server to large file disk/RAM exhaustion.

---

## 8. API Documentation & Modules

Since there are no Swagger UI pages or Postman collections in this repository, here is the routing schema.

### API Modules

| Module | Base Route | Auth? | Allowed Roles | Main Operations |
| :--- | :--- | :--- | :--- | :--- |
| **Auth** | `/api/v1/auth` | No | Public | Signup, Login, Password Reset code requests |
| **Users** | `/api/v1/users` | Yes | `admin` (base routes), All (profile/me) | CRUD users, Change passwords, Edit/Deactivate my profile |
| **Products** | `/api/v1/products` | Mixed | Read: Public \| Write: `admin`, `manager` | CRUD product items, resize/upload covers |
| **Categories** | `/api/v1/categories` | Mixed | Read: Public \| Write: `admin`, `manager` | CRUD category catalogs |
| **SubCategories** | `/api/v1/subcategories` | Mixed | Read: Public \| Write: `admin`, `manager` | CRUD subcategory connections |
| **Brands** | `/api/v1/brands` | Mixed | Read: Public \| Write: `admin` (Delete), `manager` | CRUD brand entities |
| **Reviews** | `/api/v1/reviews` | Mixed | Read: Public \| Write: `user` (Write/Edit) | Create/Edit/Get reviews |
| **Cart** | `/api/v1/cart` | Yes | `user` | Add/Delete products, apply coupons, update quantity |
| **Wishlist** | `/api/v1/wishlist` | Yes | `user` | Add/Remove product records from wishlist |
| **Addresses** | `/api/v1/addresses` | Yes | `user` | Add, fetch, delete shipping destination aliases |
| **Coupons** | `/api/v1/coupons` | Yes | `admin`, `manager` | CRUD coupon discount documents |
| **Orders** | `/api/v1/orders` | Yes | Read: All \| Write: `user` (checkout), `admin`, `manager` | Cash checkouts, Stripe sessions, update payment/delivery statuses |

---

## 9. Environment Variables

Create a file named `config.env` in the root directory.

| Variable Name | Purpose | Example / Placeholder | Required? |
| :--- | :--- | :--- | :--- |
| `NODE_ENV` | Running context mode | `development` / `production` | **Required** |
| `PORT` | Local network port | `3000` | Optional (default: `3000`) |
| `BASE_URL` | Application root URL | `http://localhost:3000` | **Required** |
| `MONGO_URI` | MongoDB Connection URI | `mongodb://localhost:27017/eshop` | **Required** |
| `JWT_SECRET` | Secret key used to sign JWTs | `a_highly_secure_random_string` | **Required** |
| `JWT_EXPIRES_IN` | Access token lifespan | `15m` / `1d` | **Required** |
| `EMAIL_HOST` | Outgoing SMTP mail server | `smtp.gmail.com` | **Required** |
| `EMAIL_PORT` | SMTP port | `465` (SSL) / `587` (TLS) | **Required** |
| `EMAIL_SECURE` | Use SSL encryption | `true` / `false` | **Required** |
| `EMAIL_USER` | SMTP server username | `noreply@example.com` | **Required** |
| `EMAIL_PASSWORD` | SMTP password or app password | `app_password_without_spaces` | **Required** |
| `STRIPE_SECRET` | Stripe API Secret Key | `sk_test_...` | **Required** |
| `STRIPE_WEBHOOK_SECRET` | Stripe Webhook Sign Secret | `whsec_...` | **Required** |

---

## 10. Error Handling & API Responses

### Global Error Handling
Errors are caught by the `globalError` middleware. Operational database constraints (NoSQL schema validation, unique key conflicts, expired/invalid JWT signatures) are transformed into structured, user-friendly `ApiError` instances.

### Development vs. Production Errors
- **Development Mode (`NODE_ENV=development`)**:
  Returns stack traces, internal mongoose error objects, and error status codes for easier debugging.
- **Production Mode (`NODE_ENV=production`)**:
  Hides all internal database details and stack traces. Returns only status code, structured message, and validation details.

### JSON Error Example (Production Validation Error)
```json
{
  "success": false,
  "status": "fail",
  "message": "Invalid email address",
  "errors": [
    {
      "type": "field",
      "value": "invalid-email@",
      "msg": "Invalid email address",
      "path": "email",
      "location": "body"
    }
  ]
}
```

---

## 11. Installation & Setup

Follow these steps to run the application locally:

### 1. Clone the Repository
```bash
git clone https://github.com/HassanAbdelhamed22/e-shop.git
cd e-shop-api
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Create the Environment File
Create a `config.env` file in the root directory:
```bash
cp config.env.example config.env   # Or create it manually
```
Update the values inside `config.env` with your Mongo URI, JWT secret, SMTP credentials, and Stripe secret.

### 4. Seed the Database (Optional)
Import the mock brands, categories, and products:
```bash
npm run db:import
```

### 5. Run the Application
- **Development Mode (Auto-reload)**:
  ```bash
  npm run start:dev
  ```
- **Production Mode**:
  ```bash
  npm run start:prod
  ```

---

## 12. Available Scripts

The following commands are configured in the `package.json` scripts block:

| Script | Command | Purpose |
| :--- | :--- | :--- |
| `start:dev` | `nodemon server.ts` | Starts development server with hot-reload monitoring. |
| `start:prod` | `cross-env NODE_ENV=production node server.ts` | Configures production flag and launches node. |
| `db:import` | `npx tsx src/utils/dummyData/seeder.ts -i` | Drops collection and inserts seed catalogue. |
| `db:destroy` | `npx tsx src/utils/dummyData/seeder.ts -d` | Drops all catalogue collections. |
| `test` | `echo \"Error: no test specified\" && exit 1` | Standard test suite placeholder. |

---

## 13. Testing

> [!WARNING]
> There are currently **no automated unit or integration tests** implemented in this codebase.

### Recommendations for Testing:
1. **Testing framework**: Install `jest` and `@types/jest` as devDependencies.
2. **Integration testing**: Install `supertest` to test Express API endpoints.
3. **Database isolation**: Configure a separate test database environment variable (e.g., `MONGO_TEST_URI`) to drop and recreate test databases between execution suites.

---

## 14. Deployment Considerations

When hosting the E-Shop Express API in a production environment:

- **HTTPS Setup**: Configure SSL certificates or host behind a proxy (like Cloudflare or AWS Load Balancers) to ensure all authentication payloads are encrypted in transit.
- **Reverse Proxy**: Since we enabled `app.set("trust proxy", 1)`, make sure the reverse proxy forwards the correct client IP in `X-Forwarded-For` headers so the rate limiters work properly.
- **Cookies & Session**: JWT tokens are sent via headers, but if converted to cookies in the future, make sure `Secure`, `HttpOnly`, and `SameSite` flags are configured.
- **Storage Strategy**: Product cover uploads are currently stored on the local disk inside `/uploads/products`. For production setups, consider refactoring to use cloud bucket providers (like AWS S3 or Google Cloud Storage) and referencing absolute URLs.
- **Database Scaling**: Ensure your MongoDB Atlas cluster has sufficient network access, set IP whitelists, and configure appropriate connection pool sizes.

---

## 15. Limitations & Future Recommendations

### Fully Implemented
- Complete JWT verification and user deactivation flows.
- CRUD operations for categories, subcategories, brands, products, reviews, and coupons.
- Cart and checkout operations (cash checkouts, Stripe payment gateways).
- Automated email triggers for reset codes.
- Robust parameter filtering, sorting, projection, and pagination.

### Security Recommendations
- **Token Rotation**: Implement Refresh Tokens stored in secure, HttpOnly cookies to keep user sessions alive safely without extending the access token's lifespan.
- **Multer File Size Limits**: Implement limit configurations inside Multer memory storage parameters to reject oversized image uploads.
- **Token Blacklisting**: Implement a token blacklist (such as in a Redis instance) to support true logout/revocation.

### Testing Recommendations
- Setup Jest and Supertest to write integration tests for critical authentication and cart checkout services.

### Production Readiness Recommendations
- Refactor local uploads storage into Cloud Bucket storage (AWS S3, Cloudinary).
- Configure production logs exporting to a centralized monitor (e.g., Winston, ELK Stack).
- Set up a CI/CD pipeline executing ESLint checks prior to merging.
