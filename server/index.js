// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Configuration Start
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Configuration End
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Middleware Start
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: [
    'http://localhost:5173',
    "https://magenta-peony-5d02de.netlify.app",
    // server-side
  ],
  credentials: true,
  optionsSuccessStatus: 200,
}));

// ===================================
// CookieParser Options
// ===================================
const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
};


// ===================================
// jwt validation middleware
// ===================================
const verifyToken = async (req, res, next) => {


  const initialToken = await req.headers.authorization

  // ===================================
  // for local storage only
  // ===================================
  if (!initialToken) {
    return res.status(401).send({ message: 'Unauthorized access!!' });
  }

  // ===================================
  // validate local storage token
  // ===================================
  const token = await initialToken.split(' ')[1];

  // const token = req?.cookies?.token;
  // console.log('token :::>', token)

  if (!token) {
    return res.status(401).send({ message: 'Unauthorized access...' });
  }

  if (token) {
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
      if (err) {
        console.log('err token :::>', err)
        return res.status(401).send({ message: 'Unauthorized access' });
      }
      // console.log(decoded)
      req.decoded = decoded
      next()
    })
  }
}


// ===================================
//creating Token
// ===================================
app.post("/jwt", async (req, res) => {
  const user = req.body;
  const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '10h' });

  res
    // .cookie("token", token, cookieOptions)
    // .send({ success: true });
    .send({ token });
});

//clearing Token
app.get("/logout", async (req, res) => {
  const user = req.body;
  console.log("logging out", user);
  res
    // .clearCookie("token", { ...cookieOptions, maxAge: 0 })
    .send({ success: true });
});
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Middleware End
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// MongoDB connection Start
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.zuxua.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});


// ===================================
// Check if the server is up and running
// ===================================
app.get("/", (req, res) => {
  res.send("Best Deal Is A Running");
});

app.listen(port, () => {
  console.log(`Best Deal is listening on port ${port}`);
});
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// MongoDB connection End
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

async function run() {
  try {

    await client.connect();


    // ===================================
    // DB Connection
    // ===================================

    const usersCollection = client.db("BestDeals").collection("UserCollection");


    // ==================================
    // Admin verify 
    // ==================================
    const verifyAdmin = async (req, res, next) => {
      const email = req.decoded.email;
      // console.log('from verify admin -->', email);
      const query = { email: email };
      const user = await usersCollection.findOne(query);
      const isAdmin = user?.role === 'Admin';

      if (!isAdmin) {
        return res.status(403).send({ message: "Unauthorized!!" });
      }

      next();
    }

    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // API Connections Starts
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    // ==================================
    // Users registration
    // ==================================
    app.post('/users', async (req, res) => {
      const newUser = req.body;
      const result = await usersCollection.insertOne(newUser);
      res.send(result);
    })

    // ==================================
    // Users login
    // ==================================
    app.get('/users/:email', async (req, res) => {
      const mail = req.params?.email;
      const results = await usersCollection.find({ email: mail }).toArray();
      res.send(results);
    });

    // ==================================
    // Users profile data
    // ==================================
    app.get('/profile/:email', async (req, res) => {
      const mail = req.params?.email;
      const results = await usersCollection.find({ email: mail }).toArray();
      res.send(results);
    });

    // ==================================
    // Patch Users' last login
    // ==================================
    app.patch('/lastLogin/:email', async (req, res) => {
      try {
        const mail = req.params?.email;
        const updateBody = req.body;
        const query = { email: mail };
        const updateDoc = {
          $set: {
            lastLogin: updateBody.lastLogin
          },
        }
        const results = await usersCollection.updateOne(query, updateDoc);
        res.send(results);
      }
      catch {
        // If an error occurs during execution, catch it here
        console.error('Error updating user status:', err);
        // Send an error response to the client
        res.status(500).json({ message: 'Internal server error from last login' });
      }
    });


    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // API Connections End
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    app.use("/user", async (req, res) => { });

    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);
