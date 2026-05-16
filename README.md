# QR Stock & Form Management System

A full-stack MERN (MongoDB, Express, React, Node.js) application for mobile-first inventory tracking and dynamic form management using QR codes.

## 🚀 Features

### Admin
- **Dashboard**: Real-time analytics on items, users, and submissions.
- **Inventory**: Upload products with images/docs, automatic QR code generation.
- **QR Codes**: Download and print unique labels for physical items.
- **Dynamic Forms**: Build custom forms for each product to collect user data.
- **Submissions**: Review and approve user-submitted information.

### User
- **QR Scanner**: Scan product labels to instantly view details.
- **Form Submission**: Fill out reports/checklists directly on mobile.
- **History**: View past scans and submission statuses.

## 🛠️ Tech Stack
- **Frontend**: React, Vite, Tailwind CSS, Redux Toolkit, Framer Motion, Lucide Icons.
- **Backend**: Node.js, Express, Mongoose, JWT, Multer, QRCode, Nodemailer.

## 📦 Installation

### 1. Clone the repository
```bash
git clone <repository-url>
cd code-qr
```

### 2. Backend Setup
```bash
cd server
npm install
```
Create a `.env` file in the `server` directory (see `.env.example`).

### 3. Frontend Setup
```bash
cd client
npm install
```
Create a `.env` file in the `client` directory:
```env
VITE_API_URL=http://localhost:5000/api
```

## 🏃 Running the Application

### Start Backend
```bash
cd server
npm start # or nodemon index.js
```

### Start Frontend
```bash
cd client
npm run dev
```

## 📱 Mobile Access
To access the app from your phone on the same network:
1. Find your computer's local IP (e.g., `192.168.1.5`).
2. Update `server/.env` `CLIENT_URL` to `http://192.168.1.5:5173`.
3. Open `http://192.168.1.5:5173` on your mobile browser.

## 📜 License
MIT
