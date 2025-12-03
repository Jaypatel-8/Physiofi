# PhysioFi - Get Better at Home

A comprehensive physiotherapy platform providing home visits and teleconsultation services in Ahmedabad, Gujarat.

## 🏥 Features

### For Patients
- **Easy Registration**: Simple OTP-based registration and login
- **Book Appointments**: Schedule home visits or online consultations
- **Track Progress**: Monitor your recovery journey with detailed progress tracking
- **Multiple Services**: Orthopedic, neurological, cardiac, and sports rehabilitation
- **Expert Therapists**: Certified and experienced physiotherapists

### For Doctors
- **Professional Dashboard**: Manage appointments and patient records
- **Flexible Scheduling**: Set your availability and service areas
- **Patient Management**: Track patient progress and treatment plans
- **Revenue Tracking**: Monitor your earnings and session statistics

### For Administrators
- **Complete Control**: Manage patients, doctors, and appointments
- **Analytics Dashboard**: Comprehensive insights and reporting
- **User Management**: Handle registrations and account management
- **System Configuration**: Manage services, pricing, and settings

## 🚀 Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **AOS** - Animate On Scroll library
- **Heroicons** - Beautiful SVG icons

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Tokens for authentication
- **bcryptjs** - Password hashing

### Additional Features
- **OTP Authentication** - Secure phone-based login
- **Responsive Design** - Mobile-first approach
- **SEO Optimized** - Structured data and meta tags
- **PWA Ready** - Progressive Web App capabilities

## 📦 Installation

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or cloud)
- npm or yarn

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/physiofi.git
   cd physiofi
   ```

2. **Install dependencies**
   ```bash
   npm run install-all
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env
   ```
   Edit `.env` with your configuration:
   ```env
   MONGODB_URI=mongodb://localhost:27017/physiofi
   JWT_SECRET=your-super-secret-jwt-key
   PORT=5000
   CLIENT_URL=http://localhost:3000
   ```

4. **Set up the database**
   ```bash
   npm run setup
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000/api
   - Health Check: http://localhost:5000/health

## 🗂️ Project Structure

```
physiofi/
├── client/                 # Next.js frontend
│   ├── src/
│   │   ├── app/           # App Router pages
│   │   │   ├── admin/     # Admin dashboard
│   │   │   ├── doctor/    # Doctor dashboard
│   │   │   ├── patient/   # Patient dashboard
│   │   │   └── ...        # Public pages
│   │   ├── components/    # Reusable components
│   │   ├── lib/          # Utility functions
│   │   └── types/        # TypeScript types
│   ├── public/           # Static assets
│   └── package.json
├── models/                # MongoDB models
├── routes/                # Express.js routes
├── middleware/            # Custom middleware
├── server.js             # Express server
├── setup.js              # Database setup
└── package.json
```

## 🔧 Available Scripts

- `npm run dev` - Start both frontend and backend in development mode
- `npm run client` - Start only the frontend development server
- `npm run server` - Start only the backend server
- `npm run build` - Build the frontend for production
- `npm start` - Start the production server
- `npm run setup` - Initialize the database with sample data

## 📱 Pages & Features

### Public Pages
- **Home** - Landing page with services and testimonials
- **About** - Company information and team
- **Services** - Detailed service offerings
- **Consultation** - Online consultation booking
- **Career** - Job opportunities
- **Contact** - Contact information and form

### Dashboard Pages
- **Patient Dashboard** - Appointment management and progress tracking
- **Doctor Dashboard** - Patient management and scheduling
- **Admin Dashboard** - Complete system management

## 🔐 Authentication

- **Patients**: OTP-based authentication via phone number
- **Doctors**: Email and password authentication
- **Admins**: Email and password authentication with role-based access

## 🗄️ Database Models

### Patient
- Personal information and medical history
- Emergency contacts and preferences
- Recovery progress tracking
- OTP verification system

### Doctor
- Professional credentials and specialization
- Availability and service areas
- Rating and review system
- Bank details for payments

### Appointment
- Patient-doctor matching
- Scheduling and rescheduling
- Treatment plans and progress notes
- Payment tracking

### Admin
- Role-based permissions
- System management capabilities
- User account management

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/patient/register` - Patient registration
- `POST /api/auth/patient/verify-otp` - OTP verification
- `POST /api/auth/patient/login` - Patient login
- `POST /api/auth/doctor/login` - Doctor login
- `POST /api/auth/admin/login` - Admin login

### Appointments
- `GET /api/appointments` - Get appointments
- `POST /api/appointments` - Create appointment
- `PATCH /api/appointments/:id/status` - Update status
- `PATCH /api/appointments/:id/reschedule` - Reschedule
- `PATCH /api/appointments/:id/cancel` - Cancel appointment

### Patients
- `GET /api/patients/profile` - Get patient profile
- `PUT /api/patients/profile` - Update profile
- `GET /api/patients/appointments` - Get patient appointments
- `GET /api/patients/stats` - Get patient statistics

### Doctors
- `GET /api/doctors/profile` - Get doctor profile
- `PUT /api/doctors/profile` - Update profile
- `GET /api/doctors/appointments` - Get doctor appointments
- `GET /api/doctors/available` - Get available doctors

## 🎨 Design System

### Colors
- **Primary**: #1C1F4A (Dark Blue)
- **Secondary**: #4A7023 (Green)
- **Accent**: #4DA6FF (Blue)
- **Teal**: #2CA6A4 (Teal)
- **Gray**: #F5F5F5 (Light Gray)

### Typography
- **Sans**: Inter, Lato
- **Serif**: Playfair Display, Merriweather
- **Display**: Playfair Display, Merriweather
- **Button**: Poppins

## 📈 SEO Features

- **Structured Data** - Schema.org markup for medical business
- **Meta Tags** - Comprehensive meta tags for all pages
- **Sitemap** - Automatic sitemap generation
- **Robots.txt** - Search engine crawling instructions
- **PWA Manifest** - Progressive Web App capabilities

## 🚀 Deployment

### Frontend (Vercel/Netlify)
1. Connect your GitHub repository
2. Set build command: `npm run build`
3. Set output directory: `client/.next`
4. Deploy

### Backend (Railway/Heroku/DigitalOcean)
1. Set environment variables
2. Set start command: `npm start`
3. Deploy

### Database (MongoDB Atlas)
1. Create a MongoDB Atlas cluster
2. Get connection string
3. Update `MONGODB_URI` in environment variables

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For support and questions:
- Email: info@physiofi.com
- Phone: +91 9998103191
- Website: https://physiofi.com

## 🙏 Acknowledgments

- Design inspiration from IMS People and Setu CDC
- Icons by Heroicons
- Fonts by Google Fonts
- Animation by Framer Motion

---

**PhysioFi** - Get Better at Home 🏠💪# Physiofi
