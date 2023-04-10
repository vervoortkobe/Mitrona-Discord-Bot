module.exports.run = async (req, res) => {
  
  let fetchedperms = await db.collection("perms").find().toArray();
  let perms = fetchedperms[0];
  
	if(req.session.loggedin) {

    var user = req.session.username;

    if(perms.admin.includes(req.session.userid)) {
      console.log("\x1b[31m", `» (ADMIN) ${user} logged out!`, "\x1b[0m", "");
    } else {
      console.log("\x1b[35m", `» (USER) ${user} logged out!`, "\x1b[0m", "");
    }
    
		req.session.destroy();
		return res.redirect("/");
    
	} else return res.redirect("/");
}