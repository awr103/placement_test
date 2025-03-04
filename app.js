require('dotenv').config();
const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const passport = require('passport');
const path = require('path');
const mongoose = require('mongoose');

// Import routes
const authRoutes = require('./routes/auth');
const salesRoutes = require('./routes/sales');
const teacherRoutes = require('./routes/teacher');

// Import passport config
require('./config/passport')(passport);

const app = express();

// Connect to MongoDB
const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
    throw new Error('MONGODB_URI is not defined in environment variables');
}

mongoose.connect(MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Session middleware with MongoDB store
app.use(session({
    secret: process.env.SESSION_SECRET || 'your-super-secret-key',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: MONGODB_URI,
        collectionName: 'sessions'
    }),
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        maxAge: 1000 * 60 * 60 * 24 // 24 hours
    }
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Flash messages
app.use(flash());

// Global variables for flash messages
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});

// Root route
app.get('/', (req, res) => {
    if (!req.isAuthenticated()) {
        return res.redirect('/login');
    }
    
    // Redirect based on role
    if (req.user.role === 'TEACHER') {
        res.redirect('/teacher/dashboard');
    } else if (req.user.role === 'SALES') {
        res.redirect('/sales/dashboard');
    } else {
        res.redirect('/login');
    }
});

// Routes
app.use('/', authRoutes);
app.use('/sales', salesRoutes);
app.use('/teacher', teacherRoutes);

// Error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Local access: http://localhost:${PORT}`);
    console.log(`Network access: http://<server-ip>:${PORT}`);
}); 