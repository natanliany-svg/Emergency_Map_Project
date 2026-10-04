import jwt from 'jsonwebtoken'

export function authenticate(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1] 

    if (!token) {
        return res.status(401).json({ success: false, message: "Unauthorized" })
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'defaltSecrt123')
        req.user = decoded 
        next() 
    } catch (error) {
        return res.status(403).json({ success: false, message: "Forbidden" })
    }
}

export function authorizeRole(rolesArray) {
    return (req, res, next) => {
        if (!req.user || !rolesArray.includes(req.user.role)) {
            return res.status(403).json({ success: false, message: "Forbidden" })
        }
        next() 
    }
}