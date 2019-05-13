var express = require('express');
var router = express.Router();
var request = require("request");
var axios = require("axios");
var configs = require("./../configs");

/* POST login data. */
router.post('/', function (req, res, next) {
  //console.log("login.js / req.body: ", req.body);

  // API parameters
  const clientMac           = req.body.client_mac;
  const clientType          = req.body.client_type;
  const clientName          = req.body.name + " " + clientType;
  const nodeMac             = req.body.node_mac;
  const baseUrl             = req.protocol + '://' + req.get('host');
  const apiInventoryEndpoint= '/api/organizations/' + configs.organizationId + '/inventory';
  
  var   policyId = null;
  console.log("Client type ", clientType);

    switch (clientType) {
        case "windows":
        case "mac":
            console.log("Setting policy to CORP for client " + clientMac);
            policyId = configs.policyCorporate;
            break;
        case "iphone":
        case "android":
            console.log("Setting policy to BYOD for client " + clientMac);
            policyId = configs.policyByod;
            break;
        default:
            console.log("Unknown device type for client " + clientMac);
            res.end();
      }

    if (clientType != "unknown") {// Bind client to a group policy id
        axios.get(baseUrl+apiInventoryEndpoint)
        .then(function (response) {
            var inventory = response.data;
            var networkId = null;
            for (i = 0; i < inventory.length; i++) {
                if (inventory[i]["mac"] == nodeMac) {
                    networkId = inventory[i]["networkId"];
                    break;
                }
            }
            if (networkId != null) {
                var apiProvisionEndpoint= '/api/networks/' + networkId + '/clients/provision';
                axios.post(baseUrl+apiProvisionEndpoint,
                    { "mac": clientMac, "name": clientName, devicePolicy: 'Group policy', groupPolicyId: policyId })
                .then(function (response) {
                    console.log("Policy Applied: ", response.data);
                    // Process Meraki Login
                    res.writeHead(302, {
                        'Location': req.body.base_grant_url + "?continue_url=" + req.body.user_continue_url
                    });
                    res.end();
                    //res.render('index', payload);
                })
                .catch(function (error) {
                    console.log("Policy Failed", error.response);
                    res.end();
                });
            }
        })
        .catch(function (error) {
            console.log("Get Inventory Failed", error.response);
            res.end();
        });
      
    } else {
        console.log("No policy set");
        res.end();
    }
  

});

module.exports = router;

