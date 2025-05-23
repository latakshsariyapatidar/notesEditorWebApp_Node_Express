const express = require('express');
const path = require('path');
const app = express();
const fs = require('fs');


app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res)=> {
    fs.readdir('./files', (err, files) => {
        res.render("index", {files:files});
    })
})

app.post('/create', (req, res) => {
    const fileName = req.body.fileName;
    const fileContent = req.body.fileContent;

    if (fileName && fileContent) {
        fs.writeFile('./files/' + fileName.split(' ').join('_')+'.txt', fileContent, (err)=> {
        if(err) {
            console.log(err.message);
        }
    })
    }
    else{
        console.log("File name or content is empty");
        res.redirect('/');
    }

    res.redirect('/');
})

app.post('/update', (req, res) => {
    const newFileName = req.body.newFileName;
    const fileContent = req.body.newFileContent;

    if (newFileName) {
        fs.rename('./files/' + req.body.oldFileName, './files/' + newFileName.split(' ').join('_')+'.txt', (err) => {
            if(err) {
                console.log(err.message);
            }
        })
    }
    if (fileContent && newFileName) {
        fs.writeFile('./files/' + newFileName.split(' ').join('_')+'.txt', fileContent, (err)=> {
            if(err) {
                console.log(err.message);
            }
        })
    }
    if (fileContent && !newFileName) {
        fs.writeFile('./files/' + req.body.oldFileName, fileContent, (err)=> {
            if(err) {
                console.log(err.message);
            }
        })
    }
    else{
        console.log("File name or content is empty");
        res.redirect('/');
    }
})


app.get('/files/:fileName', (req, res) => {
    console.log(req.params.fileName);

    const fileName = req.params.fileName.split('_').join(' ');
    const newFileName = fileName.split('.');

    fs.readFile('./files/' + req.params.fileName, 'utf-8', (err, data) => {
        console.log(data);
        if(err){
            console.log(err.message);
            res.redirect('/');
        }else{
            res.render('show', {fileName: newFileName[0], fileContent: data});
        }
    })

})

app.get('/edit/:fileName', (req, res)=> {
    fs.readFile('./files/' + req.params.fileName, 'utf-8', (err, data) => {
        console.log(data);
        if(err){
            console.log(err.message);
            res.redirect('/');
        }else{
            res.render('edit', {fileName: req.params.fileName, fileContent: data});
        }
    })
})

app.listen(3000);   