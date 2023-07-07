const admin = require('firebase-admin');

async function authenticateToken(req, res, next) {
    const authHeader = req.headers.authorization;

    //Bearer is generated by login server, just a crypt thing and we need to check if it contains it before authorizing
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            error: 'Unhautorized'
        });
    }

    //Getting only the token
    const token = authHeader.split(' ')[1];

    try {
        const decodedToken = await admin.auth().verifyIdToken(token);
        req.uid = decodedToken.uid;
        next();
    } catch (error) {
        console.error('Error verifying token: ', error);
        res.status(401).json({
            error: 'Unhautorized'
        });
    }
}

module.exports = authenticateToken;
