const fs = require('fs');
const path = require('path');

const authCheck = (req, res, next) =>{
    //console.log(req.headers);
    const authHeader = req.headers.authorization;
    console.log("authCheck");
    //console.log(req.cookies);
    if(req.cookies.auth){
        console.log(req.cookies);
        res.set({
            "Content-Disposition":"attachment; filename=macuin.png"
        })
        next();
    }else{
        res.redirect("http://localhost:3000/");
    }
    /*console.log(req.headers);
    console.log(req.url);
    console.log(req.params);*/
    /*if(req.query.token && req.query.token === "baba"){
        console.log("AuthCheck Cool");
        next();
    }else{
        console.log("AuthCheck Fail");
        res.status(401).json("Error");
    }*/
    /*res.set({
        "Content-Disposition":"attachment; filename=macuin.png"
    })*/
    
};

module.exports = authCheck;