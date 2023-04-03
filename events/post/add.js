module.exports.run = async (req, res, mongoClient) => {
  
	if(req.session.loggedin) {

    var user = req.session.username;

    if(perms.admin.includes(req.session.userid)) {
      if(req.body && req.body.id && req.body.cmd && req.body.action && req.body.action === "add" && req.body.roleid && perms.admin && perms.admin.includes(req.body.id)) {

        if(!perms.announce.includes(req.body.roleid)) {
          perms.announce = perms.announce.concat(req.body.roleid);
          fs.writeFile("./perms.json", JSON.stringify(perms), (err) => {
            if(err) console.log(err);
          });
        }

        console.log("\x1b[31m", `» ${req.clientIp} (ADMIN) ${user} added ${req.body.roleid} to perms.${req.body.cmd}!`, "\x1b[0m", "");
        return res.json({ success: "add", redirect: `//${req.hostname}/${req.body.cmd}?success=add` });
      } else {
        console.log("\x1b[35m", `» ${req.clientIp} (USER) ${user} tried POSTing to /add, but failed!`, "\x1b[0m", "");
        return res.json({ success: "error", redirect: `//${req.hostname}/` });
      }
    }
	} else return res.json({ success: "error", redirect: `//${req.hostname}/` });
}