// Configure .env
require("dotenv").config();

// Require libraries
const fs = require("fs");

// Require helper functions
const helpers = require("./helpers");

exports.default = async (config) => {
  // Check for available configuration
  const gd_enabled = Object.keys(config.godaddy).length > 0;
  const fn_enabled = Object.keys(config.freenom).length > 0;
  console.log(gd_enabled, fn_enabled);

  const last_ip = helpers.get_log_ip();
  const current_ip = await helpers.get_current_ip();

  console.log(last_ip, current_ip);

  if (current_ip !== last_ip) {
    // Send new IP to Telegram
    await helpers.send_telegram_message(`${current_ip}`);

    // Update GoDaddy domains
    if (gd_enabled) {
      const godaddy = require("godaddy-dns");
      for (let gd_domain of Object.keys(config.godaddy)) {
        try {
          const gd_records = [];
          for (let gd_subdomain of config.godaddy[gd_domain]) {
            gd_records.push({
              "type": "A",
              "name": `${gd_subdomain}`,
              "ttl": 600
            });
          }
          godaddy.updateRecords(
            current_ip,
            {
              "apiKey": `${process.env.GD_KEY}`,
              "secret": `${process.env.GD_SEC}`,
              "domain": `${gd_domain}`,
              "records": gd_records
            }
          );
          helpers.send_telegram_message(
            `${gd_domain} updated!`
          );
        }
        catch (e) {
          helpers.send_telegram_message(
            `${gd_domain} failed to update...\n${e}`
          );
        }
      }
    }

    // Update Freenom domains
    if (fn_enabled) {
      const freenom = require("freenom-dns").init(
        process.env.FN_USER,
        process.env.FN_PSWD
      );
      for (let fn_domain of Object.keys(config.freenom)) {
        for (let fn_subdomain of config.freenom[fn_domain]) {
          await freenom.dns.setRecord(
            `${fn_subdomain.replace("@", "").toUpperCase()}.${fn_domain}`,
            "A",
            `${current_ip}`,
            300
          )
          .then(() => {
            helpers.send_telegram_message(
              `${fn_subdomain.replace("@", "")}${
                (fn_subdomain === "@") ? "." : ""
              }${fn_domain} updated!`
            );
          })
          .catch((e) => {
            helpers.send_telegram_message(
              `${fn_subdomain.replace("@", "")}.${fn_domain} failed to update...\nReason:${
                e[0].reason}`
            );
          });
        }
      }
    }

    // Saves current ip into the log file
    helpers.set_log_ip(current_ip);
  }
}
