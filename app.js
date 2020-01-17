//require hakee moduulin
const express = require('express');

//kysytään portti ympäristömuuttujalta
const PORT = process.env.PORT || 8080;

//funktio jolla luodaan serveriobjekti
let app = express();

app.use((req, res, next) => {
    console.log(`path: ${req.path}`);
    next(); //jatka seuraavaankin kuuntelijaan
});

app.use('/TEST', (req, res, next) => {
    console.log('USE/TEST');
    next();
});

app.get('/', (req, res, next)=>{ 
    res.send('Hello world 3');
    res.end();
});

app.use((req, res, next) => {
    res.status(404);
    res.send(`
    page not found
    `);
});

//app.post()

app.listen(PORT);