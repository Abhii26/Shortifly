const express = require('express');
const Url = require('../models/schema');
const {generateShortUrl} = require('../controller/control');
const router = express.Router();
router.get('/',(req,res)=>res.render('index',{shortend:null,shortUrl:null,uid:null}));
router.post('/',generateShortUrl);
router.get('/analyse',(req,res)=>res.render('analyse',{shortend:null,totalClicks:null,clickTimes:[],error:null,submittedUrl:req.query.url||''}));
router.post('/analyse',async(req,res)=>{
  try {
    const raw = String(req.body.shortUrlInput||'').trim();
    const code = raw.replace(/\/+$/,'').split('?')[0].split('#')[0].split('/').pop();
    if(!/^[A-Za-z0-9_-]{1,64}$/.test(code)) throw new Error('invalid code');
    const entry = await Url.findOne({shortUrl:code}).lean();
    if(!entry) return res.render('analyse',{shortend:null,totalClicks:null,clickTimes:[],error:'Short URL not found',submittedUrl:raw});
    return res.render('analyse',{shortend:null,totalClicks:entry.visitRecord.length,clickTimes:entry.visitRecord.map(x=>x.timestamp),error:null,submittedUrl:raw});
  } catch(e) {console.error(e.message);return res.render('analyse',{shortend:null,totalClicks:null,clickTimes:[],error:'Could not find that short link',submittedUrl:String(req.body.shortUrlInput||'')});}
});
router.get('/analytics/:id',async(req,res)=>{
  try { const record = await Url.findOne({shortUrl:req.params.id}).lean();if(!record)return res.status(404).json({error:'Link not found'});return res.json({totalClicks:record.visitRecord.length}); }
  catch(e){return res.status(500).json({error:'Analytics unavailable'});}
});
router.get('/:shortUrl',async(req,res)=>{
  try { const record = await Url.findOneAndUpdate({shortUrl:req.params.shortUrl},{$push:{visitRecord:{timestamp:Date.now()}}});
    if(!record)return res.status(404).send('Short URL not found');
    return res.redirect(302,record.redirectUrl);
  } catch(e){console.error(e.message);return res.status(500).send('Unable to redirect');}
});
module.exports = router;
