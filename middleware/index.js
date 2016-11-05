function loggedOut(req, res, next) {
    if (req.session && req.session.userId) {
        return res.redirect('/profile');
    }
    return next();
}

//if user logged in with session with user id property
//not logged in give error must be logged in to view page
//err.status = 401
function requiresLogIn(req, res, next) {
    if (req.session && req.session.userId) {
        return next();
    } else {
        var err = new Error('User must be logged in!');
        err.status = 401;
        return next(err);
    }
}
module.exports.loggedOut = loggedOut;
module.exports.requiresLogIn = requiresLogIn;
