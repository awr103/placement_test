const express = require('express');
const router = express.Router();
const { ensureAuthenticated, ensureSales } = require('../middleware/auth');
const PlacementTest = require('../models/PlacementTest');
const User = require('../models/User');

// Sales Dashboard
router.get('/dashboard', ensureAuthenticated, ensureSales, async (req, res) => {
    try {
        const tests = await PlacementTest.find()
            .sort({ scheduled_datetime: 1 });
        
        res.render('sales_dashboard', {
            tests,
            success_msg: req.flash('success_msg'),
            error_msg: req.flash('error_msg')
        });
    } catch (error) {
        console.error('Error fetching tests:', error);
        req.flash('error_msg', 'Error loading dashboard');
        res.redirect('/');
    }
});

// Create new placement test
router.post('/create-pt', ensureAuthenticated, ensureSales, async (req, res) => {
    try {
        const {
            student_name,
            student_age,
            program,
            scheduled_date,
            scheduled_time,
            sales_notes
        } = req.body;

        // Combine date and time
        const scheduled_datetime = new Date(`${scheduled_date}T${scheduled_time}`);

        const newTest = new PlacementTest({
            student_name,
            student_age: parseInt(student_age),
            program,
            scheduled_datetime,
            sales_notes,
            status: 'Scheduled',
            sales_user: req.user._id
        });

        await newTest.save();
        
        req.flash('success_msg', 'Placement test created successfully');
        res.redirect('/sales/dashboard');
    } catch (error) {
        console.error('Error creating test:', error);
        req.flash('error_msg', 'Error creating placement test');
        res.redirect('/sales/dashboard');
    }
});

// View test result
router.get('/view-result/:id', ensureAuthenticated, ensureSales, async (req, res) => {
    try {
        const test = await PlacementTest.findById(req.params.id);
        
        if (!test) {
            req.flash('error_msg', 'Test not found');
            return res.redirect('/sales/dashboard');
        }

        res.render('view_result', { test });
    } catch (error) {
        console.error('Error viewing result:', error);
        req.flash('error_msg', 'Error viewing test result');
        res.redirect('/sales/dashboard');
    }
});

module.exports = router; 