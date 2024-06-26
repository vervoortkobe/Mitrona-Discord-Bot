const Discord = require("discord.js");
const fetch = require("node-fetch");

module.exports.run = async (client, message, args, db) => {
  
    let fetchedperms = await db.collection("perms").find().toArray();
    let perms = fetchedperms[0];

    if(perms.admin.includes(message.author.id)) {

      let {data} = await fetch;

      const mEmbed = new Discord.EmbedBuilder()
      .setColor(0x03a9f4)
      .setDescription(`... **|** ***Contacting geolocalisation API and waiting for response...***`)
      const m = await message.channel.send({ embeds: [ mEmbed ]});

      fetch(`http://ip-api.com/json/${args[0]}?fields=status,message,continent,continentCode,country,countryCode,region,regionName,city,district,zip,lat,lon,timezone,offset,currency,isp,org,as,asname,reverse,mobile,proxy,hosting,query`)
      .then(res => res.json()).then(data => {
        if(!data.status) {
          const errorEmbed = new Discord.EmbedBuilder()
          .setColor(0xf04947)
          .setDescription(`❌ **|** ***Error: Something went wrong! Please try again!***`)
          return message.channel.send({ embeds: [ errorEmbed ]});
        }

        if(!args[0]) {
          const usageEmbed = new Discord.EmbedBuilder()
          .setColor(0xf04947)
          .setTitle(`⚙️ | GeoIP`)
          .setDescription(`❌ **|** ***Usage: ${process.env.PREFIX}geoip <IP-address>***`)
          return message.channel.send({ embeds: [ usageEmbed ]});
        }

        if(data.status === "fail") {
          const errorEmbed = new Discord.EmbedBuilder()
          .setColor(0xf04947)
          .setDescription(`❌ **|** ***I couldn't locate the IP-address, because it isn't an IPv4 or an IPv6 or because it's an invalid IP address!***`)
          return message.channel.send({ embeds: [ errorEmbed ]});
        }

        m.delete();

        let mapimg = new Discord.AttachmentBuilder(`https://maps.geoapify.com/v1/staticmap?style=osm-liberty&width=1200&height=800&center=lonlat:${data.lon},${data.lat}&zoom=6&marker=lonlat:${data.lon},${data.lat};color:%23ff0000;size:medium&apiKey=${process.env.MAPAPIKEY}`, { name: "map.png", description: `${data.city},${data.region}` });

        let zip;
        if(data.zip === true) zip = data.zip;
        else zip = "❌";
        let org;
        if(data.org === true) org = data.org;
        else org = "❌";

        let mobile;
        if(data.mobile === true) mobile = `\`✅\` \`Yes\``;
        if(data.mobile === false) mobile = `\`❌\` \`No\``;
        let proxy;
        if(data.proxy === true) proxy = `\`✅\` \`Yes\``;
        if(data.proxy === false) proxy = `\`❌\` \`No\``;
        let hosting;
        if(data.hosting === true) hosting = `\`✅\` \`Yes\``;
        if(data.hosting === false) hosting = `\`❌\` \`No\``;

        const geoipEmbed = new Discord.EmbedBuilder()
        .setColor(0x03a9f4)
        .setTitle(`🌐 | GeoIP`)
        .setDescription(`**» IP Address:** \`${data.query}\`\n**» Continent:** \`${data.continent}\`, \`${data.continentCode}\`\n**» Country:** \`${data.country}\`, \`${data.countryCode}\`\n**» Region:** \`${data.regionName}\`, \`${data.region}\`\n**» Nearest Capital City:** \`${data.city}\`\n**» Postal ZIP Code:** \`${zip}\`\n**» Latitude - Longitude:** \`${data.lat}\` - \`${data.lon}\`\n**» Timezone:** \`${data.timezone.replace("_", " ")}\`\n**» Currency:** \`${data.currency}\`\n**» ISP:** \`${data.isp}\`, \`${org}\`\n**» Mobile | Proxy | Hosting:** ${mobile} | ${proxy} | ${hosting}`)
        .setImage("attachment://map.png")
        .setFooter({ iconURL: "https://avatars.githubusercontent.com/u/60292923?v=4", text: "Powered by Geoapify.com | Zoom: 6" })
        message.channel.send({ embeds: [ geoipEmbed ], files: [ mapimg ]})
        .then(message.react("🌐"));
      });
      
    } else {
      const permsErrorReplyEmbed = new Discord.EmbedBuilder()
      .setColor(0xff0000)
      .setDescription(`❌ **|** ***Error: You don't have the sufficient permissions to use this command!***`);
      return message.reply({ embeds: [ permsErrorReplyEmbed ] });
    }
  }

  module.exports.help = {
    name: "geoip",
    aliases: ["ip"],
    category: "advanced"
}
