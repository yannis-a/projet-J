const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const stuffRoutes = require('./routes/stuff');
const userRoutes = require('./routes/user');
const path = require('path');

const app = express();

mongoose.connect('mongodb+srv://admin:passwordadmin1@cluster0.dinxj.gcp.mongodb.net/projetJ?retryWrites=true&w=majority',
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));


app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use(bodyParser.json());
/*
Nous devons indiquer à notre app.js comment traiter les requêtes vers la route /image , pour cela il faut indiquer à
Express qu'il faut gérer la ressource images de manière statique (un sous-répertoire de notre répertoire de base, __dirname )
à chaque fois qu'elle reçoit une requête vers la route /images
 */
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/api/stuff', stuffRoutes);
app.use('api/auth', userRoutes)

module.exports = app;