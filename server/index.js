require('dotenv').config();
// * require dependencies
const express = require('express');
const massive = require('massive');
const session = require('express-session');

// * import variables
const app = express();
const {SESSION_SECRET, SERVER_PORT, CONNECTION_STRING} = process.env
const auth = require('./controllers/userController');
const post = require('./controllers/postController');

// * top level middleware
app.use(express.json())
app.use(session({
    resave: false,
    saveUninitialized: true,
    secret: SESSION_SECRET,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24
    }
}))

// * invoke massive to connect to db
massive({
    connectionString: CONNECTION_STRING,
    ssl: {
        rejectUnauthorized: false
    }
}).then( db => {
    app.set('db', db)
    console.log('Hey! Connected to db!')
})

// * Endpoints
// auth
app.post(`/auth/register`, auth.emailMiddleware, auth.register);
app.post(`/auth/login`, auth.login);
app.post(`/auth/logout`, auth.logout);
app.get(`/auth/user`, auth.getUserSession);
// posts
app.get('/api/posts', post.getPosts);
app.post('/api/posts', post.addPost);

// * nodemon listens for changes
app.listen(SERVER_PORT, () => console.log(`Get out of my swamp! ${SERVER_PORT}`))
