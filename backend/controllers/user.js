const bcrypt = require('bcrypt')
const User = require('../models/User')
const jwt = require('jsonwebtoken');

exports.signup = (req, res, next) => {
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            const user = new User({
                email: req.body.email,
                password: hash
            });
            user.save()
                .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
                .catch(error => res.status(400).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};

exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email })
        .then(user => {
            if (!user) {
                return res.status(401).json({ error: 'Utilisateur non trouvé !' });
            }
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({ error: 'Mot de passe incorrect !' });
                    }
                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign(
                            { userId: user._id }, // données que l'on veut encoder dans le token ici on choisit le userId
                            'RANDOM_SECRET_KEY', // chaîne secrète de développement temporaire RANDOM_SECRET_KEY pour encoder notre token (à remplacer par une chaîne aléatoire beaucoup plus longue pour la production)
                            { expiresIn: '24h' } // token expire après 24h
                        )
                    });
                })
                .catch(error => res.status(500).json({ error })); // 500 problem server
        })
        .catch(error => res.status(500).json({ error })); // 500 problem server
};