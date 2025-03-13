# Fresh Cart (E-Commerce Website)

Fresh Cart is a **high-performance, responsive, and user-friendly** e-commerce platform with **secure authentication** and **full CRUD functionality**. The project follows **clean code practices**, utilizing **reusable components (DRY principle)** and **optimized API handling** to **reduce unnecessary server requests**.

## Features

- **User Authentication**: Login, registration, logout, password recovery, and form validation.
- **Product & Order Management**: Full **CRUD operations** for viewing products, product details, categories, and brands. Manage orders, cart, and wishlist with **add, update, remove, and clear all operations**.
- **Optimized Performance**:
  - **Unsubscribing API connections** on component destruction.
  - **Lazy loading** applied to key pages: Not Found, Login, Signup, Forget Password, and Orders.
- **Payments**: Functionality has been **canceled**.

## Technologies Used

### **Angular 19 & Performance Optimization**
- **Standalone components** and lifecycle hooks, using `OnInit` for API calls and `OnDestroy` for subscription cleanup.
- **Routing with authentication guards** to prevent unauthorized access.
- **Lazy loading** applied to main feature modules and key pages.
- **Services and dependency injection** for efficient state management and data sharing.
- **Built-in Angular Pipes**, including `UpperCase`, `TitleCase`, and `Currency`.
- **Custom pipes** for filtering products, categories, and brands.
- **Interceptors** for injecting **user token** into request headers.
- **Directives** for **external link confirmation** and **navbar animations**.
- **API Integration with RxJS**, using `map` for filtering data, `forkJoin` for parallel API calls, and `shareReplay` for caching responses.
- **Reactive Forms Module** for creating validated and secure forms.

### **Tailwind CSS & UI Development**
- **Tailwind CSS** framework for modern, scalable, and responsive UI design.
- **Flowbite integration** for pre-built UI components to enhance usability and consistency.

## Project Structure

- **Core**: Services, guards, and interceptors.
- **Shared**: Reusable components, directives, pipes, interfaces, and environment settings.
- **Features**: Layout, main pages, and authentication.

