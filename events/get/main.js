module.exports.run = async (req, res, fs, client, Discord, cmdpath) => {

  const home_head = fs.readFileSync("./html/home_head.html");
  let perms = JSON.parse(fs.readFileSync("./perms.json", "utf-8"));
  
//LOGGED IN
  if(req.session.loggedin) {

    //UNDEFINED USER
    if(req.session.username === "undefined#undefined" || req.session.username === "undefined") {
      
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
        if(mitronaserver.members.cache.find(m => m.id === userid).permissions.has(Discord.PermissionsBitField.Flags.ManageRoles) && mitronaserver.members.me.permissions.has(Discord.PermissionsBitField.Flags.ManageRoles)) {
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
        if(mitronaserver.members.cache.find(m => m.id === userid).permissions.has(Discord.PermissionsBitField.Flags.ManageRoles) && mitronaserver.members.me.permissions.has(Discord.PermissionsBitField.Flags.ManageRoles)) {
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
    
        return res.send(`
          ${home_head}
          <head>
            <title>Mitrona &bull; Dashboard | ${cmdpath[0].toUpperCase() + cmdpath.slice(1)}</title>
            <meta property="og:image" content="https://${req.hostname}/icons/logo.png">
            <link rel="stylesheet" href="../style.css">
            <script src="../script.js" defer></script>
          </head>
          <body>
            <div id="pagecontent" class="pagecontent">

              <div id="success" class="success">
                <div id="successdiv" class="alert alert-dismissible alert-success">
                  <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
                  <b id="successtitle">ACTION</b><br><span id="successdesc">DESCRIPTION</span>
                </div>
              </div>

              <center><br>
                <a href="../" id="home" class="home"><img src="${client.user.displayAvatarURL()}" id="avatar" class="avatar"></a>
                <ul class="details">
                  <li><img src="${avatar.replace("?size=32", "?size=128")}" id="avatar" class="avatar"> <b>${user}</b></li>
                  <li><form action="logout" method="POST">
                    <input type="submit" value="Log out!" class="btn btn-outline-warning">
                  </form></li>
                </ul><br>
                <h1 style="color: #3498db;">${cmdpath[0].toUpperCase() + cmdpath.slice(1)}</h1>
                <h3>Permissions</h3>
                <div class="perms">
                  <p><b>The following members currently have access to this command.</b></p>
                  ${puadminarr + "<br>" + puarr}
                </div><br>
                <h3>Configuration</h3>
                <p class="addroledesc"><b>Add a role by looking it up.</b></p>
              </center>
              <div class="grid" id="grid">
                <div class="config" id="config">
                  <div id="searchdropdown" class="searchdropdown">
                    <input type="search" id="searchbar" class="form-control me-sm-2 searchbar" onkeyup="lookup()" placeholder="Search for a role to add...">
                    <ul id="roles" class="roles">
                      ${roles}
                    </ul>
                  </div>
                </div>
                <ul id="allowedroles" class="allowedroles">
                  ${allowedroles}
                </ul>
              </div>
            </div>
          </body>
        </html>`);
  
      } else {
        //USER
        return res.redirect("/");
      }
    }

  } else {
    //LOGGED OUT
    return res.redirect("/");
  }
}