
export const validateLogin = (req, res, next) => {
    console.log("Middleware validateLogin ejecutándose");
    console.log("Sesión:", req.session);
    if (req.session && req.session.user) {
      console.log("User session present. Allowing access.");
      next();
    } else {
      console.log("Redirecting to /login because the session is not there");
      res.redirect('/login');
    }
  };
  