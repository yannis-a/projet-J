const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1]; // car on sait que dans le header de la requete le token est dans authorization
        // split met dans un tableau toutes les chaines séparées par des espaces. ici bearer et le token, [1] renvoie le token.
        const decodedToken = jwt.verify(token, 'RANDOM_SECRET_KEY');
        const userId = decodedToken.userId;
        if (req.body.userId && req.body.userId !== userId) {
            throw 'Invalid user ID'; // renvoie dans le catch
        } else {
            next(); //ici tout va bien alors on passe au prochain middleware
        }
    } catch {
        res.status(401).json({
            error: new Error('Invalid request!')
        });
    }
};