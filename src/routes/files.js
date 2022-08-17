const path = require('path');
const fs = require('fs');
const express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
const verify = require('../verify');
require('dotenv').config();

const Folder = require('../models/folderModel');

router.get('/getFolders', async (req, res) => {
  /*const filePath = path.join(__dirname, '..', '..', 'private', 'babi', 'peter.mp4');
  res.send(filePath);*/
  const folders = await Folder.find();
  res.status(200).json(folders);
});


router.get('/send', (req, res) => {
  const filePath = path.join(__dirname, '..', '..', 'private', 'babi', 'peter.mp4');
  res.send(filePath);
});

//To "serve"
router.get('/sendFile', (req, res) => {
    const filePath = path.join(__dirname, '..', '..', 'private', 'babi', 'peter.mp4');

    const options = {
        root: filePath,
        dotfiles: 'deny',
        headers: {
          'x-timestamp': Date.now(),
          'x-sent': true
        }
      }

    res.sendFile(filePath, (err) => {
        if (err) {
          console.log("Not Sent");
          res.json("Error");
        } else {
          console.log('Sent')
        }
    });
});

//Use This for Download
router.get('/downloadBlob', (req, res) => {
  try {
    console.log(req.query);
    const filePath = path.join(__dirname, '..', '..', 'private', req.query.path, req.query.filename);
    console.log(filePath);
    if(fs.existsSync(filePath)){
      res.status(200).download(filePath);
    }else{
      res.status(400).json("error");
    }
  } catch (error) {
    res.status(400).json(error);
  }
    
});

router.get('/downloadAttachement', (req, res) => {
  try {
    //console.log(req.query);
    const filePath = path.join(__dirname, '..', '..', 'private', 'babi', 'macuin.png');
    console.log(filePath);
    if(fs.existsSync(filePath)){
      const data = fs.readFileSync(filePath);
      const stat = fs.statSync(filePath);
      res.set({
        "Content-Type":"image/png",
        "Content-Disposition": `attachment; filename=${"macuin.png"}`,
        "Content-Length": stat.size
      })
      res.status(200).send(data);
    }else{
      res.status(400).json("error");
    }
  } catch (error) {
    res.status(400).json(error);
  }
  //res.json("xd");
    
});

router.post('/download', (req, res) => {
  try {
    //console.log(req.query);
    console.log(req.headers);
    const {folder, filename} = req.body;
    const filePath = path.join(__dirname, '..', '..', 'private', folder, filename);
    console.log(filePath);
    if(fs.existsSync(filePath)){
      res.status(200).json({url:`http://localhost:3001/private/${folder}/${filename}`});
    }else{
      res.status(400).json("error");
    }
  } catch (error) {
    res.status(400).json(error);
  }
    
});

router.get('/downloadTest', (req, res) => {
  const filePath = path.join(__dirname, '..', '..', 'private', "babi", "macuin.png");
  console.log(filePath);
  /*res.set({
    "Content-Disposition": "attachment; filename=macuin.png",
    "Content-Type":"image/png"
  })*/
  /*res.attachment(filePath)
  console.log(filePath);
  res.sendFile(filePath);*/
  res.download(filePath,"macuin.png", (err) => {
    if (err) console.log(err);
  })
});

router.get('/test', (req, res) => {
  console.log(req.headers);
  return res.json("xd");
});

//Use This for Stream
router.get('/stream', (req, res) => {
    const range = req.headers.range;
    if(!range){
        return res.status(400).send("Requires header range");
    }

    const filePath = path.join(__dirname, '..', '..', 'private', 'babi', 'stream.mp4');
    
    const fileStats = fs.statSync(filePath);
    const chunkSize = 10**6;//1MB
    const start = Number(range.replace(/\D/g, ""));
    const end = Math.min(start + chunkSize, fileStats.size - 1);
    const contentLength = end - start + 1;

    const headers = {
        "Content-Range": `bytes ${start}-${end}/${fileStats.size}`,
        "Accepts-Ranges": "bytes",
        "Content-Length": contentLength,
        "Content-Type": "video/mp4"
    }
    
    res.writeHead(206, headers);
    const videoStream = fs.createReadStream(filePath, {start, end});
    
    videoStream.pipe(res);
});


router.post('/create-folder', verify, (req, res) => {
  console.log(req.jwt);
  const filePath = path.join(__dirname, '..', '..', 'private', req.jwt.folder_name);
  console.log(filePath);
  //const mkdirResult = fs.mkdirSync(filePath);
  //Token process.env.JWT_SECRET
  if (!fs.existsSync(filePath)){
    try {
      fs.mkdirSync(filePath);
      res.status(200).json({folder_name: req.jwt.folder_name});
    } catch (error) {
      console.log(error);
      res.status(400).json({error:"Create Folder error"});
    }
  }else{
    let i = 1;

    for(i; i<=50; ++i){
      if(!fs.existsSync(`${filePath} (${i})`)){
        fs.mkdirSync(`${filePath} (${i})`);
        break;
      }
    }
    if(i === 51){
      res.status(400).send("Bro name your folders please");
    }else{
      res.status(200).json({folder_name: `${filePath} (${i})`});
    }
  }
  
});

/*router.post('/create-folder-test', (req, res) => {
  console.log(req.body);
  const filePath = path.join(__dirname, '..', '..', 'private', req.body.folder_name);
  console.log(filePath);
  //const mkdirResult = fs.mkdirSync(filePath);
  //Token process.env.JWT_SECRET
  if (!fs.existsSync(filePath)){
    try {
      fs.mkdirSync(filePath);
      res.status(200).json({folder_name: req.body.folder_name});
    } catch (error) {
      console.log(error);
      res.status(400).send("Create Folder error");
    }
  }else{
    let i = 1;

    for(i; i<=50; ++i){
      if(!fs.existsSync(`${filePath} (${i})`)){
        fs.mkdirSync(`${filePath} (${i})`);
        break;
      }
    }
    if(i === 51){
      res.status(400).send("Bro name your folders please");
    }else{
      res.status(200).json({folder_name: `${filePath} (${i})`});
    }
    
  }
  
});*/

module.exports = router;