# 🎫 TicketFlow Frontend

<a name="readme-top"></a>

> The Next.js frontend for TicketFlow, a role-based IT helpdesk and ticket management system. Lets employees submit tickets, support agents manage queues, and admins oversee the full operation with stats and assignment controls.

## 📗 Table of Contents

- [About](#about)
  - [Built With](#built-with)
  - [Key Features](#key-features)
  - [Live Demo](#live-demo)
- [Backend](#backend)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Setup](#setup)
  - [Environment Variables](#environment-variables)
  - [Run Locally](#run-locally)
- [Authors](#authors)
- [Future Features](#future-features)
- [Contributing](#contributing)
- [License](#license)

---

## 📖 About <a name="about"></a>

TicketFlow is a helpdesk platform built for teams. This repository contains the Next.js frontend. Employees can submit and track their support tickets, support agents can manage queues and post comments.

### 🛠 Built With <a name="built-with"></a>

<details>
  <summary>Frontend</summary>
  <ul>
    <li><a href="https://nextjs.org/">Next.js</a></li>
    <li><a href="https://www.typescriptlang.org/">TypeScript</a></li>
    <li><a href="https://tailwindcss.com/">Tailwind CSS</a></li>
    <li><a href="https://tanstack.com/query">TanStack Query v5</a></li>
    <li><a href="https://www.framer.com/motion/">Framer Motion</a></li>
    <li><a href="https://github.com/atlassian/react-beautiful-dnd">@hello-pangea/dnd (drag-and-drop)</a></li>
    <li><a href="https://axios-http.com/">Axios</a></li>
    <li><a href="https://next-auth.js.org/">NextAuth.js</a></li>
    <li><a href="https://zod.dev/">Zod</a></li>
  </ul>
</details>

<details>
  <summary>Deployment</summary>
  <ul>
    <li><a href="https://vercel.com/">Vercel</a></li>
  </ul>
</details>

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### ✨ Key Features <a name="key-features"></a>

- **Role-based UI** - Employees, Support Agents, and Admins each see a tailored interface scoped to their permissions
- **Ticket board** - drag-and-drop ticket management powered by `@hello-pangea/dnd`
- **Ticket creation and tracking** - submit tickets with priority, description, and optional attachments
- **Status management** - agents and admins can update ticket status (Open → In Progress → Resolved)
- **Comment threads** - per-ticket comment sections for agent-employee communication
- **SLA breach indicators** - HIGH priority tickets unresolved after 24 hours are visually flagged
- **OTP verification flow** - phone-based account activation and password reset
- **Responsive design** - fully mobile-friendly layout

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### 🚀 Live Demo <a name="live-demo"></a>

- [Live App](https://ticketflow-fawn.vercel.app/)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

---

## 🔗 Backend <a name="backend"></a>

> This is the frontend repository only. The backend is built with Django, Django REST Framework, Simple JWT, and PostgreSQL.

👉 [TicketFlow Backend Repository](https://github.com/kessie2862/ticketflow-backend)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

---

## 💻 Getting Started <a name="getting-started"></a>

### Prerequisites

- [Node.js](https://nodejs.org/) v20+
- A running instance of the [TicketFlow backend](https://github.com/kessie2862/ticketflow-backend)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Setup

Clone the repository:

```sh
git clone https://github.com/kessie2862/ticketflow-frontend
cd ticketflow-frontend
```

Install dependencies:

```sh
npm install
```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Environment Variables <a name="environment-variables"></a>

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NEXTAUTH_SECRET=your-nextauth-secret
NEXTAUTH_URL=http://localhost:3000
```

For production, point these at your deployed backend:

```env
NEXT_PUBLIC_API_URL=https://your-backend.onrender.com/api
NEXTAUTH_SECRET=your-production-secret
NEXTAUTH_URL=https://ticketflow-frontend.vercel.app
```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Run Locally <a name="run-locally"></a>

```sh
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

> Make sure the backend is running on port 8000 before starting the frontend so authentication and data fetching work correctly.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

---

## 👥 Authors <a name="authors"></a>

👤 **Prosper Kessie**

- GitHub: [@kessie2862](https://github.com/kessie2862)
- LinkedIn: [Prosper Kessie](https://www.linkedin.com/in/prosperkessie/)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

---

## 🔭 Future Features <a name="future-features"></a>

- [ ] Real-time ticket updates via WebSockets
- [ ] Email notifications on ticket assignment and status change
- [ ] Admin analytics dashboard with charts

<p align="right">(<a href="#readme-top">back to top</a>)</p>

---

## 🤝 Contributing <a name="contributing"></a>

Contributions, issues, and feature requests are welcome.

Feel free to check the [issues page](https://github.com/kessie2862/ticketflow-frontend/issues).

<p align="right">(<a href="#readme-top">back to top</a>)</p>

---

## ⭐️ Show your support <a name="support"></a>

If you found this project useful, give it a ⭐️. It helps a lot.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

---

## 📝 License <a name="license"></a>

This project is [MIT](./LICENSE) licensed.

<p align="right">(<a href="#readme-top">back to top</a>)</p>
