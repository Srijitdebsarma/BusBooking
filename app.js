const express = require('express');
const app = express();
const bodyParser = require('body-parser'); //for post req
const path = require('path');
const axios = require('axios');

const ejsMate = require('ejs-mate');

// Middleware
app.use(bodyParser.urlencoded({ extended: true })); //for post req
app.use(bodyParser.json());

//set up view engine
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.engine("ejs",ejsMate);  //for using ejsMates = npm install ejs-mate


app.listen(8080, ()=>{   //running our app on 8080
    console.log("App is listening to port 8080");
});


app.get("/bookaBus", async (req, res) => {  
    try {
        // Sending GET request to the CRUD endpoint
        const response = await axios.get('https://crudcrud.com/api/c1c4ad62b98d4607a5786cb520dc4e85/bookings');

        // Extracting data from the response
        const allBookings = response.data;
        //console.log(allBookings);
        res.render("index.ejs", { allBookings }); 
    } catch (error) {
        console.error('Error fetching bookings:', error);
        res.status(500).send('Error fetching bookings');
    }
});

app.post("/bookaBus", async (req, res) => {
    try {
        // Extract booking data from request body
        const { name, email, phone, bus } = req.body;

        // Create JSON payload for the new booking
        const payload = {
            name: name,
            email: email,
            phone: phone,
            bus: bus
        };

        // Send POST request to CRUD API endpoint for bookings
        const response = await axios.post('https://crudcrud.com/api/c1c4ad62b98d4607a5786cb520dc4e85/bookings', payload);

        // Handle response as needed
         console.log('New booking created');

        // Redirect or render a response
        res.redirect("/bookaBus"); 
    } catch (error) {
        console.error('Error creating new booking:', error);
        res.status(500).send('Internal Server Error');
    }
});



app.get("/update/:id", async (req, res) => {
        const {id} = req.params;
        const response = await axios.get(`https://crudcrud.com/api/c1c4ad62b98d4607a5786cb520dc4e85/bookings/${id}`);
        let data=response.data;
        res.render("update.ejs",{data});
});
app.post("/update/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const { name, email, phone, bus } = req.body;

        // Create JSON payload with updated data
        const payload = {
            name: name,
            email: email,
            phone: phone,
            bus: bus
        };

        // Send a PUT request to update the booking
        await axios.put(`https://crudcrud.com/api/c1c4ad62b98d4607a5786cb520dc4e85/bookings/${id}`, payload);

        // Redirect to a confirmation page or wherever needed
        res.redirect("/bookaBus");
    } catch (error) {
        console.error('Error updating booking:', error);
        res.status(500).send('Error updating booking');
    }
});


app.post("/delete/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const response = await axios.delete(`https://crudcrud.com/api/c1c4ad62b98d4607a5786cb520dc4e85/bookings/${id}`);

        console.log('Booking deleted:', response.data);

        res.redirect("/bookaBus");
    } catch (error) {
        console.error('Error deleting booking:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.get("/bookaBus/byBus", async (req, res) => {  
    try {
        // Extract the selected bus from query parameters
        const selectedBus = req.query.bus;

        // Sending GET request to the CRUD endpoint
        const response = await axios.get('https://crudcrud.com/api/c1c4ad62b98d4607a5786cb520dc4e85/bookings');

        // Extracting data from the response
        const allBookings = response.data;

        // Filter bookings based on the selected bus
        const filteredBookings = allBookings.filter(booking => booking.bus === selectedBus);

        res.render("index.ejs", { allBookings: filteredBookings }); 
    } catch (error) {
        console.error('Error fetching bookings:', error);
        res.status(500).send('Error fetching bookings');
    }
});


