# PhysioFI - Get Better at Home

A comprehensive physiotherapy and teleconsultation platform that connects patients with qualified physiotherapists for home visits, clinic visits, and online consultations.

## 🚀 Features

- **Patient Management**: Complete patient profiles, medical history, and treatment tracking
- **Appointment Booking**: Book home visits, clinic visits, or online consultations
- **Doctor Dashboard**: Manage appointments, patients, and treatment plans
- **Admin Panel**: Comprehensive admin dashboard for managing the platform
- **Real-time Notifications**: Get notified about appointment requests, confirmations, and updates
- **Treatment Plans**: Create and track personalized treatment plans
- **Analytics**: Detailed analytics for doctors and admins

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **MongoDB** (v4.4 or higher) - [Download](https://www.mongodb.com/try/download/community)
- **npm** or **yarn** package manager
- **Git** - [Download](https://git-scm.com/)

## 🛠️ Installation & Setup

### Step 1: Clone the Repository

```bash
git clone https://github.com/yourusername/physiofi.git
cd physiofi
```

### Step 2: Install Dependencies

#### Option A: Install All Dependencies (Recommended)

```bash
npm run install-all
```

This will install both server and client dependencies automatically.

#### Option B: Install Separately

**Install server dependencies:**
```bash
npm install
```

**Install client dependencies:**
```bash
cd client
npm install
cd ..
```

**Note:** Make sure you have Node.js v16 or higher installed. Check your version with:
```bash
node --version
```

### Step 3: Environment Setup

#### Backend Environment Variables

Create a `.env` file in the root directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/physiofi
# Or use MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/physiofi?retryWrites=true&w=majority

# JWT Secret (Generate a strong random string)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Client URL
CLIENT_URL=http://localhost:3000

# Email Configuration (Optional - for email notifications)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Twilio Configuration (Optional - for SMS notifications)
TWILIO_ACCOUNT_SID=your-twilio-account-sid
TWILIO_AUTH_TOKEN=your-twilio-auth-token
TWILIO_PHONE_NUMBER=your-twilio-phone-number
```

#### Frontend Environment Variables

Create a `.env.local` file in the `client` directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

### Step 4: Database Setup

#### Local MongoDB

1. Start MongoDB service:
   ```bash
   # Windows
   net start MongoDB
   
   # macOS (using Homebrew)
   brew services start mongodb-community
   
   # Linux
   sudo systemctl start mongod
   ```

2. MongoDB will be available at `mongodb://localhost:27017`

#### MongoDB Atlas (Cloud)

1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Get your connection string
4. Update `MONGODB_URI` in `.env` file

### Step 5: Run the Application

#### Development Mode (Recommended)

**Option A: Run Both Servers Together (Easiest)**

Open a single terminal and run:
```bash
npm run dev
```

This will start both the backend server (port 5000) and frontend server (port 3000) concurrently using `concurrently`.

**Option B: Run Separately (If Option A doesn't work)**

**Terminal 1 - Backend Server:**
```bash
node server.js
```

You should see:
```
🔌 Connecting to MongoDB...
✅ Connected to MongoDB successfully!
🚀 Server running on port 5000
```

**Terminal 2 - Frontend Server:**
```bash
cd client
npm run dev
```

You should see:
```
▲ Next.js 13.5.4
- Local:        http://localhost:3000
```

**Important:** Make sure MongoDB is running before starting the backend server!

#### Production Mode

1. Build the frontend:
   ```bash
   npm run build
   ```

2. Start the production server:
   ```bash
   npm start
   ```

## 🌐 Access the Application

Once both servers are running successfully:

- **Frontend (Main App)**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **API Health Check**: http://localhost:5000/api/health

**Troubleshooting Connection Issues:**

If you see "This site can't be reached" or "ERR_CONNECTION_REFUSED":

1. **Verify both servers are running:**
   - Check terminal windows for any error messages
   - Backend should show: `🚀 Server running on port 5000`
   - Frontend should show: `- Local: http://localhost:3000`

2. **Check if ports are in use:**
   ```bash
   # Windows
   netstat -ano | findstr ":5000"
   netstat -ano | findstr ":3000"
   
   # macOS/Linux
   lsof -i :5000
   lsof -i :3000
   ```

3. **Wait for compilation:**
   - Next.js takes 30-60 seconds to compile on first run
   - Wait until you see "Compiled successfully" message

4. **Try accessing directly:**
   - Backend: http://localhost:5000/api/health
   - If this works but frontend doesn't, it's a frontend issue

## 👤 Default Accounts

After running the setup script, you can use these default accounts:

### Admin Account
- Email: `admin@physiofi.com`
- Password: `admin123`

### Doctor Account
- Email: `doctor@physiofi.com`
- Password: `doctor123`

### Patient Account
- Email: `patient@physiofi.com`
- Password: `patient123`

**Note**: Change these passwords immediately in production!

## 📁 Project Structure

```
physiofi/
├── client/                 # Next.js frontend application
│   ├── src/
│   │   ├── app/            # Next.js app router pages
│   │   ├── components/     # React components
│   │   ├── contexts/       # React contexts
│   │   ├── lib/            # Utility functions and API
│   │   └── types/          # TypeScript type definitions
│   ├── public/             # Static assets
│   └── package.json
├── models/                 # Mongoose database models
├── routes/                 # Express API routes
├── middleware/             # Express middleware
├── server.js              # Express server entry point
├── package.json
└── .env                   # Environment variables
```

## 🔧 Troubleshooting

### Common Issues

#### "This site can't be reached" or "ERR_CONNECTION_REFUSED"

**Solution:**
1. Make sure both servers are running:
   - Check terminal for backend: Should see `🚀 Server running on port 5000`
   - Check terminal for frontend: Should see `- Local: http://localhost:3000`
2. Wait 30-60 seconds after starting - Next.js needs time to compile
3. Try hard refresh: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
4. Check if ports are blocked by firewall

#### Website Loading Multiple Times / Slow Loading

**Solution:**
1. Clear browser cache and cookies
2. Hard refresh: `Ctrl+Shift+R` or `Cmd+Shift+R`
3. Check browser console (F12) for errors
4. Restart both servers:
   ```bash
   # Stop servers (Ctrl+C)
   npm run dev
   ```
5. The app has been optimized to prevent duplicate API calls - if issues persist, check network tab in browser DevTools

#### MongoDB Connection Error

**Solution:**
1. Verify MongoDB is running:
   ```bash
   # Windows
   net start MongoDB
   
   # Check status
   mongo --eval "db.version()"
   ```
2. Check `.env` file has correct `MONGODB_URI`
3. For MongoDB Atlas, ensure IP is whitelisted

### Port Already in Use

If you get an error that port 5000 or 3000 is already in use:

**Windows:**
```bash
# Find process using port 5000
netstat -ano | findstr :5000

# Kill the process (replace PID with actual process ID)
taskkill /PID <PID> /F
```

**macOS/Linux:**
```bash
# Find process using port 5000
lsof -i :5000

# Kill the process
kill -9 <PID>
```

### MongoDB Connection Issues

1. **Check if MongoDB is running:**
   ```bash
   # Windows
   net start MongoDB
   
   # macOS/Linux
   sudo systemctl status mongod
   ```

2. **Verify MongoDB URI in `.env` file**

3. **Check MongoDB logs for errors**

### Module Not Found Errors

If you encounter module not found errors:

```bash
# Delete node_modules and reinstall
rm -rf node_modules
rm -rf client/node_modules
npm run install-all
```

### Build Errors

If you encounter build errors:

```bash
# Clear Next.js cache
cd client
rm -rf .next
npm run build
```

### Slow Loading / Multiple API Calls

The application has been optimized to prevent duplicate API calls. If you still experience issues:

1. **Clear browser cache and reload:**
   - Press `Ctrl+Shift+R` (Windows/Linux) or `Cmd+Shift+R` (Mac) for hard refresh
   - Or clear browser cache manually

2. **Check browser console for errors:**
   - Open Developer Tools (F12)
   - Check Console tab for errors
   - Check Network tab for failed requests

3. **Verify API endpoints are responding:**
   - Visit http://localhost:5000/api/health
   - Should return `{ "status": "ok" }`

4. **Ensure MongoDB is running:**
   ```bash
   # Windows
   net start MongoDB
   
   # macOS/Linux
   sudo systemctl status mongod
   ```

5. **Restart both servers:**
   - Stop both servers (Ctrl+C)
   - Start again with `npm run dev`

6. **Check for port conflicts:**
   - Make sure ports 5000 and 3000 are not used by other applications

## 🚀 Deployment

### Backend Deployment (Heroku/Railway/Render)

1. Set environment variables in your hosting platform
2. Ensure MongoDB Atlas is configured
3. Deploy the root directory (not the client folder)

### Frontend Deployment (Vercel/Netlify)

1. Set `NEXT_PUBLIC_API_URL` to your backend URL
2. Deploy the `client` directory
3. Configure build command: `npm run build`
4. Configure output directory: `.next`

## 📝 Available Scripts

### Root Directory

- `npm run dev` - **Start both servers together** (Recommended for development)
- `npm run server` - Start only the backend server (port 5000)
- `npm run client` - Start only the frontend server (port 3000)
- `npm start` - Start production server (backend only)
- `npm run build` - Build the frontend for production
- `npm run install-all` - Install all dependencies (server + client)
- `npm run setup` - Run database setup script (creates default accounts)

### Quick Start Guide

1. **First time setup:**
   ```bash
   npm run install-all
   ```

2. **Create `.env` file** (see Step 3 above)

3. **Start MongoDB** (see Step 4 above)

4. **Run the app:**
   ```bash
   npm run dev
   ```

5. **Open browser:** http://localhost:3000

### Client Directory

- `npm run dev` - Start Next.js development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## 🔒 Security Notes

- Never commit `.env` files to version control
- Use strong JWT secrets in production
- Enable HTTPS in production
- Regularly update dependencies
- Use environment variables for sensitive data

## 📚 API Documentation

### Authentication Endpoints

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout user

### Appointment Endpoints

- `GET /api/appointments` - Get appointments
- `POST /api/appointments` - Create appointment
- `GET /api/appointments/:id` - Get appointment details
- `PUT /api/appointments/:id/status` - Update appointment status

### Patient Endpoints

- `GET /api/patients/profile` - Get patient profile
- `PUT /api/patients/profile` - Update patient profile
- `GET /api/patients/stats` - Get patient statistics
- `GET /api/patients/appointments` - Get patient appointments

### Doctor Endpoints

- `GET /api/doctors/profile` - Get doctor profile
- `PUT /api/doctors/profile` - Update doctor profile
- `GET /api/doctors/stats` - Get doctor statistics
- `GET /api/doctors/appointments` - Get doctor appointments

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 📞 Support

For support, email support@physiofi.com or create an issue in the GitHub repository.

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- MongoDB for the database solution
- All contributors and users of this project

---

**Made with ❤️ by the PhysioFI Team**

