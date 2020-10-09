const Thing = require('../models/thing');
const fs = require('fs')

exports.getAllThing = (req, res, next) => {
    // find() is a method that finds all Thing objects in mongodb's table and returns them
    Thing.find()
        .then(things => res.status(200).json(things))
        .catch(error => res.status(400).json({error}));
};

exports.getOneThing = (req, res, next) => {
    Thing.findOne({_id: req.params.id})
        .then(thing => res.status(200).json(thing))
        .catch(error => res.status(404).json({error}));
};

exports.createThing = (req, res, next) => {
    //Pour ajouter un fichier à la requête, le front-end doit envoyer les données de la requête sous la forme form-data,
    // et non sous forme de JSON. Le corps de la requête contient une chaîne thing , qui est simplement un objet Thing converti en chaîne
    const thingObject = JSON.parse(req.body.thing);
    //delete the id because in the form on the front side there is already an id but we mongodb will create a new one automatically
    delete thingObject.body._id;
    //... = title : req.body.title, description : req.body.description etc..    "..." operator
    const thing = new Thing({
        ...thingObject.body,
        /*
        Nous devons également résoudre l'URL complète de notre image, car req.file.filename ne contient que le segment filename.
        Nous utilisons req.protocol pour obtenir le premier segment (dans notre cas 'http' ).
        Nous ajoutons '://' , puis utilisons req.get('host') pour résoudre l'hôte du serveur (ici, 'localhost:3000' ).
        Nous ajoutons finalement '/images/' et le nom de fichier pour compléter notre URL.
         */
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`

    });
    //save our object in the mongodb
    thing.save()
        .then(() => res.status(201).json({message: 'Objet enregistré !'}))
        .catch(error => res.status(400).json({error}));
};

exports.modifyThing = (req, res, next) => {
    // on regarde si il y a un fichier dans la requête
    const thingObject = req.file ?
        {
            ...JSON.parse(req.body.thing),
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        } : {...req.body};
    Thing.updateOne({_id: req.params.id}, {...thingObject, _id: req.params.id})
        .then(() => res.status(200).json({message: 'Objet modifié !'}))
        .catch(error => res.status(400).json({error}));
};

exports.deleteThing = (req, res, next) => {
    /*
    nous utilisons l'ID que nous recevons comme paramètre pour accéder au Thing correspondant dans la base de données ;

    nous utilisons le fait de savoir que notre URL d'image contient un segment /images/ pour séparer le nom de fichier ;

    nous utilisons ensuite la fonction unlink du package fs pour supprimer ce fichier, en lui passant le fichier à supprimer
    et le callback à exécuter une fois ce fichier supprimé ;

    dans le callback, nous implémentons la logique d'origine, en supprimant le Thing de la base de données.
     */
    Thing.findOne({_id: req.params.id})
        .then(thing => {
            const filename = thing.imageUrl.split('/images/')[1];
            fs.unlink(`images/${filename}`, () => {
                Thing.deleteOne({_id: req.params.id})
                    .then(() => res.status(200).json({message: 'Objet supprimé !'}))
                    .catch(error => res.status(400).json({error}));
            });
        })
        .catch(error => res.status(500).json({error}));
};