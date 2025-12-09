# PhysioFi - Get Better at Home

Professional physiotherapy services at your doorstep in Ahmedabad. Expert therapists, home visits, and teleconsultations for your recovery journey.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd PhysioFI
   ```

2. **Install dependencies**
   ```bash
   # Install backend dependencies
   npm install
   
   # Install frontend dependencies
   cd client
   npm install
   cd ..
   ```

3. **Set up environment variables**
   ```bash
   # Copy .env.example to .env
   cp env.example .env
   
   # Edit .env with your configuration
   # Required variables:
   # - MONGODB_URI
   # - JWT_SECRET
   # - PORT (default: 5000)
   # - CLIENT_URL (default: http://localhost:3000)
   ```

4. **Run the application**
   ```bash
   # Development mode (runs both backend and frontend)
   npm run dev
   
   # Or run separately:
   # Backend only
   npm run server
   
   # Frontend only
   npm run client
   ```

5. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000/api
   - Health Check: http://localhost:5000/health

## 📁 Project Structure

```
PhysioFI/
├── client/              # Next.js frontend
│   ├── src/
│   │   ├── app/         # Next.js App Router pages
│   │   ├── components/   # React components
│   │   ├── lib/         # API client, utilities
│   │   ├── types/       # TypeScript types
│   │   ├── hooks/       # Custom React hooks
│   │   └── contexts/    # React contexts
│   └── public/          # Static assets
├── routes/              # Express route handlers
├── models/              # Mongoose schemas
├── middleware/          # Auth & RBAC middleware
├── tests/               # Test scripts
├── docs/                # Documentation
└── server.js            # Express server entry point
```

## 🛠️ Tech Stack

### Frontend
- **Framework:** Next.js 13 (App Router)
- **Language:** TypeScript
- **UI Library:** React 18
- **Styling:** Tailwind CSS
- **State Management:** React Context API
- **HTTP Client:** Axios
- **Animations:** Framer Motion

### Backend
- **Framework:** Express.js
- **Language:** JavaScript (Node.js)
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JWT (JSON Web Tokens)
- **Security:** bcryptjs, helmet, cors

## 🔐 Authentication

The application supports three user roles:
- **Patient:** Can book appointments, view medical records, track progress
- **Doctor:** Can manage appointments, create treatment plans, view patients
- **Admin:** Full system access, manage users and appointments

### API Endpoints

All API endpoints are prefixed with `/api`:
- `/api/auth` - Authentication routes
- `/api/patients` - Patient-specific routes
- `/api/doctors` - Doctor-specific routes
- `/api/admin` - Admin-specific routes
- `/api/appointments` - Appointment management
- `/api/notifications` - Notification system

## 📚 Documentation

Comprehensive documentation is available in the `/docs` directory:
- `COMPREHENSIVE_AUDIT_REPORT.md` - Full project audit
- `AUDIT_FIXES_APPLIED.md` - All fixes applied
- `CLEANUP_REPORT.md` - Code cleanup details
- `FINAL_AUDIT_SUMMARY.md` - Final summary

## 🧪 Testing

Test scripts are located in the `/tests` directory:
- `diagnose-login-issue.js` - Login diagnostics
- `test-api-endpoints.js` - API endpoint testing
- `test-connection.js` - Database connection testing

## 🚀 Deployment

### Production Build

```bash
# Build frontend
cd client
npm run build
cd ..

# Start production server
npm start
```

### Environment Variables for Production

Ensure the following are set:
- `NODE_ENV=production`
- `MONGODB_URI` - Production MongoDB connection string
- `JWT_SECRET` - Strong secret key
- `CLIENT_URL` - Production frontend URL
- `PORT` - Server port (default: 5000)

## 📝 Available Scripts

### Root Directory
- `npm run dev` - Run both backend and frontend in development
- `npm run server` - Run backend only
- `npm run client` - Run frontend only
- `npm start` - Start production server
- `npm run build` - Build frontend for production

### Client Directory
- `npm run dev` - Start Next.js development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## 🔧 Configuration

### Backend Configuration
- Server port: Set via `PORT` environment variable (default: 5000)
- MongoDB: Set via `MONGODB_URI` environment variable
- JWT Secret: Set via `JWT_SECRET` environment variable

### Frontend Configuration
- API URL: Set via `NEXT_PUBLIC_API_URL` environment variable
- Default: `http://localhost:5000/api`

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Check `MONGODB_URI` in `.env`
   - Ensure MongoDB is running (local) or IP is whitelisted (Atlas)

2. **Port Already in Use**
   - Change `PORT` in `.env` or kill the process using the port

3. **Frontend Build Errors**
   - Clear `.next` directory: `rm -rf client/.next`
   - Reinstall dependencies: `cd client && npm install`

4. **API Connection Errors**
   - Verify backend is running on correct port
   - Check `NEXT_PUBLIC_API_URL` in frontend `.env`

## 📄 License

MIT License

## 👥 Team

PhysioFi Team

## 📞 Contact

- Phone: +91 9082770384
- Email: info@physiofi.com
- Website: https://physiofi.com

---

**Last Updated:** ${new Date().toISOString().split('T')[0]}  
**Version:** 1.0.0  
**Status:** ✅ Production Ready
