
const Sentry = require("@sentry/node");
const Tracing = require("@sentry/tracing");
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const shortid = require("shortid");


const dburi = process.env.REACT_APP_MONGO_URI;
const sentrydsn=process.env.REACT_APP_SENTRY_DNS;
const sentry_releasenumber=process.env.REACT_APP_RELEASE_NUMBER;
const sentry_environment = process.env.REACT_APP_ENVIRONMENT;
console.log("sentry URL"+ dburi);

const app = express();
app.use(bodyParser.json());

app.use("/", express.static(__dirname + "/build"));
app.get("/", (req, res) => res.sendFile(__dirname + "/build/index.html"));

// //Sentry

// const sentry_releasenumber =1.0;
// const sentry_environment = "DEV"
// //End


// //Initialize Sentry with  dsn

// // Sentry.init({
// //   dsn: "",
// //   integrations: [new Integrations.BrowserTracing()],

// //   // Set tracesSampleRate to 1.0 to capture 100%
// //   // of transactions for performance monitoring.
// //   // We recommend adjusting this value in production
// //   tracesSampleRate: 1.0,
// // });


Sentry.init({
  dsn: sentrydsn,
  release: sentry_releasenumber,
  environment:sentry_environment ,
  tracesSampleRate: 1.0,
  // beforeSend(event) {
  //   // Check if it is an exception, if so, show the report dialog
  //   if (event.exception) {
  //     Sentry.showReportDialog();
  //   }
  //   return event;
  // }
});
 const transactionId = 1000
 Sentry.configureScope(scope => {
   scope.setTag("transaction_id", transactionId);
 });


mongoose.connect(
  process.env.MONGODB_URL || dburi,
  {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
  }
);

const Product = mongoose.model(
  "products",
  new mongoose.Schema({
    _id: { type: String, default: shortid.generate },
    title: String,
    description: String,
    image: String,
    price: Number,
    availableSizes: [String],
  })
);

app.get("/api/products", async (req, res) => {
  const products = await Product.find({});
  res.send(products);
});

app.post("/api/products", async (req, res) => {
  const newProduct = new Product(req.body);
  const savedProduct = await newProduct.save();
  res.send(savedProduct);
});

app.delete("/api/products/:id", async (req, res) => {
  const deletedProduct = await Product.findByIdAndDelete(req.params.id);
  res.send(deletedProduct);
});

const Order = mongoose.model(
  "order",
  new mongoose.Schema(
    {
      _id: {
        type: String,
        default: shortid.generate,
      },
      email: String,
      name: String,
      address: String,
      total: Number,
      cartItems: [
        {
          _id: String,
          title: String,
          price: Number,
          count: Number,
        },
      ],
    },
    {
      timestamps: true,
    }
  )
);

app.post("/api/orders", async (req, res) => {
  if (
    !req.body.name ||
    !req.body.email ||
    !req.body.address ||
    !req.body.total ||
    !req.body.cartItems
  ) {
    return res.send({ message: "Data is required." });
  }
  const order = await Order(req.body).save();

  Sentry.withScope(function(scope) {
    scope.setLevel("info");
    scope.setExtra("Order details", req.body);
    Sentry.captureMessage("NEW ORDER \n Name " + req.body.name + " Total" + req.body.total  + " Email" + req.body.email);
    // Sentry.captureException(new Error("NEW ORDER"), {
    //   tags: {
    //     section: "articles",
    //   },
    // });
  });

  res.send(order);
});
app.get("/api/orders", async (req, res) => {
  const orders = await Order.find({});
  res.send(orders);
});
app.delete("/api/orders/:id", async (req, res) => {
  const order = await Order.findByIdAndDelete(req.params.id);
  res.send(order);
});

const port = process.env.PORT || 5000;
app.listen(port, () => console.log("serve at http://localhost:5000"));
