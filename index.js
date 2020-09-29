const express = require('express')

const cors = require('cors')
const bodyParser  = require('body-parser')

const port = 4000
const pass = 'shuvo@1234';


const app = express();
app.use(cors());
app.use(bodyParser.json());


const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://burjAlArab:shuvo@1234@cluster0.vktpy.mongodb.net/burjAlArabdb?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const bookingCollection = client.db("burjAlArabdb").collection("bookings");
  console.log('db connection successfully');
 
    app.post('/addBooking',(req,res)=>{
        const newBooking = req.body;
        bookingCollection.insertOne(newBooking)
        .then(result => {
          res.send(result.insertedCount > 0)
        })

    })

    app.get('/bookings', (req, res) =>{
        bookingCollection.find({email: req.query.email})
        .toArray((err,documents)=>{
            res.send(documents)
        })
    })

});




app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port)