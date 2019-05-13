var express = require('express');
var router = express.Router();

function profileClient (userAgentStr, macAddress) {
    console.log("profiling / " + userAgentStr + " / "+ macAddress);
    
    // TODO: Add support for static MAC-client type mappings
    
    if (userAgentStr.indexOf("iPhone")!=-1) {
        if (macAddress.startsWith("c8:3c:85") || 
            macAddress.startsWith("a8:8e:24")    ) {
            return "iphone";
        }
    } else if (userAgentStr.indexOf("Windows")!=-1) {
        // TODO: MAC address checks?
        return "windows";
    }
    
    return "unknown";
    
}

/* GET splash page and extract Meraki paramaters. */
router.get('/', function(req, res, next) {
  console.log("index.js / req.body: ",req.body);
        
  var clientType = profileClient (req.headers['user-agent'], req.query.client_mac);
  
  var payload = {
    client_type : clientType,
    host : req.headers.host,
    base_grant_url : req.query.base_grant_url,
    user_continue_url : req.query.user_continue_url,
    node_mac : req.query.node_mac,
    client_ip : req.query.client_ip,
    client_mac : req.query.client_mac,
    splashclick_time : new Date().toString(),
  }
  
  res.render('index', payload);
});

module.exports = router;
