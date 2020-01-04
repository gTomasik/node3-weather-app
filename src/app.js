const express = require('express')
const path = require('path')
const hbs = require('hbs')

const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')

const app = express()

const port = process.env.PORT || 3000

const publicDir = path.join(__dirname, '../public' )

const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

app.use(express.static(publicDir))

app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather App',
        name: 'Grzegorz Tomasik'
    })
})

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About',
        name: 'Grzegorz Tomasik'
    })
})

app.get('/help', (req, res) => {
    res.render('help', {
        helpText: 'HELP me',
        title: 'Help',
        name: 'Grzegorz Tomasik'

    })
})

app.get('/weather', (req, res) => {
    if (!req.query.address) {
        return res.send({
            error: 'No search conditions'
        })
    }
    geocode(req.query.address, (error, { latitude, longitude, location} = {}) => {
        if ( error ) {
            return res.send({ error })
        }

        forecast(latitude, longitude, (error, forecastData) => {
            if(error) {
                return res.send({ error })
            }
            res.send({
                forecast: forecastData,
                location,
                address: req.query.address
            })
        })
    })
    //res.send({
    //    forecast: 'Snowing',
    //    location: 'Philadelphia',
    //    address: req.query.address
    //})
})


app.get('/help/*', (req, res) => {
    res.render('404',{
        title: '404',
        name: 'Grzegorz Tomasik',
        errorMessage: 'Help article not found'
    })
})

app.get('*', (req, res) => {
    res.render('404', {
        title: '404',
        name: 'Grzegorz Tomasik',
        errorMessage: 'Page not found'
    })
})
app.listen(port, () => {
    console.log(`Server is up on port ${port}`)
})
