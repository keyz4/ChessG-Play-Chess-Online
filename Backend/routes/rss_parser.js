const express = require('express');
const router = express.Router();
const Parser = require('rss-parser');
parser = new Parser();



router.get('/',async (req,res)=>{
    try{
        const feed = await parser.parseURL('https://www.chess.com/rss/articles');
        // console.log(feed.items[0]);
        res.json(feed)

    }catch(error){
        console.log('Request failed.');
        console.error(error);
    }
});

module.exports = router;