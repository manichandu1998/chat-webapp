require('dotenv').config()
const express = require("express")
const bcrypt = require("bcrypt")
const bodyParser = require("body-parser")
const jwt = require('jsonwebtoken')
const app = express()

app.use(bodyParser.json())
app.use(express.json())

app.listen(3000)
console.log("Listening on Port 3000")
var users = []
var accessTokens = []
app.post('/register',async (req,res)=>{
    try{
        const hashedpassword = await bcrypt.hash(req.body.password,10)
        const user ={'name':req.body.name ,'password':hashedpassword}
        users.push(user)
        res.status(201).send()
    } catch{
        res.status(500).send()
    }
}) 
app.post('/login',async (req,res)=>{
    try{
        const user = users.find(user => user.name == req.body.name)
        console.log(user)
        if(user == null){
            return res.status(400).send("User not found")
        }
        if(await bcrypt.compare(req.body.password,user.password)){
            const accessToken = jwt.sign(user,process.env.ACCESS_TOKEN_SECRET)
            accessTokens.push(accessToken)
            res.json({accessToken:accessToken})
        } else {
            res.send("Wrong Password")
        }
    } catch {
        res.status(500).send()
    }
})

app.post('/logout',async (req,res) =>{
    try {
        accessTokens = accessTokens.filter(accessToken =>{
            accessToken!=req.headers.accessToken
        })
        res.send(201)
    } catch (error) {
        res.status(500)
    }
})

app.get('/getData',(req,res)=>{
    res.json(accessTokens)
})