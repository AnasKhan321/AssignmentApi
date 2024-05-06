require('dotenv').config();
const express = require('express')
const app = express()
const port = process.env.PORT || 3000;
const cors = require('cors');
const ConnectToMongo = require('./db.js')
app.use(cors());
app.use(express.json());
ConnectToMongo(); 

app.use('/api/auth' , require('./Routes/Auth.js')); 
app.use('/api/gym' , require('./Routes/Gym.js')); 

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})