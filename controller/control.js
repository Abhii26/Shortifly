const ShortUniqueId = require('short-unique-id');
const Url = require('../models/schema');
const uid = new ShortUniqueId({length: 8});
const renderError = (res,message) => res.status(400).render('index',{shortend:{type:'danger',message},shortUrl:null,uid:null});
async function generateShortUrl(req,res) {
  try {
    const original = String(req.body.url || '').trim();
    let parsed;
    try { parsed = new URL(original); } catch { return renderError(res,'Enter a valid HTTP or HTTPS URL.'); }
    if (!['http:','https:'].includes(parsed.protocol)) return renderError(res,'Only HTTP and HTTPS URLs are supported.');
    const code = uid.rnd();
    await Url.create({shortUrl:code,redirectUrl:parsed.href,visitRecord:[]});
    const forwardedProto = String(req.headers['x-forwarded-proto'] || req.protocol || 'https').split(',')[0];
    const host = String(req.headers['x-forwarded-host'] || req.get('host')).split(',')[0];
    const site = process.env.URL_BASE || `${forwardedProto}://${host}`;
    return res.render('index',{shortend:{type:'success',message:'URL shortened successfully!'},shortUrl:`${site.replace(/\/$/,'')}/${code}`,uid:code});
  } catch(e) { console.error('Shorten failed',e.message);return res.status(500).render('index',{shortend:{type:'danger',message:'Unable to shorten this URL right now.'},shortUrl:null,uid:null}); }
}
module.exports = {generateShortUrl};
