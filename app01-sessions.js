//require hakee moduulin
const express = require('express');

//kysytään portti ympäristömuuttujalta
const PORT = process.env.PORT || 8080;

const body_parser = require('body-parser');

//express session pitää asentaa --> npm install express-session
const session =  require('express-session');

//funktio jolla luodaan serveriobjekti
let app = express();

//jos tätä ei laita niin post viestiin ei tule bodyä
app.use(body_parser.urlencoded({
    extended: true
}));

//express sessio moduulin konfiguraatio
app.use(session({
    secret: '1234qwerty',
    resave: true,
    saveUninitialized: true,
    cookie: {
        maxAge: 1000000
    }
}));



let users = [];


app.use((req, res, next) => {
    console.log(`path: ${req.path}`);
    next(); //jatka seuraavaankin kuuntelijaan
});

//apukäsittelijä
const is_logged_handler = (req, rest, next)=>{
    if (!req.session.user){
        return res.redirect('/login');
    }
    next();
};


app.get('/',is_logged_handler, (req, res, next)=>{
    const user = req.session.user;
    res.write(`
    <html>
    <body>
        Logged in as user: ${user}
        <form action="/logout" method="POST">
        <button type="submit">Log out</button>
        </form>
    </body>
    </html>
    `);
    res.end();
});

app.post('/logout', (req, res, next) =>{
    req.session.destroy();
    res.redirect('/login');
});

app.get('/login', (req, res, next) =>{
    console.log('user:', req.session.user)
    res.write(`
    <html>
    <body>
        <form action="/login" method="POST">
            <input type="text" name="user_name">
            <button type="submit">Log in</button>
        </form>
        <form action="/register" method="POST">
            <input type="text" name="user_name">
            <button type="submit">Register</button>
        </form>
    </body>
    </html>
    `);
    res.end();
});

app.post('/login', (req, res, next) => {
    console.log(req.body);
    const user_name=req.body.user_name;
    let user = users.find((name) => {
        return user_name == name;
    });
    if(user){
        console.log('User: ', user, 'logged in');
        req.session.user = user;
        return res.redirect('/');
    }
    console.log('Username not found ', user);
    res.redirect('/login');

});

app.post('/register', (req, res, next) => {
    //console.log(req.body);
    const user_name=req.body.user_name;
    let user = users.find((name) => {
        return user_name == name;
    });
    if(user){
        return res.send('User already registered');
    }
    users.push(user_name);
    console.log('usres:', users);
    res.redirect('/login');
});


app.use((req, res, next) => {
    res.status(404);
    res.send(`
    page not found
    `);
});

//app.post()

app.listen(PORT);