# Meraki Splash Page with Group Policies and client device profiling
A simple NodeJS application using Express with Handlebars

Based on code and documentation by @dexterlabora. The code has been adapted as follows:
* configs.js: Requires organizationId instead of networkId. Supports 2 separate Group policies, one for Corporate access and one for BYOD
* index.hbs: One more hidden field has been added to communicate profiling result to the login page
* index.js: Includes code for profiling clients to BYOD/Workstations. Feel free to modify the code to tune it to better detect your client devices
* login.js: Resolves networkId based on AP MAC address. Uses profiling information to set differentiated policies


![screenshot](./screenshots/splash-screenshot.png "Splash Page")

## Application Install

```
git clone <this repo> meraki
cd meraki
npm install
```
Open the `configs.sample.js` file and edit the variables and save the file as `configs.js`
```
//configs.js
// Rename this file to configs.js 
// Define your Application Configurations here
var config = {
    // Meraki API Key
    apiKey: "YourAPIKey", 
    // The "shard" number for your Meraki organization (find this in your dashboard URL)
    shard: "n###", 
    // The Meraki Organization ID
    organizationId: "123",
    // The Meraki Group Policy IDs
    policyByod: 108,
    policyCorporate: 107
}
```

```
npm start
```

View the site

http://localhost:3000

Test w/ sample moc data

http://localhost:3000/?base_grant_url=https%3A%2F%2Fn143.network-auth.com%2Fsplash%2Fgrant&user_continue_url=http%3A%2F%2Fask.com%2F&node_id=149624921787028&node_mac=88:15:44:50:0a:94&gateway_id=149624921787028&client_ip=10.110.154.195&client_mac=74:da:38:88:7c:df

## Meraki Setup
### Wireless SSID
Configure Wirless Network

Wireless --> Configure --> Access Control
- Splash Page: Click-through

### Splash Page Redirect
Wireless --> Configure --> Splash
- Custom Splash URL: http://YourPublicServerAddress:3000/

### Group Policy
Network-wide --> Configure --> Group Policies
- add Groups for Corporate and BYOD access
- Splash: Bypass


### Use Postman to get IDs
https://documenter.getpostman.com/view/897512/meraki-dashboard-prov-api/2To9xm#intro
- orgID
- policyID

### Using the portal with multiple networks
The current implementation requires all networks to have the same policyIDs for the Corporate and BYOD policies. The easiest way to achieve this is to bind them to the same configuration template: https://documentation.meraki.com/zGeneral_Administration/Templates_and_Config_Sync/Managing_Multiple_Networks_with_Configuration_Templates

### Troubleshooting
If your device is classified as "unknown" by the profiling algorithm, most likely your user agent string or MAC OUI is missing from the ruleset. To modify the ruleset, edit function `profileClient` in file `/routes/index.js`.

Every time you access the captive portal index page with a client, the Node.js log window will display the client's HTTP user agent and MAC address. Use this information to modify the profiling ruleset.  


