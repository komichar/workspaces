# **Feature Roadmap & Implementation Plan 🚀**

## **1. Security Enhancements 🔒**

### **Current State:**

- Using a **dummy Bearer Authorization** with only plain email, password is not taken into account.
- API endpoints are **not fully protected**.
- Cleanup WEB UI & dead code from boilerplate.

### **Planned Improvements:**

✅ **Switch to JWT Authentication**

- Implement **JWT-based authentication** for secure token handling.
- Tokens will include **user ID, role, and expiration**.
- Store tokens securely (e.g., **HTTP-only cookies** or **Authorization header**).

✅ **Protect All API Endpoints**

- Require **valid JWT** for all API calls.
- Implement **role-based access control (RBAC)** for admin vs. regular users.
- Use middleware to validate requests and handle expired/invalid tokens.

---

## **2. UI Enhancements for Flexible Reservations 🖥️**

### **Current State:**

- Users can reserve a seat, but **only for full-day reservations**.

### **Planned Improvements:**

✅ **Start/End Time Selection**

- Allow users to **choose custom time slots** for their reservation.
- Update UI with **time pickers** to select working hours.
- Validate and enforce **max duration limits** (e.g., 4-hour cap during peak demand).

---

## **3. Queueing System for High Demand 🚦**

### **Current State:**

- No queueing system in place when the office reaches full capacity.

### **Planned Improvements:**

✅ **Waitlist & Queueing Mechanism**

- If all workspaces are booked, users can **join a waitlist**.
- Auto-assign **next-in-line user** if someone cancels their reservation.
- Notify users via **email** that the system booked a seat for them.

✅ **Dynamic Capacity Management**

- **Limit reservation duration** dynamically based on demand.

---

## **4. Deployment Timeline 🗓️**

| Feature                               | Status         | Estimated Completion |
| ------------------------------------- | -------------- | -------------------- |
| **JWT Authentication**                | 🔄 In Progress | 1-2 Days             |
| **Secure API Endpoints**              | 🛠️ Planned     | 2-3 Days             |
| **Custom Time Selection in UI**       | 🛠️ Planned     | 3-4 Days             |
| **Queueing System for Full Capacity** | ⏳ Future      | 4-6 Day              |

These improvements will **enhance security, improve user experience, and optimize office space usage**. 🚀
