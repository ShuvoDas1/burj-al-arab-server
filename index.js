const express = require('express')
const cors = require('cors');
const bodyParser = require('body-parser');
const admin = require('firebase-admin');
const MongoClient = require('mongodb').MongoClient;
 require('dotenv').config()
const serviceAccount = require("./configs/burj-al-arab-80bf1-firebase-adminsdk-md19h-4e11064f22.json");


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vktpy.mongodb.net/burjAlArabdb?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
const port = 4000



const app = express();
app.use(cors());
app.use(bodyParser.json());

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.FIRE_DB
});

client.connect(err => {
  const bookingCollection = client.db("burjAlArabdb").collection("bookings");

  app.post('/addBooking', (req, res) => {
    const newBooking = req.body;
    bookingCollection.insertOne(newBooking)
      .then(result => {
        res.send(result.insertedCount > 0)
      })

  })

  app.get('/bookings', (req, res) => {
    const bearar = req.headers.authorization;
    if (bearar && bearar.startsWith('Bearar ')) {
      const idToken = bearar.split(' ')[1];
      console.log({ idToken });
      // idToken comes from the client app
      admin.auth().verifyIdToken(idToken)
        .then(function (decodedToken) {
          const TokenEmail = decodedToken.email;
          const queryEmail = req.query.email;
          if (TokenEmail == queryEmail) {
            bookingCollection.find({ email: queryEmail })
              .toArray((err, documents) => {
                res.send(documents)
              })
          }
        })
        .catch(function (error) {
          res.status(401).send('un-authorized assess');
        });
    }
    else{
      res.status(401).send('un-authorized assess');
    }
  })

});

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port)