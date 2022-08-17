
//JWT modul importálása
const jwt = require('jsonwebtoken');

//Azért hogy elérjük a környezeti változókat
//pontosabban a JWT titkosításához használt titkos kulcsot
require('dotenv').config();

//Middleware létrehozása
const verify = (req, res, next) =>{
    //Kérésből kiolvassuk az authorization attribútum értékét
    const authHeader = req.headers.authorization;

    //Ha létezik ez az attribútum akkor tovább megy, ha nem létezik a válasz hibát ad vissza
    if(authHeader){
        //Felbontjuk az authorization értékét mert úgy érkezik hogy "Bearer JWT_TOKEN_STRING"
        //Az érték Bearer része nemkell ezért felbontjuk és eltároljuk csak a JWT stringet
        const token = authHeader.split(" ")[1];

        //Ellenőrizzük a tokent hogy hiteles-e
        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {

            //Ha valami hiba történt visszaadjuk hogy nem jó a token
            if(err){
                return res.status(403).json("Token is invalid");
            }

            //Ha minden jó, hozzáadunk a kéréshez egy új attribútumot ami a JWT adatait tartalmazza
            req.jwt = user;

            //Tovább engedi a kérést
            next();  
        });
    } else{
        res.status(401).json("Not authenticated");
    }
};

//Middleware exportálása
module.exports = verify;

