const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;

let categoriaSchema = new Schema({
    descripcion: { type: String, unique: true, required: [true, 'La descripción es obligatoria'] },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario' }
});

//Probleme avec ce uniqueValidator
//categoriaSchema.plugin(uniqueValidator, { message : 'La descripcion debe de ser unico' });


module.exports = mongoose.model('Categoria', categoriaSchema);
