const mongoose = require('../database')
mongoose.set('useCreateIndex', true)
const PasswordSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    iv: {
        type: String,
        required: true
    },
    userId: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

const Password = mongoose.model('Password', PasswordSchema)

module.exports = Password