const express = require('express')
const app = express()
app.use(express.json())
app.use(express.urlencoded({extended:true}))
const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost:27017/microservices_chat', {useNewUrlParser: true, useUnifiedTopology: true}, () => {
    console.log('connected');
});

const msgRoute = require("./routes/msgRoute")

app.use("/", msgRoute)


// function generateAccessToken(user){
    //  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '3600s'})
// }

app.get ('/', (req, res)=>{

    return
})

app.post('/chat', (req,res) =>{
    res.send
    
})

app.listen(3000, ()=>{
    console.log('server running on 3000');
})