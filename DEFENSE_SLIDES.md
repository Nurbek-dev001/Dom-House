# Defense Slide Notes — DomHouse (15–20 min)

Slide 1 — Title & Team
- DomHouse — Real Estate Platform
- Team: Nured (Solo)
- Duration: 15–20 minutes

Slide 2 — Architecture (1 slide)
- Three components: Frontend (React), Admin (React), Backend (Express + MongoDB)
- Diagram: requests -> API -> MongoDB -> UI

Slide 3 — Database Design (2 min)
- Collections: users, properties, appointments, news, contracts, stats
- Embedded: reviews inside properties
- Referenced: owner in properties, appointments -> property & user
- Indexes: compound {city, price}, text index on title/description

Slide 4 — Key Endpoints & Aggregations (3 min)
- CRUD: /api/products (list, single, add, update, remove)
- Auth: /api/users/register, /api/users/login
- Aggregations: /api/analytics/price-by-location, /api/analytics/top-performing

Slide 5 — Security & Operations (2 min)
- JWT auth, role-based authorize middleware
- Rate limiting, helmet, input validation
- Soft delete and bulk operations for admin

Slide 6 — Demo (5–7 min)
- Show: login -> create listing -> search -> aggregation endpoint (avg price by city)
- Show admin dashboard stats

Slide 7 — Q&A prep
- Be ready to explain: index choices, aggregation pipeline stages, pagination strategy

---

Notes: Add screenshots from running local server in `frontend` and `admin` pages to the slides for the actual presentation.