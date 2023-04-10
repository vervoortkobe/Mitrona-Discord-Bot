module.exports.run = async (req, res, db) => {
  
  let fetchedperms = await db.collection("perms").find().toArray();
  let perms = fetchedperms[0];
  
	if(req.session.loggedin) {

    var user = req.session.username;

    if(perms.admin.includes(req.session.userid)) {
      if(req.body && req.body.id && req.body.cmd && req.body.action && req.body.action === "remove" && req.body.roleid && perms.admin && perms.admin.includes(req.body.id)) {

        let foundObj = await db.collection("perms").findOne({ });

        switch (req.body.cmd) {
          case "announce":
            if(perms.announce.includes(req.body.roleid)) await db.collection("perms").updateOne({ }, { $set: { announce: foundObj.announce.filter(e => e !== req.body.roleid) } });
            break;
          case "autorole":
            if(perms.autorole.includes(req.body.roleid)) await db.collection("perms").updateOne({ }, { $set: { autorole: foundObj.autorole.filter(e => e !== req.body.roleid) } });
            break;
          case "citizen":
            if(perms.citizen.includes(req.body.roleid)) await db.collection("perms").updateOne({ }, { $set: { citizen: foundObj.citizen.filter(e => e !== req.body.roleid) } });
            break;
          case "clear":
            if(perms.clear.includes(req.body.roleid)) await db.collection("perms").updateOne({ }, { $set: { clear: foundObj.clear.filter(e => e !== req.body.roleid) } });
            break;
          case "gcancel":
            if(perms.gcancel.includes(req.body.roleid)) await db.collection("perms").updateOne({ }, { $set: { gcancel: foundObj.gcancel.filter(e => e !== req.body.roleid) } });
            break;
          case "gcheck":
            if(perms.gcheck.includes(req.body.roleid)) await db.collection("perms").updateOne({ }, { $set: { gcheck: foundObj.gcheck.filter(e => e !== req.body.roleid) } });
            break;
          case "gend":
            if(perms.gend.includes(req.body.roleid)) await db.collection("perms").updateOne({ }, { $set: { gend: foundObj.gend.filter(e => e !== req.body.roleid) } });
            break;
          case "giveaway":
            if(perms.giveaway.includes(req.body.roleid)) await db.collection("perms").updateOne({ }, { $set: { giveaway: foundObj.giveaway.filter(e => e !== req.body.roleid) } });
            break;
          case "greroll":
            if(perms.greroll.includes(req.body.roleid)) await db.collection("perms").updateOne({ }, { $set: { greroll: foundObj.greroll.filter(e => e !== req.body.roleid) } });
            break;
          case "uncitizen":
            if(perms.uncitizen.includes(req.body.roleid)) await db.collection("perms").updateOne({ }, { $set: { uncitizen: foundObj.uncitizen.filter(e => e !== req.body.roleid) } });
            break;
        
          default:
            break;
        }

      console.log("\x1b[31m", `» ${req.clientIp} (ADMIN) ${user} removed ${req.body.roleid} from perms.${req.body.cmd}!`, "\x1b[0m", "");
      return res.json({ success: "remove", redirect: `//${req.hostname}/${req.body.cmd}?success=remove` });
    } else {
      console.log("\x1b[35m", `» ${req.clientIp} (USER) ${user} tried POSTing to /remove, but failed!`, "\x1b[0m", "");
      return res.json({ success: "error", redirect: `//${req.hostname}/` });
    }
  }
    
	} else return res.json({ success: "error", redirect: `//${req.hostname}/` });
}