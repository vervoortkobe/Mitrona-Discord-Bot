const fs = require("fs");

module.exports.run = async (req, res, client, db) => {
  
  let fetchedperms = await db.collection("perms").find().toArray();
  let perms = fetchedperms[0];

  const head = fs.readFileSync("./html/_head.html");
  const undefined_user = fs.readFileSync("./html/_undefined_user.html");
  const admin = fs.readFileSync("./html/_admin.html");
  const logged_in = fs.readFileSync("./html/_logged_in.html");
  const logged_out = fs.readFileSync("./html/_logged_out.html");
  
//LOGGED IN
  if(req.session.loggedin) {

    //UNDEFINED USER
    if(req.session.username === "undefined#undefined" || req.session.username === "undefined") {
      var user = req.session.username;

      console.log("\x1b[35m", `» (USER) ${user} logged out!`, "\x1b[0m", "");
      
  		req.session.destroy();
      
      return res.send(
        head + 
        undefined_user
        .toString()
        .replaceAll("${req.hostname}", req.hostname)
        .replaceAll("${req.clientIp}", req.clientIp)
      );
      
    } else {
    
      var userid = req.session.userid;
      var user = req.session.username;
      var avatar = req.session.avatar;
      
      //ADMIN

      if(perms.admin.includes(userid)) {
  
        console.log("\x1b[31m", `» (ADMIN) ${user} visited /!`, "\x1b[0m", "");
    
        return res.send(
          head + 
          admin
          .toString()
          .replaceAll("${req.hostname}", req.hostname)
          .replaceAll("${avatar}", avatar)
          .replaceAll("${user}", user)
          .replaceAll("${avatar.replace('?size=32', '?size=128')}", avatar.replace('?size=32', '?size=128'))
          .replaceAll("${user}", user)
        );
  
      } else {
        //USER
  
        console.log("\x1b[35m", `» (USER) ${user} visited /!`, "\x1b[0m", "");
    
		    req.session.destroy();
        return res.send(
          head + 
          loggedin_user
          .toString()
          .replaceAll("${req.hostname}", req.hostname)
          .replaceAll("${req.clientIp}", req.clientIp)
        );
      }
    }

  } else {
    //LOGGED OUT

    console.log("\x1b[33m", `» ${req.clientIp} (UNKNOWN) Anonymous visited /!`, "\x1b[0m", "");
    
    let totalSeconds = (client.uptime / 1000);
    let days = Math.floor(totalSeconds / 86400);
    totalSeconds %= 86400;
    let hours = Math.floor(totalSeconds / 3600);
    totalSeconds %= 3600;
    let minutes = Math.floor(totalSeconds / 60);
    let seconds = Math.floor(totalSeconds % 60);
    let uptime = `${days}d ${hours}h ${minutes}m ${seconds}s`;

    let members = await client.guilds.cache.get(process.env.MITRONA_SERVERID).memberCount;
    
    return res.send(
      head + 
      logged_out
      .toString()
      .replaceAll("${req.hostname}", req.hostname)
      .replaceAll("${process.env.AUTHURL}", process.env.AUTHURL)
      .replaceAll("${uptime}", uptime)
      .replaceAll("${members}", members)
      .replaceAll("${req.clientIp}", req.clientIp)
    );
  }
}