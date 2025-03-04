const express = require('express');
const router = express.Router();
const passport = require('passport');

// Login page
router.get('/login', (req, res) => {
    // If already logged in, redirect to appropriate dashboard
    if (req.isAuthenticated()) {
        if (req.user.role === 'TEACHER') {
            return res.redirect('/teacher/dashboard');
        } else if (req.user.role === 'SALES') {
            return res.redirect('/sales/dashboard');
        }
    }
    res.render('login', { 
        messages: {
            error: req.flash('error'),
            success_msg: req.flash('success_msg'),
            error_msg: req.flash('error_msg')
        }
    });
});

// Login process
router.post('/login', passport.authenticate('local', {
    failureRedirect: '/login',
    failureFlash: true
}), (req, res) => {
    // Redirect based on role
    if (req.user.role === 'TEACHER') {
        res.redirect('/teacher/dashboard');
    } else if (req.user.role === 'SALES') {
        res.redirect('/sales/dashboard');
    } else {
        res.redirect('/login');
    }
});

// Logout
router.get('/logout', (req, res) => {
    req.logout((err) => {
        if (err) {
            console.error('Error during logout:', err);
            return res.redirect('/');
        }
        req.flash('success_msg', 'You have been logged out');
        // Clear session
        req.session.destroy((err) => {
            if (err) {
                console.error('Error destroying session:', err);
            }
            res.clearCookie('connect.sid');
            res.redirect('/login');
        });
    });
});

module.exports = router; 