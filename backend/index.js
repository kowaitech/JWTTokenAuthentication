// const express = require('express');
// const jwt=require('jsonwebtoken');
// const  bcrypt=require('bcryptjs');
// const cors=require('cors');

// const app=express();
// const port=6100;

// app.use(express.json());
// app.use(cors());


// const usersofdata = []; 

// const secretKey = 'yu';

// app.get('/',(res,req)=>{
//   res.send('Hello I am from Server')
// }
// )


// const { MongoClient, ServerApiVersion } = require('mongodb');
// const uri = "mongodb+srv://kowsalyaaitech:123abc@cluster0.ufoxayc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
// const client = new MongoClient(uri, {
//   serverApi: {
//     version: ServerApiVersion.v1,
//     strict: true,
//     deprecationErrors: true,
//   }
// });

// async function run() {
//   try {
//     await client.connect();

//     await client.db("admin").command({ ping: 1 });
//     console.log("Pinged your deployment. You successfully connected to MongoDB!");
//   } finally {
//     await client.close();
//   }
// }
// run().catch(console.dir);

// app.post('/register',async(req,res)=>{
//     const {username,password}=req.body;
//     const hashedPassword= await bcrypt.hash(password,10);
//     usersofdata.push({username,password:hashedPassword});
//     res.sendStatus(201);
//     console.log("User registered Successfully")
// })

// app.post('/login',async(req,res)=>{
//     const {username,password}=req.body;
//     const user=usersofdata.find((us)=>us.username===username)
//     if(user){
//        const isValiduser=await bcrypt.compare(password,user.password,);
//        if(isValiduser){
//             const token=await jwt.sign({username},secretKey,{expiresIn:'1hr'})
//             res.json({ token });
//             console.log("login Successfully");
//        }else{
//             res.status(401).json({message:'Invalid Credential,since Password Does not match'})
//        }

//     }else{
//       res.status(401).json({message:'Invalid Credential,since User Not Found,SignUp to Login plz'})
//     }
// })

// app.listen(port,()=>{
//   console.log("Running on Port",port)
// })

const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const { OAuth2Client } = require("google-auth-library");

const { MongoClient, ServerApiVersion } = require('mongodb');

const Oauthclient = new OAuth2Client("276916434451-gs4pi3694fvrm1jere57s41k72f12ti0.apps.googleusercontent.com");

const app = express();
const port = 6100;

app.use(express.json());
app.use(cors());

const secretKey = 'your-secret-key';

// MongoDB connection
const uri = "mongodb+srv://kowsalyaaitech:test@cluster0.ltjw8ex.mongodb.net/?appName=Cluster0";
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

let usersCollection;

async function connectDB() {
  try {
    await client.connect();
    const usersCollection = client.db("demo").collection("users");

    app.post('/register', async (req, res) => {
      try {
        const { username, password } = req.body;

        const existingUser = await usersCollection.findOne({ username });
        if (existingUser) {
          return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await usersCollection.insertOne({ username, password: hashedPassword });

        res.status(201).json({ message: "User registered successfully" });
        console.log("User registered:", username);
      } catch (error) {
        res.status(500).json({ message: "Error registering user", error });
      }
    });

    app.post('/login', async (req, res) => {
        try {
          const { username, password } = req.body;

          const user = await usersCollection.findOne({ username });
          if (!user) {
            return res.status(401).json({ message: "User not found. Please register." });
          }

          const isValidPassword = await bcrypt.compare(password, user.password);
          if (!isValidPassword) {
            return res.status(401).json({ message: "Invalid password" });
          }

          const token = jwt.sign({ username }, secretKey, { expiresIn: '1h' });
          res.json({ token });
          console.log("User logged in:", username);
        } catch (error) {
          res.status(500).json({ message: "Error logging in", error });
        }
    });

    app.post('/verifyToken', (req, res) => {
        const token = req.headers.authorization?.split(' ')[1]; 
        if (!token) {
          return res.status(401).json({ valid: false, message: 'No token provided' });
        }

        jwt.verify(token, secretKey, (err, decoded) => {
          if (err) {
            return res.status(401).json({ valid: false, message: 'Invalid or expired token' });
          }
          res.json({ valid: true, username: decoded.username });
        });
});

app.post("/google-login", async (req, res) => {
  try {
    const { token } = req.body;
    const ticket = await Oauthclient.verifyIdToken({
      idToken: token,
      audience: "276916434451-gs4pi3694fvrm1jere57s41k72f12ti0.apps.googleusercontent.com",
    });

    const payload = ticket.getPayload();
    const username = payload?.email; // use email as username
    const name = payload?.name;
    const picture = payload?.picture;

    // Check if user exists
    let user = await usersCollection.findOne({ username });

    if (!user) {
      // If user doesn't exist, create a new one
      const newUser = { username, password: null, name, picture, fromGoogle: true };
      await usersCollection.insertOne(newUser);
      console.log("New Google user created:", username);
    }

    // Create your own JWT (so your app uses one token type)
    const myToken = jwt.sign({ username:name }, secretKey, { expiresIn: "1h" });

    res.json({ token: myToken });
  } catch (err) {
    console.error("Google Login Error:", err);
    res.status(400).json({ message: "Invalid Google token" });
  }
});

    console.log("Connected to MongoDB and 'users' collection ready.");
  } catch (err) {
    console.error("MongoDB connection failed:", err);
  }
}
connectDB();



app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

