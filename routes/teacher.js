const express = require('express');
const router = express.Router();
const { ensureAuthenticated, ensureTeacher } = require('../middleware/auth');
const PlacementTest = require('../models/PlacementTest');

// Teacher Dashboard
router.get('/dashboard', ensureAuthenticated, ensureTeacher, async (req, res) => {
    try {
        const tests = await PlacementTest.find({
            status: { $in: ['Scheduled', 'In Progress'] }
        })
        .populate('sales_user', 'username')
        .sort({ scheduled_datetime: 1 });

        res.render('teacher_dashboard', {
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

// Start test
router.post('/start-test/:id', ensureAuthenticated, ensureTeacher, async (req, res) => {
    try {
        const test = await PlacementTest.findById(req.params.id);
        
        if (!test) {
            req.flash('error_msg', 'Test not found');
            return res.redirect('/teacher/dashboard');
        }

        test.status = 'In Progress';
        test.teacher_user = req.user._id;
        await test.save();

        req.flash('success_msg', 'Test started successfully');
        res.redirect(`/teacher/conduct-test/${test._id}`);
    } catch (error) {
        console.error('Error starting test:', error);
        req.flash('error_msg', 'Error starting test');
        res.redirect('/teacher/dashboard');
    }
});

// Conduct test page
router.get('/conduct-test/:id', ensureAuthenticated, ensureTeacher, async (req, res) => {
    try {
        const test = await PlacementTest.findById(req.params.id)
            .populate('sales_user', 'username');

        if (!test) {
            req.flash('error_msg', 'Test not found');
            return res.redirect('/teacher/dashboard');
        }

        res.render('conduct_test', { 
            test,
            success_msg: req.flash('success_msg'),
            error_msg: req.flash('error_msg')
        });
    } catch (error) {
        console.error('Error loading test:', error);
        req.flash('error_msg', 'Error loading test');
        res.redirect('/teacher/dashboard');
    }
});

// Submit test results
router.post('/submit-test/:id', ensureAuthenticated, ensureTeacher, async (req, res) => {
    try {
        const {
            grammar_notes,
            vocabulary_notes,
            fluency_notes,
            pronunciation_notes,
            recommended_program,
            recommended_level,
            teacher_comments
        } = req.body;

        const test = await PlacementTest.findById(req.params.id);
        
        if (!test) {
            req.flash('error_msg', 'Test not found');
            return res.redirect('/teacher/dashboard');
        }

        test.grammar_notes = grammar_notes;
        test.vocabulary_notes = vocabulary_notes;
        test.fluency_notes = fluency_notes;
        test.pronunciation_notes = pronunciation_notes;
        test.recommended_program = recommended_program;
        test.recommended_level = recommended_level;
        test.teacher_comments = teacher_comments;
        test.status = 'Completed';
        test.completed_datetime = new Date();

        await test.save();

        req.flash('success_msg', 'Test results submitted successfully');
        res.redirect('/teacher/dashboard');
    } catch (error) {
        console.error('Error submitting test results:', error);
        req.flash('error_msg', 'Error submitting test results');
        res.redirect('/teacher/dashboard');
    }
});

module.exports = router; 