const express = require("express")
const url = require("../models/schema")
const { generateShortUrl, getAnalytics } = require("../controller/control")
const router = express.Router()

router.get('/', (req, res) => {
  res.render("index", { shortend: null, shortUrl: null, uid: null });
});

 
router.post("/", generateShortUrl)

// Show Analytics Input Page
router.get('/analyse', (req, res) => {
  res.render('analyse', { shortend: null, totalClicks: null, clickTimes: [], error: null });
});

// Handle Analytics Submission
router.post('/analyse', async (req, res) => {
  const fullShortUrl = req.body.shortUrlInput;

  try {
    const parts = fullShortUrl.trim().split('/');
    const uid = parts[parts.length - 1];

    const result = await url.findOne({ shortUrl: uid });

    if (!result) {
      return res.render('analyse', {  shortend: null, totalClicks: null, clickTimes: [], error: 'Short URL not found' });
    }

    const clickTimes = result.visitRecord.map(record => record.timestamp);

    res.render('analyse', {
      totalClicks: result.visitRecord.length,
      clickTimes,
      error: null,
      shortend: null
    });
  } catch (err) {
    console.error(err);
    res.render('analyse', { shortend: null, totalClicks: null, clickTimes: [], error: 'Something went wrong' });
  }
});


router.get("/:shortUrl", async (req, res) => {
  try {
    const shortUrl = req.params.shortUrl
    const entry = await url.findOneAndUpdate({ shortUrl }, {
      $push: {
        visitRecord: {
          timestamp: Date.now()
        }
      }
    }, )
    console.log(entry )
    if (!entry) {
      res.status(404).send("URL not found")
    } else {
        res.redirect(entry.redirectUrl)
    }
  } catch (err) {
    console.error(err)
    res.status(500).send("Internal Server Error")
  } 
})


router.get("/analytics/:id", async (req, res) => {
    const shortUrl = req.params.id;
    const result = await url.findOne({ shortUrl });
    // if (!result) {
    //     return res.status(404).send("Analytics not found");
    // }
    // res.render("analytics", { totalClicks: result.visitRecord.length });

    if (!result) {
      return res.status(404).json({ error: "Analytics not found" });
    }
    res.json({ totalClicks: result.visitRecord.length });
  }); 





module.exports = router