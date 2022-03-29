import fetch from 'node-fetch';
import express from 'express';
import path from 'path';
import {fileURLToPath} from 'url';
import bodyParser from 'body-parser';
import file from 'fs';

const app = express()
const port = 3000
const basedir = "./assets/html/"


//Because im treating this file as module and using imports these need to be defined seperatly.
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);



//Item id : Item name
var itemData = {}

file.readFile('./typeid.txt', 'utf8' , (err, fileData) => {
    if (err) {
        console.error(err)
        return
    } else {
        
        //We cant get item id's from the api so im using this file i found and parsing it here so we can use it. Data is in bit ugly format so bit of parsing to do.
        //Split file lines to list by each newline character.
        var temp_items = fileData.split(/\r?\n/)
        console.log("Storing "+temp_items.length+" items to memory...")
        for (const data of temp_items) {

            //Remove extra whitespaces.
            let item = data.replace(/\s+/g,' ').trim()

            //id is the first number ended by first space. Everything after that is the item name.
            let id = item.substring(0, item.indexOf(' '));
            let value = item.substring(item.indexOf(' ') + 1);

            //Add the id,value pair to object so we can fetch it later.
            itemData[id] = value
        }
        console.log("Done!")
    }
})



app.use('/static', express.static('assets'))
app.use(bodyParser.urlencoded({ extended: true }));

app.get(['/','/index','/home'], (req, res) => {
    res.redirect('/marketplace');
    //res.sendFile(path.join(__dirname, basedir+'index.html'));
})

app.get('/marketplace', (req, res) => {

    let data = {}
    fetch("https://esi.evetech.net/latest/markets/prices")
        .then(response => response.json())
        .then(rcvData => {
            
            for (let i = 0; i < rcvData.length; i++) {
                const element = rcvData[i];
                if (itemData.hasOwnProperty(i)) {
                    element['type_name'] = itemData[i]
                } else {
                    element['type_name'] = null
                }
                
            }
            let temp_data = {json:rcvData}
            res.render('../templates/marketplace.pug', temp_data);
        });
})


app.get('/marketplaceajax', (req, res) => {
    res.sendFile(path.join(__dirname, basedir+'marketplaceajax.html'));
})

app.get('/user', (req, res) => {
    res.sendFile(path.join(__dirname, basedir+'user.html'));
})

//Serve json file this way so we can more easily control it in the future.
app.get('/api/types', (req, res) => {
   res.send(itemData)
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})