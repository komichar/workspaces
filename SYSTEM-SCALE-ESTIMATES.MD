# Back-of-the-Envelope Estimates for Office Reservation System

## Assumptions

- **Company size:** 20,000 employees
- **Active users:** ~10,000 daily users
- **Workspaces per office:** **500 per office**
- **Total offices:** **10 offices globally**
- **Reservations per day per user:** **1 reservation per user**
- **Peak demand:** Assume **30% of users book within a short window (e.g., morning hours)**

---

## 1. Request Estimates

### **API Requests Per Day**

Each user makes:

- 1 request to **view availability** (`/offices/:id/days/:day/availability`)
- 1 request to **create a reservation** (`POST /reservations`)
- 1 request to **check existing reservations** (`GET /reservations`)
- Possibly 1 cancellation (`DELETE /reservations/:id`)
- Assume **4 API calls per user per day**

**Total Requests Per Day:**

- 10,000 users × 4 requests/user = 40,000 requests/day
- **Peak QPS (queries per second):**
- 12,000 requests / (2 × 3600) = 1.67 QPS (very manageable!)

---

## 2. Database Size Estimates

### **Reservations Table**

- **Each reservation record** is ~200 bytes
- **Daily new reservations**: **10,000**

### **1 year storage**

10,000 reservations/day × 365 = 3.65M reservations 3.65M × 200B = ~730MB per year

- **In 5 years**: **~3.65GB** (PostgreSQL can handle this easily)

### **Users Table**

- **20,000 records** (~500B each) → **~10MB total**

### **Offices Table**

- **10 offices** (~2KB per office) → **~20KB total**

### **Total DB Size in 5 Years:** **~5GB**

(PostgreSQL is preferable over SQLite due to high concurrency.)

---

## 3. Caching Needs

- **Redis for caching availability status**:
- Store **availability results** for each office-day combination (~1KB per entry).
- Assume **10 offices × 7 future days = 70 cache keys**.
- Total Redis cache size: **~70KB** (very small).

---

## 4. Scalability Considerations

### **API Scaling**

- **40K requests/day is low** → A single **small Kubernetes pod (2 vCPU, 4GB RAM)** should handle it.
- If scaling is needed, **horizontal scaling** (adding more pods) is effective.

### **Database Scaling**

- **PostgreSQL instance with read replicas** for **high-read workloads** (e.g., users checking seat availability).
- **Connection pooling** (e.g., PgBouncer) can help with concurrent queries.

### **Caching Layer**

- **Redis for hot queries** (e.g., office availability for today/tomorrow) → Reduces DB load.
- Cache expiry: **Every 5 minutes** or **on reservation updates**.

### **Load Balancer**

- **NGINX or API Gateway** to distribute traffic across multiple backend pods.

---

## 5. Cost Estimate (Cloud)

Assume **AWS or GCP setup**:

| Resource                                                | Estimate             | Cost (per month) |
| ------------------------------------------------------- | -------------------- | ---------------- |
| **2 Backend API pods** (Node app, 2 vCPU, 4GB RAM)      | Handles 5 QPS easily | ~$50             |
| **PostgreSQL (Managed, 2 vCPU, 8GB RAM, Read Replica)** | Stores reservations  | ~$200            |
| **Redis (Managed, 2GB RAM)**                            | Caching layer        | ~$50             |
| **Storage (10GB PostgreSQL storage + backups)**         | Yearly DB growth     | ~$20             |
| **Traffic (~100GB/month)**                              | API calls, responses | ~$40             |
| **Total Estimated Cost**                                | -                    | **~$360/month**  |

---

## Final Takeaways

✅ **Very manageable load (~1.67 QPS peak, 40K req/day)**  
✅ **SQLite could struggle; PostgreSQL is preferred for concurrency**  
✅ **Redis caching will optimize peak loads**  
✅ **Cloud cost is low (~$360/month)**  
✅ **Scaling is easy with Kubernetes pods & read replicas**

---
