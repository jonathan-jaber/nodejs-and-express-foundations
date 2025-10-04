// import express from 'express'
// import { join } from 'node:path'
// import cookieParser from 'cookie-parser'

// const app = express()

// // Middleware
// app.use(express.static(join(process.cwd(), 'src', 'public')))
// app.use(express.urlencoded({ extended: true }))
// app.use(express.json())
// app.use(cookieParser())

// // Views (EJS)
// app.set('view-engine', 'ejs')
// app.set('views', './src/public/views')

// function requestCallback(request, response){
//     response.status(200).send(`request received`)
// }

// app.get('/', requestCallback)

// // demo data used by /concerts
// const members = [
//     { name: "Emily Armstrong", role: "Lead vocals" },
//     { name: "Mike Shinoda", role: "Vocals/Guitar/Keys" },
//     { name: "Brad Delson", role: "Lead guitar" },
//     { name: 'Dave "Phoenix" Farrell', role: "Bass" },
//     { name: "Colin Brittain", role: "Drums" },
//     { name: "Joe Hahn", role: "Turntables/Samples" }
// ]

// const shows = [
//     { city: "Los Angeles", venue: "Dodger Stadium", date: "09-13-2025", price: 115 },
//     { city: "San Jose", venue: "SAP Center", date: "09-15-2025", price: 100 },
//     { city: "Sacramento", venue: "Golden 1 Center", date: "09-17-2025", price: 85 }
// ]

// // Routes
// app.get("/", (_req, res) => res.redirect("/concerts"))

// const PORT = process.env.PORT ?? 3000
// app.listen(PORT, () => console.log(`http://localhost:${PORT}`))

// app.listen(3000)

//     request.on('end', () => {
//         const parsedBody = JSON.parse(body)

//         let concert_id = parsedBody.concert_id
//         let concert_artist = parsedBody.concert_artist
//         let concert_price = parsedBody.concert_price
//         let concert_currency = parsedBody.concert_currency

//         let cart
//         if(request.cookies.cart === undefined) {
//             cart = []
//         } else {
//             cart = JSON.parse(request.cookies.cart)
//         }
//         cart.push({ concert_id, concert_artist, concert_price, concert_currency })

//         response.cookie('cart', JSON.stringify(cart))
//         response.status(200).send()
//     })

// src/app-express.mjs
import express from "express";
import { join } from "node:path";
import cookieParser from "cookie-parser";

const app = express();

// --- middleware
app.use(express.static(join(process.cwd(), "src", "public")));
app.use(express.urlencoded({ extended: true })); // parse form posts
app.use(express.json());                          // parse JSON posts
app.use(cookieParser());

// --- views (EJS)
app.set("view engine", "ejs");
app.set("views", join(process.cwd(), "src", "views"));

// demo data used by /concerts
const members = [
    { name: "Emily Armstrong", role: "Lead Vocals" },
    { name: "Mike Shinoda", role: "Vocals/Guitar/Keys" },
    { name: "Brad Delson", role: "Lead Guitar" },
    { name: "Dave 'Phoenix' Farrell", role: "Bass" },
    { name: "Colin Brittain", role: "Drums" },
    { name: "Joe Hahn", role: "Turntables/Samples" }
];

const shows = [
    { city: "Phoenix, AZ", venue: "Footprint Center", date: "09-06-2025", price: 95 },
    { city: "Los Angeles, CA", venue: "Intuit Dome", date: "09-13-2025", price: 115 },
    { city: "San Jose, CA",   venue: "SAP Center",      date: "09-15-2025", price: 110 },
    { city: "Sacramento, CA", venue: "Golden 1 Center", date: "09-17-2025", price: 85 },
    { city: "Portland, OR", venue: "Moda Center", date: "09-19-2025", price: 90 },
    { city: "Vancouver, BC", venue: "Rogers Arena", date: "09-21-2025", price: 105 },
    { city: "Seattle, WA", venue: "Climate Pledge Arena", date: "09-24-2025", price: 100 }
];

// --- routes
app.get("/", (_req, res) => res.redirect("/concerts"));

app.get("/simple-text", (_req, res) => {
  res.status(200).type("text/plain").send("this is some text");
});

app.get("/html-version", (_req, res) => {
  res.status(200).type("text/html").send("<h1>HTML Text</h1><p>this is some text in the browser</p>");
});

// render concerts.ejs
app.get("/concerts", (req, res) => {
  const cartCount = (() => {
    try {
      const c = req.cookies?.cart ? JSON.parse(req.cookies.cart) : [];
      return Array.isArray(c) ? c.length : 0;
    } catch { return 0; }
  })();

  res.render("concerts", { cartCount, members, shows });
});

// accept add-to-cart posts
app.post("/cart", (req, res) => {
  const { concert_id, concert_artist, concert_price, concert_currency } = req.body;

  let cart = [];
  try {
    cart = req.cookies?.cart ? JSON.parse(req.cookies.cart) : [];
  } catch { cart = []; }

  cart.push({ concert_id, concert_artist, concert_price, concert_currency });

  res.cookie("cart", JSON.stringify(cart), { httpOnly: true });
  res.status(200).json({ ok: true, count: cart.length });
});

// start
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`http://localhost:${PORT}`));