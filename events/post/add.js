module.exports.run = async (req, res, db) => {
  
  let fetchedperms = await db.collection("perms").find().toArray();
  let perms = fetchedperms[0];
  
	if(req.session.loggedin) {

    var user = req.session.username;

    if(perms.admin.includes(req.session.userid)) {
      if(req.body && req.body.id && req.body.cmd && req.body.action && req.body.action === "add" && req.body.roleid && perms.admin && perms.admin.includes(req.body.id)) {

        switch (req.body.cmd) {
          case "announce":
            if(!perms.announce.includes(req.body.roleid)) await db.collection("perms").updateOne({ }, { $push: { announce: req.body.roleid } });
            break;
          case "autorole":
            if(!perms.autorole.includes(req.body.roleid)) await db.collection("perms").updateOne({ }, { $push: { autorole: req.body.roleid } });
            break;
          case "citizen":
            if(!perms.citizen.includes(req.body.roleid)) await db.collection("perms").updateOne({ }, { $push: { citizen: req.body.roleid } });
            break;
          case "clear":
            if(!perms.clear.includes(req.body.roleid)) await db.collection("perms").updateOne({ }, { $push: { clear: req.body.roleid } });
            break;
          case "gcancel":
            if(!perms.gcancel.includes(req.body.roleid)) await db.collection("perms").updateOne({ }, { $push: { gcancel: req.body.roleid } });
            break;
          case "gcheck":
            if(!perms.gcheck.includes(req.body.roleid)) await db.collection("perms").updateOne({ }, { $push: { gcheck: req.body.roleid } });
            break;
          case "gend":
            if(!perms.gend.includes(req.body.roleid)) await db.collection("perms").updateOne({ }, { $push: { gend: req.body.roleid } });
            break;
          case "giveaway":
            if(!perms.giveaway.includes(req.body.roleid)) await db.collection("perms").updateOne({ }, { $push: { giveaway: req.body.roleid } });
            break;
          case "greroll":
            if(!perms.greroll.includes(req.body.roleid)) await db.collection("perms").updateOne({ }, { $push: { greroll: req.body.roleid } });
            break;
          case "uncitizen":
            if(!perms.uncitizen.includes(req.body.roleid)) await db.collection("perms").updateOne({ }, { $push: { uncitizen: req.body.roleid } });
            break;
        
          default:
            break;
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