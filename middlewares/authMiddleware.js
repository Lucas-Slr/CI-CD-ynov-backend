import jwt from 'jsonwebtoken';

export const authenticateUser = (req, res, next) => {
    const token = req.header('Authorization');

    if (!token) return res.status(401).json({ message: "Accès refusé, token manquant" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(400).json({ message: "Token invalide" });
    }
};

export const isAdmin = (req, res, next) => {
    if (!req.user || !req.user.isAdmin) {
        return res.status(403).json({ message: "Accès refusé, administrateur requis" });
    }
    next();
};
