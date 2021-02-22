const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const ExpressError = require('./utils/ExpressError')
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');


//Routes
const userRoutes = require('./routes/user')
const campgroundsRoutes = require('./routes/campgrounds');
const reviewsRoutes = require('./routes/reviews');



mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});


const app = express();

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.set('')

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, "public")));


//cookies
const sessionConfig = {
    secret: 'thisisasecret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}

app.use(session(sessionConfig))
app.use(flash());

//Authantication
app.use(passport.initialize());
app.use(passport.session()); //persistance login sessions , use after session
passport.use(new LocalStrategy(User.authenticate())); // Generates function

passport.serializeUser(User.serializeUser()); //how to store it in session
passport.deserializeUser(User.deserializeUser()) // how to not store it in session



app.use((req, res, next) => {
    res.locals.currentUser = req.user //passport initials must lie before
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next()
})




app.get('/', (req, res) => {
    res.render('home')
})


//Routes
app.use('/campgrounds', campgroundsRoutes);
app.use('/campgrounds/:id/reviews', reviewsRoutes);
app.use('/', userRoutes);

app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404));
})


//Middleware for err
app.use((err, req, res, next) => {
    const { status = 500 } = err;
    if (!err.message) err.message = 'SomeThing Went Wrong'
    res.status(status).render('error', { err });
})



app.listen(3000, () => {
    console.log('Serving at port 3000')
})