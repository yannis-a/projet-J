const multer = require('multer');

// type de fichier que l'on envoie depuis le front-end
const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png'
};

const storage = multer.diskStorage({
    //destination indique à multer d'enregistrer les fichiers dans le dossier images ;
    destination: (req, file, callback) => {
        callback(null, 'images');
    },
    //filename indique à multer d'utiliser le nom d'origine, de remplacer les espaces par des underscores et
    //d'ajouter un timestamp Date.now() comme nom de fichier.
    // Elle utilise ensuite la constante dictionnaire de type MIME pour résoudre l'extension de fichier appropriée ;
    filename: (req, file, callback) => {
        const name = file.originalname.split(' ').join('_');
        const extension = MIME_TYPES[file.mimetype];
        callback(null, name + Date.now() + '.' + extension); //deuxieme argument crée le fichier unique avec l'extension qui correspond à celle envoyée depuis le front-end
    }
});

module.exports = multer({storage: storage}).single('image');