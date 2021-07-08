const express = require('express')
const dotenv = require('dotenv');
var mongoose = require('mongoose');
dotenv.config()
const { encrypt, decrypt } = require('../crypto')
const { generate } = require('../generate')
const bcrypt = require('bcrypt')
const Password = require('../models/password')
const User = require('../models/users')
const jwt = require('jsonwebtoken')


const router = express.Router()

router.post('/add', verifyJWT, async (req, res) => {
    const { password, title } = req.body
    const hashedPassword = await encrypt(password)
    try {
        const pw = await Password.create({password: hashedPassword.content, title: title, iv: hashedPassword.iv, userId: req.userId})
        pw.password = undefined
        return res.send({ pw })
    } catch (err) {
        return res.status(400).send({ error: 'Failed'})
    }
})

router.get('/list', verifyJWT, async (req, res) => {
    try {
        const pw = await Password.find({userId: req.userId})
        console.log(pw)
        return res.send({ pw })
    } catch (err) {
        return res.status(400).send({ error: 'Error'})
    }
})

router.post('/decrypt', verifyJWT, async (req, res) => {
    res.send(decrypt(req.body))
})

router.post('/generate', async (req, res) => {
    const { CharNum, incUp, incNum, incSym } = req.body
    res.send(generate( CharNum, incUp, incNum, incSym ))
})

router.post('/signup', async (req, res) => {
    const isRegistered = await User.findOne({email: req.body.email})
    if (isRegistered) {
        return res.status(409).send({error: 'Este e-mail já está cadastrado!'})
    }
    else {
        bcrypt.hash(req.body.password, 10, async (errBcrypt, hash) => {
            if (errBcrypt) {
                return res.status(500).send({ error: errBcrypt })
            }
            try {
                const user = await User.create({name: req.body.name, email: req.body.email, password: hash})
                user.password = undefined
                return res.send({ user })
            } catch (err) {
                return res.status(400).send({ error: 'Erro ao cadastrar usuário: '+err})
            }
        })
    }
})

router.post('/signin', async (req, res) => {
    const query = await User.findOne({email: req.body.email})
    if (query) {
        bcrypt.compare(req.body.password, query.password, (err, result) => {
            if (result) {
                let token = jwt.sign({
                    userId: query._id
                },
                process.env.JWT_SECRET,
                {
                    expiresIn: "1h"
                })
                return res.status(200).send({ success: 'Autenticado com sucesso', token: token})
            }
            else {
                return res.status(401).send({ error: 'Falha na autenticação' })
            }
        })
    }
    else {
        return res.status(400).send({error: 'E-mail não encontrado!'})
    }
})

router.delete('/delete/:id', verifyJWT, async (req, res) => {
    const query = await Password.findById(req.params.id)
    if ((query) && (req.userId == query.userId)) {
        const del = await Password.deleteOne({_id: req.params.id})
        return res.status(200).send({ message: del })
    }
    else {
        return res.status(403).send({ error: 'Não autorizado' })
    }
})

router.put('/update/:id', verifyJWT, async (req, res) => {
    const query = await Password.findById(req.params.id)
    if ((query) && (req.userId == query.userId)) {
        const hashedPassword = await encrypt(req.body.password)
        const update = await Password.updateOne({_id: req.params.id}, { $set: { password: hashedPassword.content, iv: hashedPassword.iv } })
        return res.status(200).send({ message: update })
    }
    else {
        return res.status(403).send({ error: 'Não autorizado' })
    }
})

function verifyJWT(req, res, next) {
    const token = req.headers['x-access-token']
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if(err) return res.status(401).send('Token inválido')
        
        req.userId = decoded.userId
        next()
    })
}

module.exports = app => app.use('/', router)