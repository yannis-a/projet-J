const mongoose = require('mongoose');

//schema mongoose to configure our object Thing

const thingSchema = mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    imageUrl: { type: String, required: true },
    userId: { type: String, required: true },
    price: { type: Number, required: true },
});

//to export the model we just created above
module.exports = mongoose.model('Thing', thingSchema);