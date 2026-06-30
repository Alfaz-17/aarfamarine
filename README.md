# ⚓ Aarfa Marine

A modern, full-featured marine products & services web application built with **Next.js**, **Material UI**, and **MongoDB**.

## 🌊 About

Aarfa Marine is a professional marine industry web platform offering:

- 🛒 **Product Catalog** — Browse and explore marine products with detailed pages
- 🔧 **Services** — Comprehensive marine services showcase
- 📝 **Blog** — Industry news and updates
- 📞 **Contact & Inquiry** — Customer inquiry forms
- 🆕 **New Arrivals** — Latest product listings
- 🔐 **Admin Dashboard** — Full admin panel for managing products, services, categories & settings

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| [Next.js](https://nextjs.org/) | React framework (SSR & API routes) |
| [Material UI (MUI)](https://mui.com/) | UI component library |
| [Tailwind CSS](https://tailwindcss.com/) | Utility-first CSS |
| [MongoDB / Mongoose](https://mongoosejs.com/) | Database |
| [Framer Motion](https://www.framer.com/motion/) | Animations |
| [TypeScript](https://www.typescriptlang.org/) | Type safety |

## 🚀 Getting Started

### Prerequisites

- Node.js 16+
- MongoDB instance (local or Atlas)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/Alfaz-17/Aarfa-marine.git
   cd Aarfa-marine
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**

   Create a `.env` file in the root directory with your configuration:

   ```env
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   ```

4. **Run the development server**

   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
Aarfa-marine/
├── public/            # Static assets (images, icons)
├── src/
│   ├── components/    # Reusable UI components
│   ├── pages/         # Next.js pages & API routes
│   │   ├── admin/     # Admin dashboard pages
│   │   ├── api/       # Backend API endpoints
│   │   ├── products/  # Product pages
│   │   └── ...        # Other pages (about, blog, contact, services)
│   └── ...
├── .env               # Environment variables (not tracked)
├── next.config.js     # Next.js configuration
├── tailwind.config.js # Tailwind CSS configuration
└── package.json
```

## 📜 Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |

## 📄 License

This project is private and proprietary.

---

Built with ❤️ by [Alfaz](https://github.com/Alfaz-17)

