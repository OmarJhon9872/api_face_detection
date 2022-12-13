const express = require('express');
const path = require('path');

const env = require('dotenv');
env.config({path: './config/.env'});

// const ip = require('ip');
/* Dependencias de carga de archivos */
var mime = require('mime');
var formidable = require('formidable');
var util = require('util');

// const url = require('url')

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const viewsDir = path.join(__dirname, 'views')
app.use(express.static(viewsDir))
app.use(express.static(path.join(__dirname, './public')))
app.use(express.static(path.join(__dirname, './weights')))
app.use(express.static(path.join(__dirname, './dist')))
app.use(express.static(path.join(__dirname, './node_modules/recordrtc')))

app.get('/', (req, res) => res.sendFile(path.join(viewsDir, 'faceDetection.html')));
app.get('/grabacion', (req, res) => res.sendFile(path.join(viewsDir, 'grabacion.html')));
app.post('/uploadFile', (request, response) => {    

    uploadFile(request, response);
    return
});


function uploadFile(request, response) {
    // parse a file upload
    var form = new formidable.IncomingForm();

    var isWindows = process.platform.match(/^win/);
    var dir = !!isWindows ? '\\public\\uploads\\' : '/public/uploads/';
    
    form.uploadDir = __dirname + dir;
    form.keepExtensions = true;
    form.maxFieldsSize = 10 * 1024 * 1024;
    form.maxFields = 1000;
    form.multiples = false;
    

    form.parse(request, function(err, fields, files) {
        var file = util.inspect(files);         
           
        response.writeHeader(200, {'Content-type':'application/json'});
        
        /* Nombre que asigna sistema ficheros */
        fileName = file.split('newFilename:')[1].split("',")[0].replace("'", '').replace(" ", '');        

        var fileURL = 'http://localhost:' + process.env.SERVER_PORT + '/uploads/' + fileName;

        response.write(JSON.stringify({
            fileURL: fileURL
        }));
        response.end();     
    });
}



app.listen(process.env.SERVER_PORT, () => console.log('Listening on port '+process.env.SERVER_PORT))

