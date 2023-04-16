const fetch = require("node-fetch");

async function getJSONRes(body) {
	let fullBody = "";

	for await (const data of body) {
		fullBody += data.toString();
	}
	return JSON.parse(fullBody);
}

module.exports.run = async (req, res, db) => {
	
	let fetchedperms = await db.collection("perms").find().toArray();
	let perms = fetchedperms[0];
  
	if(req.session.loggedin) {
		return res.send(`<script>setTimeout(() => { window.location.href = "/home" }, 3000);</script>
              <center>Please logout before logging in!<br>
              Redirecting to /home in 3 seconds...</center>`);
    
	} else {

		var code = req.query.code;

  	if(!code) {
      return res.redirect("/");
    }
  
  	if (code) {
  		try {
  			const tokenResData = await fetch("https://discord.com/api/oauth2/token", {
  				method: "POST",
  				body: new URLSearchParams({
  					client_id: process.env.DISCORD_OAUTH2_CLIENTID,
  					client_secret: process.env.DISCORD_OAUTH2_CLIENTSECRET,
  					grant_type: "authorization_code",
  					redirect_uri: process.env.DISCORD_OAUTH2_REDIRECTURI_LOCAL,
  					scope: "identify",
  					code
  				}),
  				headers: {
  					"Content-Type": "application/x-www-form-urlencoded",
  				},
  			});
				//console.log(tokenResData);
        if(tokenResData.status === 200) {
    
    			const oauthData = await getJSONRes(tokenResData.body);
          //console.log(oauthData);
    			
    			const userResult = await fetch(`https://discord.com/api/users/@me`, {
    				headers: {
    					authorization: `${oauthData.token_type} ${oauthData.access_token}`,
    				},
    			});
    
    			await getJSONRes(userResult.body).then(body => {
    				console.log(body);
  
    				req.session.loggedin = true;
						req.session.userid = `${body.id}`;
            req.session.username = `${body.username}#${body.discriminator}`;
            req.session.avatar = `https://cdn.discordapp.com/avatars/${body.id}/${body.avatar}.png?size=32`;
  
            var user = req.session.username;
            if(perms.admin.includes(req.session.userid)) {
              console.log("\x1b[31m", `» (ADMIN) ${user} logged in!`, "\x1b[0m", "");
            } else {
              console.log("\x1b[35m", `» (USER) ${user} logged in!`, "\x1b[0m", "");
            }
            
    				return res.redirect("/");
    			});
          
        } else {
          return res.redirect("/");
        }
        
  		} catch(err) {
        console.log(err);
      }
  	}
  }
}
