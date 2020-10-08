const Thing = require('../models/thing');

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

exports.createThing =(req, res, next) => {
    //delete the id because in the form on the front side there is already an id but we mongodb will create a new one automatically
    delete req.body._id;
    //... = title : req.body.title, description : req.body.description etc..    "..." operator
    const thing = new Thing({
        ...req.body
    });
    //save our object in the mongodb
    thing.save()
        .then(() => res.status(201).json({message: 'Objet enregistré !'}))
        .catch(error => res.status(400).json({error}));
};

exports.modifyThing = (req, res, next) => {
    Thing.updateOne({_id: req.params.id}, {...req.body, _id: req.params.id})
        .then(() => res.status(200).json({message: 'Objet modifié !'}))
        .catch(error => res.status(400).json({error}));
};

exports.deleteThing = (req, res, next) => {
    Thing.deleteOne({_id: req.params.id})
        .then(() => res.status(200).json({message: 'Objet supprimé !'}))
        .catch(error => res.status(400).json({error}));
};