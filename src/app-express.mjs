import express from 'express'
import { join } from 'node:path'
import cookieParser from 'cookie-parser'

const server = express()

app.use(express.static(join(process.cwd(), 'src', 'public')))

app.set('view-engine', 'ejs')
app.set('views', './src/public/views')

function requestCallback(request, response){
    response.status(200).send(`request received`)
}

server.get('/', requestCallback)

app.get('/simple-text', (request, response) => {
    console.log(`this is some text`)
    response.status(200).set({ 'Content-Type': 'text/plain' }).send(`this is some text`)
})

app.get('/html-version', (request, response) => {
    response.status(200).set({ 'Content-Type': 'text/html' })
    .send(`<h1>HTML Text</h1><p>this is some text in the browser</p>`)
})

app.get('/concerts', (request, response) => {
    // const filePath = `${process.cwd()}/src/public/concerts.html`
    const filePath = join(process.cwd(), 'src', 'public', 'concerts.html')
    response.status(200).sendFile(filePath)
})

// demo data + route
app.get("/concerts", (_req, res) => {
    res.render("concerts", {
        cartCount: 0,
        members: [
            { name: "Emily Armstrong", role: "Lead vocals" },
            { name: "Mike Shinoda", role: "Vocals/Guitar/Keys" },
            { name: "Brad Delson", role: "Lead guitar" },
            { name: 'Dave "Phoenix" Farrell', role: "Bass" },
            { name: "Colin Brittain", role: "Drums" },
            { name: "Joe Hahn", role: "Turntables/Samples" }
        ],
        shows: [
            { city: "Los Angeles", venue: "Dodger Stadium", date: "09-13-2025", price: 115 },
            { city: "San Jose", venue: "SAP Center", date: "09-15-2025", price: 100 },
            { city: "Sacramento", venue: "Golden 1 Center", date: "09-17-2025", price: 85 }
        ]
    })
})

app.get("/", (_req, res) => res.redirect("/concerts"));

server.listen(3000)

    request.on('end', () => {
        const parsedBody = JSON.parse(body)

        let concert_id = parsedBody.concert_id
        let concert_artist = parsedBody.concert_artist
        let concert_price = parsedBody.concert_price
        let concert_currency = parsedBody.concert_currency

        let cart
        if(request.cookies.cart === undefined) {
            cart = []
        } else {
            cart = JSON.parse(request.cookies.cart)
        }
        cart.push({ concert_id, concert_artist, concert_price, concert_currency })

        response.cookie('cart', JSON.stringify(cart))
        response.status(200).send()
    })