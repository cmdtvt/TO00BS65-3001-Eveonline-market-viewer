const express = require('express')
const path = require('path');
const bodyParser = require("body-parser");
const app = express()
const port = 3000
const file = require('fs');
const basedir = "./html/"

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

            //ud is the first number ended by first space. Everything after that is the item name.
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

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, basedir+'index.html'));
})


/*
app.get('/query', (req, res) => {
    res.sendFile(path.join(__dirname, basedir+'index.html'));
})

app.post('/ajaxmessage', (req, res) => {
    data = req.body
    if(data.name === " " && data.country === " " && data.message === " ") {
        res.send({
            success: false,
            reason: "unknown reason"
        })

    } else {

        file.readFile('./data.json', 'utf8' , (err, fileData) => {
            if (err) {
                console.error(err)
                res.send({
                    success: false,
                    reason: "Failed to read the file."
                })
                return
            } else {
                console.log("Readubg data!")

                //Convert loaded string into a json object
                const jsonf = JSON.parse(fileData);

                //Get date and remove extra things from it.
                var today = new Date();
                var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();

                //Add new data into the array
                jsonf.push({
                    id:jsonf.length,
                    username:data.name,
                    country:data.country,
                    message:data.message,
                    date:date
                })
                
                //Convert json object back into a string and save it.
                file.writeFile("./data.json", JSON.stringify(jsonf), function(err) {
                    console.log("Saving!")
                    if(err) {
                        res.send({
                            success: false,
                            reason: "Failed to save the file."
                        })
                        return console.log(err);
                    } else {
                        res.send({
                            success: true,
                            reason: "values not set"
                        })
                    }
                }); 
                
            }
        })
    }
});

//Serve json file this way so we can more easily control it in the future.
app.get('/api/json', (req, res) => {
    file.readFile('./data.json', 'utf8' , (err, data) => {
        if (err) {
            console.error(err)
            return
        }
        res.send(data)
    })
})
*/
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})