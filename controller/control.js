const ShortUniqueId = require('short-unique-id');
const url = require("../models/schema")

async function generateShortUrl (req,res) {
    const data = req.body
   // console.log(req.body);
    
    if(!data.url){
        return res.render("index", { shortend: { type: "danger", message: "URL is required!" }});
    }
    const uid = new ShortUniqueId().rnd();
 
    await url.create({
        shortUrl : uid,
        redirectUrl : data.url,
        visitRecord : [],
    })
    // res.render("index", { 
    //     shortend: { type: "success", message: "URL Shortened"},
    //     shortUrl: `http://localhost:8000/${uid}`
    // });
    res.render("index", {
        shortend: { type: "success", message: "URL Shortened" },
        shortUrl: `http://localhost:8000/${uid}`,
        uid: uid 
      });
    
}

async function getAnalytics (req,res) {
    const shortUrl = req.body.shortUrl
    console.log(shortUrl);
    
    const result = await url.findOne({shortUrl})
    console.log(result.visitRecord.length)
    return res.json(
        {totalClicks : result.visitRecord.length, 
})


}


module.exports = {generateShortUrl, getAnalytics}