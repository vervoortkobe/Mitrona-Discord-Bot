module.exports.run = async (req, res, fs) => {

  const home_head = fs.readFileSync("./html/home_head.html");

//LOGGED IN
  if(req.session.loggedin) {

    //UNDEFINED USER
    if(req.session.username === "undefined#undefined" || req.session.username === "undefined") {
      var user = req.session.username;

      console.log("\x1b[35m", `» (USER) ${user} logged out!`, "\x1b[0m", "");
      
  		req.session.destroy();
      
      return res.send(`
        ${home_head}
        <head>
          <meta property="og:image" content="https://${req.hostname}/icons/logo.png">
          <style>
            .pagecontent { display: none; padding-top: 15%; }
            .ip { padding-top: 42vh; }
          </style>
        </head>
        <body>
          <div id="pagecontent" class="pagecontent">
            <center><br>
              Login-exception: Something went wrong in the authentication process!<br><br>
              Only Administrators are allowed to access this page!
              <br><br><div class="ip">Your public IP-address: ${req.clientIp}</div>
            </center>
          </div>
        </body>
      </html>`);
      
    } else {
    
      var userid = req.session.userid;
      var user = req.session.username;
      var avatar = req.session.avatar;
      
      //ADMIN

      if((process.env.ADMIN).includes(userid)) {
  
        console.log("\x1b[31m", `» (ADMIN) ${user} visited /!`, "\x1b[0m", "");
    
        return res.send(`
          ${home_head}
          <head>
            <meta property="og:image" content="https://${req.hostname}/icons/logo.png">
          </head>
          <body>
            <div id="pagecontent" class="pagecontent">
              <center><br>
                Welcome back, <img src="${avatar}" id="avatar" class="avatar"> <b>${user}</b>!<br>
                Logged in!<br><br>
                <a href="/new">
                  <button id="create" class="btn btn-outline-success">Create another post</button>
                </a><br><br>
                <form action="logout" method="POST">
                  <input type="submit" value="Log out!" class="btn btn-outline-warning">
                </form><br>
                <h1>Posts</h1>
              </center>
            </div>
          </body>
        </html>`);
  
      } else {
        //USER
  
        console.log("\x1b[35m", `» (USER) ${user} visited /!`, "\x1b[0m", "");
    
        return res.send(`
          ${home_head}
          <head>
            <meta property="og:image" content="https://${req.hostname}/icons/logo.png">
            <style>
              .pagecontent { display: none; padding-top: 15%; }
              .ip { padding-top: 42vh; }
            </style>
          </head>
          <body>
            <div id="pagecontent" class="pagecontent">
              <center><br>
                Only Administrators are allowed to access this page!
                <br><br><div class="ip">Your public IP-address: ${req.clientIp}</div>
              </center>
            </div>
          </body>
        </html>`);
      }
    }

  } else {
    //LOGGED OUT

    console.log("\x1b[33m", `» (UNKNOWN) Anonymous visited /!`, "\x1b[0m", "");

    return res.send(`
      ${home_head}
      <head>
        <meta property="og:image" content="https://${req.hostname}/icons/logo.png">
        <style>
          .pagecontent { display: none; padding-top: 15%; }
          .ip { padding-top: 42vh; }
        </style>
      </head>
      <body>
        <div id="pagecontent" class="pagecontent">
          <center><br>
            Log in before accessing the page!<br><br>
            <a href="${process.env.AUTHURL}">
              <button id="login" class="btn btn-outline-primary" style="width: 300px; height: 46px; user-select: none; text-align: center; font-weight: 700; font-size: 16px;">
                <svg aria-hidden="true" focusable="false" data-prefix="fab" data-icon="discord" class="svg-inline--fa fa-discord fa-lg " role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" color="var(--card-color-text)" style="width: 20px; height: auto;">
                  <path fill="currentColor" d="M524.5 69.84a1.5 1.5 0 0 0 -.764-.7A485.1 485.1 0 0 0 404.1 32.03a1.816 1.816 0 0 0 -1.923 .91 337.5 337.5 0 0 0 -14.9 30.6 447.8 447.8 0 0 0 -134.4 0 309.5 309.5 0 0 0 -15.14-30.6 1.89 1.89 0 0 0 -1.924-.91A483.7 483.7 0 0 0 116.1 69.14a1.712 1.712 0 0 0 -.788 .676C39.07 183.7 18.19 294.7 28.43 404.4a2.016 2.016 0 0 0 .765 1.375A487.7 487.7 0 0 0 176 479.9a1.9 1.9 0 0 0 2.063-.676A348.2 348.2 0 0 0 208.1 430.4a1.86 1.86 0 0 0 -1.019-2.588 321.2 321.2 0 0 1 -45.87-21.85 1.885 1.885 0 0 1 -.185-3.126c3.082-2.309 6.166-4.711 9.109-7.137a1.819 1.819 0 0 1 1.9-.256c96.23 43.92 200.4 43.92 295.5 0a1.812 1.812 0 0 1 1.924 .233c2.944 2.426 6.027 4.851 9.132 7.16a1.884 1.884 0 0 1 -.162 3.126 301.4 301.4 0 0 1 -45.89 21.83 1.875 1.875 0 0 0 -1 2.611 391.1 391.1 0 0 0 30.01 48.81 1.864 1.864 0 0 0 2.063 .7A486 486 0 0 0 610.7 405.7a1.882 1.882 0 0 0 .765-1.352C623.7 277.6 590.9 167.5 524.5 69.84zM222.5 337.6c-28.97 0-52.84-26.59-52.84-59.24S193.1 219.1 222.5 219.1c29.67 0 53.31 26.82 52.84 59.24C275.3 310.1 251.9 337.6 222.5 337.6zm195.4 0c-28.97 0-52.84-26.59-52.84-59.24S388.4 219.1 417.9 219.1c29.67 0 53.31 26.82 52.84 59.24C470.7 310.1 447.5 337.6 417.9 337.6z">
                </path>
              </svg> Discord Login</button>
            </a>
            <br><br><div class="ip">Your public IP-address: ${req.clientIp}</div>
          </center>
        </div>
      </body>
    </html>`);
  }
}