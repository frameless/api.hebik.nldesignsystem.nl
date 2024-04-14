import express from 'express';
import fs from 'fs';

let data = fs.readFileSync('../api/crawlData')
let parsedData = JSON.parse(data);

const app = express();

app.listen(process.env.PORT || 3000, () => listen);

function listen() {
    const host = server.address().address;
    const port = server.address().port;
    console.log('Example app listening at http://' + host + ':' + port);
}

app.use(express.static('public'));

let users;
if (fs.existsSync('../api/crawlData')) {
    console.log('Loading crawldata');
    let txt = fs.readFileSync('crawlData.json', 'utf8');
    users = JSON.parse(txt);
} else {
    console.log('No crawldata found');
    users = {};
}

app.get('/all', showAll);
app.get('/add/:userid/:crawledobject', addEntry);

function addEntry(req, res) {
    let userid = req.params.userid;

    let crawledObject = req.params.crawledObject;

    users[userid] = crawledObject;

    let reply = {
        status: 'success',
        userid: userid,
        crawledObject: crawledObject
    }
    console.log('Adding: ' + JSON.stringify(reply));

    let json = JSON.stringify(users, null, 2);
    fs.writeFile('../api/crawlData', json, 'utf8', finished);
    function finished(err) {
        console.log('Finished writing crawlData.json');
        res.send(reply);
    }
}

function showAll(req, res) {
    res.send(data);
}