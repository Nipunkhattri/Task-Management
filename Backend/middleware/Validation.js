export const validateContact = (req, res, next) => {
    const { firstName, lastName, email } = req.body;
    const errors = [];
  
    if (!firstName) errors.push('First name is required');
    if (!lastName) errors.push('Last name is required');
    if (!email) errors.push('Email is required');
    if (email && !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      errors.push('Invalid email format');
    }
  
    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }
  
    next();
};