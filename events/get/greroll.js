module.exports.run = async (req, res, fs, client) => {

  const home_head = fs.readFileSync("./html/home_head.html");
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

      if((process.env.ADMIN).includes(userid)) {
  
        console.log("\x1b[31m", `» (ADMIN) ${user} visited /greroll!`, "\x1b[0m", "");
    
        return res.send(`
          ${home_head}
          <head>
            <title>Mitrona &bull; Dashboard | Greroll</title>
            <meta property="og:image" content="https://${req.hostname}/icons/logo.png">
          </head>
          <body>
            <div id="pagecontent" class="pagecontent">
              <center><br>
                Welcome back, <img src="${avatar}" id="avatar" class="avatar"> <b>${user}</b>!<br>
                Logged in!
                <ul class="details">
                  <li><img src="${avatar.replace("?size=32", "?size=128")}" id="avatar" class="avatar"> <b>${user}</b></li>
                  <li><form action="logout" method="POST">
                    <input type="submit" value="Log out!" class="btn btn-outline-warning">
                  </form></li>
                </ul><br>
                <h1>Compatible Commands</h1>
                <div class="commands">
                  <a href="/announce">
                    <button id="announce" class="btn btn-outline-success">Announce</button>
                  </a><br>
                  <a href="/autorole">
                    <button id="autorole" class="btn btn-outline-success">Autorole</button>
                  </a><br>
                  <a href="/citizen">
                    <button id="citizen" class="btn btn-outline-success">Citizen</button>
                  </a><br>
                  <a href="/clear">
                    <button id="clear" class="btn btn-outline-success">Clear</button>
                  </a><br>
                  <a href="/gcancel">
                    <button id="gcancel" class="btn btn-outline-success">Gcancel</button>
                  </a><br>
                  <a href="/gcheck">
                    <button id="gcheck" class="btn btn-outline-success">Gcheck</button>
                  </a><br>
                  <a href="/gend">
                    <button id="gend" class="btn btn-outline-success">Gend</button>
                  </a><br>
                  <a href="/giveaway">
                    <button id="giveaway" class="btn btn-outline-success">Giveaway</button>
                  </a><br>
                  <a href="/greroll">
                    <button id="greroll" class="btn btn-outline-success">Greroll</button>
                  </a><br>
                  <a href="/uncitizen">
                    <button id="uncitizen" class="btn btn-outline-success">Uncitizen</button>
                  </a><br>
                </div>
              </center>
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