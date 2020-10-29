// =============================== LOGIN CHECK ==============================
// =============================== LOGIN CHECK ==============================
// =============================== LOGIN CHECK ==============================

exports.checkAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }

  return res.redirect('/auth/login');
};

exports.checkNotAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return res.redirect('/');
  }
  return next();
};
