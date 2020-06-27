const express = require("express")
const bcrypt = require("bcrypt")
const bodyParser = require("body-parser")
const app = express()
app.use(bodyParser.json())
app.listen(3000)
var users = []
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
            res.send("Success")
        } else {
            res.send("Wrong Password")
        }
    } catch {
        res.status(500).send()
    }
})

app.get('/users',(req,res)=>{
    res.json(users)
})