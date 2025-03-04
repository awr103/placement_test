module.exports = {
    ensureAuthenticated: function(req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }
        req.flash('error_msg', 'Please log in to view this resource');
        res.redirect('/login');
    },

    ensureSales: function(req, res, next) {
        if (req.isAuthenticated() && req.user.role === 'SALES') {
            return next();
        }
        req.flash('error_msg', 'Access denied. Sales role required.');
        res.redirect('/login');
    },

    ensureTeacher: function(req, res, next) {
        if (req.isAuthenticated() && req.user.role === 'TEACHER') {
            return next();
        }
        req.flash('error_msg', 'Access denied. Teacher role required.');
        res.redirect('/login');
    }
}; 