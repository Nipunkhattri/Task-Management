import jwt from 'jsonwebtoken'

export const verifyToken = (req, res, next) => {
    const token = req.headers.Authorization || req.headers['x-access-token']
    
    if (!token) {
        return res.status(403).send({ message: 'No token provided!' })
    }
    
    jwt.verify(token, process.env.JWT_SECRET , (err, decoded) => {
        if (err) {
            return res.status(401).send({ message: 'Unauthorized!' })
        }
        req.userId = decoded.id
        req.user = {
            id: decoded.id,
            role: decoded.role
        };
        next()
    });
}

export const isAdmin = (req, res, next) => {
    if (!req.user || req.user.role !== 'Admin') {
        return res.status(403).send({ message: 'Require Admin Role!' });
    }
    next();
}