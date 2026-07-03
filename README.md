# 📋 MiniBill - Inventory & Billing System

A full-stack inventory and billing application built with **Spring Boot** and **React**.

---

## 🚀 Live Demo

| Service          | URL                     |
| ---------------- | ----------------------- |
| **Backend API**  | `http://localhost:8080` |
| **Frontend App** | `http://localhost:5173` |

---

# 📊 Tech Stack

## Backend

| Technology      | Version | Purpose                        |
| --------------- | ------- | ------------------------------ |
| Spring Boot     | 3.2.0   | REST API Framework             |
| Java            | 17      | Programming Language           |
| MySQL           | 8.0     | Database                       |
| Spring Security | -       | Authentication & Authorization |
| JWT             | -       | Token-Based Authentication     |
| Lombok          | -       | Boilerplate Reduction          |

---

## Frontend

| Technology   | Version | Purpose      |
| ------------ | ------- | ------------ |
| React        | 18      | UI Framework |
| Vite         | 4       | Build Tool   |
| Tailwind CSS | 3       | Styling      |
| Axios        | 1.6     | HTTP Client  |
| React Router | 6       | Navigation   |

---

# ✨ Features

## 🔐 Authentication

| Feature                                        | Status |
| ---------------------------------------------- | ------ |
| User Registration with BCrypt password hashing | ✅      |
| User Login with JWT token generation           | ✅      |
| Protected API routes                           | ✅      |
| Token storage in localStorage                  | ✅      |

---

## 📂 Categories

| Feature                              | Status |
| ------------------------------------ | ------ |
| Create Categories                    | ✅      |
| View Categories                      | ✅      |
| Edit Categories                      | ✅      |
| Deactivate Categories                | ✅      |
| Unique Name Validation               | ✅      |
| GST Percentage Tracking              | ✅      |
| Soft Delete (Active/Inactive Status) | ✅      |

---

## 📦 Products

| Feature                                  | Status |
| ---------------------------------------- | ------ |
| Full CRUD Operations                     | ✅      |
| Category Mapping                         | ✅      |
| Search by Name or SKU                    | ✅      |
| Price, Tax %, Stock Quantity             | ✅      |
| Auto Stock Reduction on Invoice Creation | ✅      |
| Soft Delete (Active/Inactive Status)     | ✅      |

---

## 👤 Customers

| Feature                        | Status |
| ------------------------------ | ------ |
| Full CRUD Operations           | ✅      |
| Unique Phone Number Validation | ✅      |
| Optional Email Field           | ✅      |
| Optional Address Field         | ✅      |

---

## 📄 Invoices

| Feature                                       | Status |
| --------------------------------------------- | ------ |
| Select Customer for Invoice                   | ✅      |
| Add Multiple Products                         | ✅      |
| Live Calculation (Subtotal, Tax, Grand Total) | ✅      |
| Stock Reduction on Save                       | ✅      |
| Invoice List with Customer Name and Total     | ✅      |
| Invoice Details with Item Breakdown           | ✅      |
| Auto-generated Invoice Numbers (`INV-0001`)   | ✅      |

---

# 📊 API Endpoints

| Method | Endpoint               | Description              | Auth Required |
| ------ | ---------------------- | ------------------------ | ------------- |
| POST   | `/api/auth/register`   | Register new user        | ❌ No          |
| POST   | `/api/auth/login`      | Login user               | ❌ No          |
| GET    | `/api/categories`      | Get all categories       | ✅ Yes         |
| POST   | `/api/categories`      | Create category          | ✅ Yes         |
| PUT    | `/api/categories/{id}` | Update category          | ✅ Yes         |
| DELETE | `/api/categories/{id}` | Deactivate category      | ✅ Yes         |
| GET    | `/api/products`        | Get products with search | ✅ Yes         |
| GET    | `/api/products/{id}`   | Get product by ID        | ✅ Yes         |
| POST   | `/api/products`        | Create product           | ✅ Yes         |
| PUT    | `/api/products/{id}`   | Update product           | ✅ Yes         |
| DELETE | `/api/products/{id}`   | Deactivate product       | ✅ Yes         |
| GET    | `/api/customers`       | Get all customers        | ✅ Yes         |
| POST   | `/api/customers`       | Create customer          | ✅ Yes         |
| PUT    | `/api/customers/{id}`  | Update customer          | ✅ Yes         |
| DELETE | `/api/customers/{id}`  | Deactivate customer      | ✅ Yes         |
| GET    | `/api/invoices`        | Get all invoices         | ✅ Yes         |
| GET    | `/api/invoices/{id}`   | Get invoice details      | ✅ Yes         |
| POST   | `/api/invoices`        | Create invoice           | ✅ Yes         |

---

# 🚀 Setup Instructions

## Prerequisites

* Java JDK 17+
* MySQL 8.0+
* Node.js 18+
* STS / Eclipse (or any IDE)

---

## Backend Setup

### 1. Clone Repository

```bash
git clone https://github.com/Dharmanathsk04/MiniBill-Inventory-Billing-System.git

cd MiniBill-Inventory-Billing-System/minibill-backend
```

### 2. Create Database

```sql
CREATE DATABASE minibill_db;
```

### 3. Configure `application.properties`

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/minibill_db?useSSL=false&serverTimezone=UTC

spring.datasource.username=root

spring.datasource.password=YOUR_PASSWORD
```

### 4. Run Application

* Open project in STS/Eclipse
* Right-click `MiniBillApplication.java`
* Run As → Spring Boot App

Backend runs at:

```bash
http://localhost:8080
```

---

## Frontend Setup

### 1. Navigate to Frontend

```bash
cd ../minibill-frontend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Run Application

```bash
npm run dev
```

Frontend runs at:

```bash
http://localhost:5173
```

---

# 📁 Project Structure

```plaintext
MiniBill/
│
├── minibill-backend/
│   │
│   ├── src/main/java/com/minibill/
│   │   │
│   │   ├── controller/       # REST Controllers
│   │   ├── dto/              # Data Transfer Objects
│   │   ├── entity/           # JPA Entities
│   │   ├── repository/       # Data Access Layer
│   │   ├── service/          # Business Logic
│   │   ├── security/         # JWT Security
│   │   └── exception/        # Exception Handler
│   │
│   └── pom.xml
│
└── minibill-frontend/
    │
    ├── src/
    │   ├── api/              # API Calls (Axios)
    │   ├── components/       # React Components
    │   └── pages/            # Pages
    │
    ├── package.json
    └── vite.config.js
```

---

# 🔧 Assumptions & Decisions

| Assumption            | Description                                           |
| --------------------- | ----------------------------------------------------- |
| Category Deactivation | Categories with active products cannot be deactivated |
| Soft Delete           | All deletions use an active flag (`false`)            |
| Stock Validation      | Products cannot be sold if stock is insufficient      |
| Unique Constraints    | SKU and phone numbers must be unique                  |

---

# 🎯 Future Improvements

* Add pagination for list endpoints
* Add PDF export for invoices
* Add role-based access control
* Add dashboard charts and analytics
* Add barcode scanner support

---

# 👨‍💻 Author

**Dharmanath Kadam**

GitHub:
https://github.com/Dharmanathsk04

---

# 📅 Date

** 7 July 2026**

---

# ✅ Project Status

| Aspect          | Status        |
| --------------- | ------------- |
| Backend         | ✅ Complete    |
| Frontend        | ✅ Complete    |
| Database        | ✅ Connected   |
| Authentication  | ✅ Working     |
| CRUD Operations | ✅ Complete    |
| Invoice Logic   | ✅ Working     |
| Error Handling  | ✅ Implemented |
| README          | ✅ Complete    |

---


---

## 🙏 Thank You

Thank you for reviewing my project!
