const express = require("express")
const url = require("./models/schema")
const router = require("./routes/route")
const connectDB = require("./database/connect")
const bodyParser = require("body-parser");


connectDB()
const app = express() 

app.set('view engine', 'ejs')

app.use(express.json()); 

app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'))



app.use('/',router)


// app.get("/:shortUrl", async (req, res) => {
//     try {
//       const shortUrl = req.params.shortUrl
//       const entry = await url.findOneAndUpdate({ shortUrl }, {
//         $push: {
//           visitRecord: {
//             timestamp: Date.now()
//           }
//         }
//       }, )
//       console.log(entry )
//       if (!entry) {
//         res.status(404).send("URL not found")
//       } else {
//           res.redirect(entry.redirectUrl)
//       }
//     } catch (err) {
//       console.error(err)
//       res.status(500).send("Internal Server Error")
//     }
//   })

const PORT = 8000 ;

app.listen(PORT , (req,res)=>{
    console.log(`Server Started at http://localhost:${PORT}` )
})