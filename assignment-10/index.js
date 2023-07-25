const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');
const session = require('express-session');
const crypto = require('crypto');

app.listen(3000,()=>{
    console.log('server is running on port 3000');
});

app.use(express.static(path.join(__dirname,'public')));
app.use(express.json());

function getEncryptedKey(){
    return crypto.randomBytes(32).toString('hex');
}

const secretKey = getEncryptedKey();

app.use(session({
    secret:secretKey,
    resave:false,
    saveUninitialized:false,
    cookie: {
        sameSite: 'none', // Set SameSite attribute to None
        secure: true,     // Ensure the cookie is only sent over HTTPS connections
      }
}));

app.get('/home',(req,res)=>{
    if(req.session.username && req.session){
        res.sendFile('home.html');
    }else{
        res.redirect('index.html');
    }
});

app.get('/logout',(req,res)=>{
    req.session.destroy((err)=>{
        if(err){
            console.log(err);
            res.status(500).send({message:'Internal Server error !'});
        }else{
            res.redirect('/index.html');
        }
    });
});

app.get('/',(req,res)=>{
    res.sendFile('index.html');
});

app.post('/login',(req,res)=>{
    const {username,password} = req.body;
    fs.readFile(path.join(__dirname,'users.json'),'utf-8',(err,data)=>{
        if(err){
            console.log(err);
            res.status(501).send({message:'Internal Server error !'});
        }else{
            const users = JSON.parse(data);
            const user = users.find(user=>user.username === username && user.password === password);
            if(user){
                res.status(200).send({message:'sucess'});
                req.session.username = username;
            }else{
                res.status(401).send({message:'failed'});
            }
        }
    });
});

app.post('/register',(req,res)=>{
    const {username,password} = req.body;
    fs.readFile(path.join(__dirname,'users.json'),'utf8',(err,data)=>{
        if(err){
            res.status(500).send({message:'Internal Server error !'});
            console.log(err);
        }else{
            const users = JSON.parse(data);
            const user = users.find(user=>user.username === username);
            if(user){
                res.status(401).send({message:'User already exist'});
            }else{
                users.push({username,password});
                fs.writeFile(path.join(__dirname,'users.json'),JSON.stringify(users),(err)=>{
                    if(err){
                        res.status(500).send({message:'Internal Server error !'});
                        console.log(err);
                    }else{
                        res.status(200).send({message:'user created !'});
                        req.session.username = username;
                    }
                });
            }
        }
    });
})