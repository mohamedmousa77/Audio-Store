 🎧 Audio Store - Frontend SPA

> Modern **Angular 17** e-commerce frontend with **feature-based architecture**, **NgRx state management**, and **responsive design**.

[![Angular](https://img.shields.io/badge/Angular-17-DD0031?logo=angular)](https://angular.io/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

**Live Demo**: [Coming Soon]  
**Backend API**: [Audio Store Backend](https://github.com/mohamedmousa77/Audio_Store_E-commerce)

---

## 🎯 What is this?

A production-ready Angular SPA showcasing **modern frontend architecture** and best practices for enterprise applications. Features lazy loading, state management, and component-driven design.

**Perfect for**: Learning Angular patterns, interview preparation, frontend architecture reference

---

## ✨ Key Features

- ⚡ **Angular 17** with Standalone Components & Signals
- 🏗️ **Feature-based architecture** (8 modules, lazy-loaded)
- 🔄 **NgRx** for global state management
- 🎨 **Smart/Dumb component pattern** (30+ reusable components)
- 🔐 **Authentication guards** & JWT interceptors
- 💳 **Multi-step checkout wizard** (Shipping → Payment → Confirmation)
- 📱 **Fully responsive** (mobile-first design)
- 🛒 **Real-time shopping cart** with calculations

---

## 🛠️ Tech Stack

**Framework**: Angular 17, TypeScript 5  
**State Management**: NgRx 17  
**Styling**: Tailwind CSS, Bootstrap 5, SCSS  
**UI Components**: Angular Material  
**Forms**: Reactive Forms with custom validators  
**HTTP**: Interceptors for JWT, loading, errors

---

## 📁 Project Structure

```
src/app/
│
├── features/                    # Lazy-loaded feature modules
│   ├── auth/                    # Login, Register, Guards
│   ├── catalog/                 # Products, Categories, Filters
│   ├── cart/                    # Shopping Cart
│   ├── checkout/                # Multi-step Checkout
│   ├── orders/                  # Order History
│   └── admin/                   # Admin Dashboard
│
├── shared/                      # Reusable components & UI
│   ├── components/              # Product Card, Paginator, etc.
│   └── ui/                      # Button, Input, Alert
│
└── core/                        # Singleton services
    ├── guards/                  # Auth Guard, Admin Guard
    ├── interceptors/            # JWT, Error, Loading
    └── services/                # LocalStorage, Notification
```
Architecture: Feature-based with lazy loading for optimal bundle size.

## 🔐 Authentication Flow
User logs in → JWT token stored in localStorage

JWT Interceptor adds token to all API requests

Auth Guard protects authenticated routes

Admin Guard restricts admin-only pages

Token refresh on expiry (silent renewal)

## 🛒 State Management (NgRx)
**Stores:**

- Auth Store: User, token, isAuthenticated

- Catalog Store: Products, filters, pagination, loading

- Cart Store: Items, totals, quantity

- Checkout Store: Shipping info, payment data

**Why NgRx?**
Predictable state, time-travel debugging, easier testing for complex state logic.

## 📦 Features Overview
**Customer Features**

✅ User authentication & registration

✅ Product browsing with filters, search, sort

✅ Shopping cart with real-time calculations

✅ Multi-step checkout (shipping, payment, confirmation)

✅ Order history & tracking

✅ User profile management

  **Admin Features**

✅ Sales dashboard with statistics

✅ Product CRUD operations

✅ Category management

✅ Order status updates

✅ Customer list

## 📝 License
MIT © [Mohamed Mousa](https://github.com/mohamedmousa77)


## 📞 Contact

**Mohamed Mousa** - Senior Full-Stack .NET Developer

📧 [mohamed.mousa.contact@gmail.com](mohamed.mousa.contact@gmail.com)

💼 [LinkedIn](https://www.linkedin.com/in/mohamedmousa-/)

🌐 [Portfolio](mohamedmousa.it)

💻 [GitHub](https://github.com/mohamedmousa77)

## 🌟 Related Projects

**Backend API:** [Audio Store Backend (ASP.NET Core 8)](https://github.com/mohamedmousa77/Audio_Store_E-commerce)

    ⭐ If you find this project helpful for learning, please star the repo!

        Built with ❤️ using Clean Architecture & Domain-Driven Design
