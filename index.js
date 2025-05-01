// ==========  SETUP  ============ //
const express = require('express');
const app = express();
const cors = require('cors');
const path = require('path');
const {logger} = require('./middleware/logServerEvents');
const errorHandler = require('./middleware/errorHandler');
const credentials = require('./middleware/credentials');
const cookieParser = require('cookie-parser');
const PORT = 8080;
const corsOptions = require('./config/corsOptions');

// Logging Middleware
app.use(logger);

// ========== FIREBASE ============ //

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: "AIzaSyBBbLQDOzd_DSw349PvSQg-fKTXy-ZQv18",
//   authDomain: "gamestore-85953.firebaseapp.com",
//   projectId: "gamestore-85953",
//   storageBucket: "gamestore-85953.appspot.com",
//   messagingSenderId: "167583099235",
//   appId: "1:167583099235:web:35204a36b5fefee4744b56",
//   measurementId: "G-K79L65JG5C"
// };

// ========== FIREBASE END ============ //

/* // Uncomment when you are ready to use firebase
const fireDB = require('./db/connect');
fireDB.initDB();
*/

// app.use("/", require("./routes"));

app.use(credentials);

app.use(cors(corsOptions)); // CORS Cross Origin Resource Sharing

// built-in middleware to handle urlencoded data
// in other words this helps with form data
app.use(express.urlencoded({ extended: false}));
//built-in middleware for JSON
app.use(express.json());
// Middleware for cookies
app.use(cookieParser());
// Serve static files
app.use(express.static(path.join(__dirname, '/public')));


// Routes
app.use('/', require('./routes/root'));
app.use('/register', require('./routes/register'));
app.use('/auth', require('./routes/auth'));
app.use('/refresh', require('./routes/refresh'));
app.use('/logout', require('./routes/logout'));
app.use('/characters', require('./routes/api/characters'));
app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', '404.html'));
});


app.use(errorHandler);


app.listen(PORT, () => {
    console.log(`Now listening on PORT ${PORT}`);
});