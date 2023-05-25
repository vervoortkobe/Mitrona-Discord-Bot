const Discord = require("discord.js");
const fs = require("fs");

module.exports.run = async (req, res, client, cmdpath, db) => {
  
  let fetchedperms = await db.collection("perms").find().toArray();
  let perms = fetchedperms[0];

  const head = fs.readFileSync("./html/_head.html");
  const main = fs.readFileSync("./html/main.html");
  
//LOGGED IN
  if(req.session.loggedin) {

    //UNDEFINED USER
    if(req.session.username === "undefined#undefined" || 
    req.session.username === "undefined") {
      return res.redirect("/");
    } else {
    
      var userid = req.session.userid;
      var user = req.session.username;
      var avatar = req.session.avatar;
      
      //ADMIN

      if(perms.admin.includes(userid)) {

        let cmdperms = [];
        switch (cmdpath) {
          case "announce":
            cmdperms = perms.announce;
            break;
          case "autorole":
            cmdperms = perms.autorole;
            break;
          case "citizen":
            cmdperms = perms.citizen;
            break;
          case "clear":
            cmdperms = perms.clear;
            break;
          case "gcancel":
            cmdperms = perms.gcancel;
            break;
          case "gcheck":
            cmdperms = perms.gcheck;
            break;
          case "gend":
            cmdperms = perms.gend;
            break;
          case "giveaway":
            cmdperms = perms.giveaway;
            break;
          case "greroll":
            cmdperms = perms.greroll;
            break;
          case "uncitizen":
            cmdperms = perms.uncitizen;
            break;

          default:
            cmdperms = [];
            break;
        }
  
        console.log("\x1b[31m", `» (ADMIN) ${user} visited /${cmdpath}!`, "\x1b[0m", "");

        let puadminarr = perms.admin.map(id => {
          if(client.users.cache.get(id)) {
            if(id === "606106751346933770") return `<p class="pu" id="pu_${id}"><b style="background-color: #0085a6">${client.users.cache.get(id).tag} (OWNER)</b></p>`;
            else if(id === "408289224761016332") return `<p class="pu" id="pu_${id}"><b style="background-color: #ff0000">${client.users.cache.get(id).tag} (DEV)</b></p>`;
            else return `<p class="pu" id="pu_${id}"><b>${client.users.cache.get(id).tag} (ADMIN)</b></p>`;
          }
        }).join(", ");

        let puarr = cmdperms.map(id => {
          if(client.users.cache.get(id)) return `<p class="pu"><b>${client.users.cache.get(id).tag}</b></p>`;
        }).join("");

        if(puadminarr === [] && puarr === []) {
          puadminarr = "Permitted users not yet configured!";
          puarr = "/";
        }

        let roles = "";
        const mitronaserver = client.guilds.cache.get(process.env.MITRONA_SERVERID);
        if(mitronaserver.members.cache.find(m => m.id === userid).permissions.has(Discord.PermissionsBitField.Flags.ManageRoles) && 
        mitronaserver.members.me.permissions.has(Discord.PermissionsBitField.Flags.ManageRoles) || 
        perms.admin[0] === userid && 
        mitronaserver.members.me.permissions.has(Discord.PermissionsBitField.Flags.ManageRoles)
        ) {
          //ROLE POSITIONS LIKE IN SERVER'S ROLE LIST
          let roleposarr = [];
          for (let i = 0; i < mitronaserver.roles.cache.size; i++) {
            let posrole = mitronaserver.roles.cache.find(r => r.position === i);
            if(posrole) roleposarr.unshift(posrole);
          }
          roles = roleposarr.map(r => {
            //base10 number color to rgb
            const rrgb = (r.color & 0xff0000) >> 16;
            const grgb = (r.color & 0x00ff00) >> 8;
            const brgb = (r.color & 0x0000ff);

            //rgba
            if(!cmdperms.includes(r.id)) return `<li class="role" id="${r.id}"><b><a style="background-color: rgba(${brgb}, ${grgb}, ${rrgb}, .5);">${r.name}</a></b><button type="button" class="btn btn-success rolebtn" id="rolebtn-${cmdpath}_${r.id}*${userid}" onclick="post(this.id, 'add')">Add</button></li>`;
          }).join("");
        }

        if(!roles || roles.length === 0) roles = "No roles found in this server!";

        let allowedroles = "";
        if(mitronaserver.members.cache.find(m => m.id === userid).permissions.has(Discord.PermissionsBitField.Flags.ManageRoles) && 
        mitronaserver.members.me.permissions.has(Discord.PermissionsBitField.Flags.ManageRoles) || 
        perms.admin[0] === userid && 
        mitronaserver.members.me.permissions.has(Discord.PermissionsBitField.Flags.ManageRoles)
        ) {
          allowedroles = cmdperms.map(rid => {
            const findrole = mitronaserver.roles.cache.find(r => r.id === rid);
            if(findrole) {
              //base10 number color to rgb
              const rrgb = (findrole.color & 0xff0000) >> 16;
              const grgb = (findrole.color & 0x00ff00) >> 8;
              const brgb = (findrole.color & 0x0000ff);

              //rgba
              return `<li class="allowedrole" id="allowedrole_${findrole.id}-${userid}"><b><a style="background-color: rgba(${brgb}, ${grgb}, ${rrgb}, .5);">${findrole.name}</a></b><button type="button" class="btn btn-danger allowedrolebtn" id="allowedrolebtn-${cmdpath}_${findrole.id}*${userid}" onclick="post(this.id, 'remove')">Remove</button></li>`;
            }
          }).join("");
        }

        if(!cmdperms || cmdperms.length === 0 || !allowedroles || allowedroles.length === 0) allowedroles = "No roles have been configured for this command!";
    
        return res.send(
          head + 
          main
          .toString()
          .replaceAll("${cmdpath[0].toUpperCase() + cmdpath.slice(1)}", cmdpath[0].toUpperCase() + cmdpath.slice(1))
          .replaceAll("${req.hostname}", req.hostname)
          .replaceAll("${client.user.displayAvatarURL()}", client.user.displayAvatarURL())
          .replaceAll("${avatar.replace('?size=32', '?size=128')}", avatar.replace('?size=32', '?size=128'))
          .replaceAll("${user}", user)
          .replaceAll("${cmdpath[0].toUpperCase() + cmdpath.slice(1)}", cmdpath[0].toUpperCase() + cmdpath.slice(1))
          .replaceAll('${puadminarr + "<br>" + puarr}', puadminarr + "<br>" + puarr)
          .replaceAll("${roles}", roles)
          .replaceAll("${allowedroles}", allowedroles)
        );
  
      } else return res.redirect("/"); //USER
    }
  } else return res.redirect("/"); //LOGGED OUT
}