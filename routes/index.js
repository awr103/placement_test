const express = require('express');
const router = express.Router();

// Root route
router.get('/', (req, res) => {
    if (req.isAuthenticated()) {
        // Redirect based on user role
        if (req.user.role === 'SALES') {
            res.redirect('/sales/dashboard');
        } else if (req.user.role === 'TEACHER') {
            res.redirect('/teacher/dashboard');
        } else {
            res.redirect('/login');
        }
    } else {
        res.redirect('/login');
    }
});

module.exports = router; 