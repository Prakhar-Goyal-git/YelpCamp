const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelper');
const Campground = require('../models/campground');

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sample = (array) => array[Math.floor(Math.random() * array.length)];


const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            author: '6033fcdf56585166d539d757',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            images: [
                {
                    url: 'https://res.cloudinary.com/ddngixi5q/image/upload/v1614183840/YelpCamp/x10ajsbsfvlqzfd047le.jpg',
                    filename: 'YelpCamp/x10ajsbsfvlqzfd047le'
                },
                {
                    url: 'https://res.cloudinary.com/ddngixi5q/image/upload/v1614183840/YelpCamp/itpqruuakw9isw6hx0hm.jpg',
                    filename: 'YelpCamp/itpqruuakw9isw6hx0hm'
                }
            ],
            price,
            description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit.Aliquid dolores delectus voluptatum quibusdam modi aliquam quos eos quae earum minus neque nisi numquam, doloribus excepturi ipsum est accusantium sequi a.'
        })
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})