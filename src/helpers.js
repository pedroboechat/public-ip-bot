// Configure .env
require("dotenv").config();

// Require libraries
const fs = require("fs");
const axios = require("axios");

/**
 * Get the last IP from the log file.
 */
exports.get_log_ip = () => {
  try {
    return fs.readFileSync("./last_ip.log").toString();
  } catch (_) {
    return "";
  }
};

/**
 * Log the last IP into the log file.
 * @param  {String} ip The IP to log.
 */
exports.set_log_ip = (ip) => {
  try {
    fs.writeFileSync("./last_ip.log", ip);
    return true;
  } catch (_) {
    return false;
  }
};

/**
 * Get the last IP from the log file.
 */
exports.get_current_ip = () => {
  return axios.get("https://api.ipify.org/")
  .then((ipify) => {
    if (ipify.status === 200) {
      return ipify.data;
    } else {
      throw new Error();
    }
  })
  .catch((_) => {
    axios.get("https://ifconfig.me/")
    .then((ifconfig) => {
      if (ifconfig.status === 200) {
        return ifconfig.data;
      } else {
        throw new Error();
      }
    });
  });
};

/**
 * Send a message to Telegram conversations.
 * @param  {String} message  The message to be sent.
 */
exports.send_telegram_message = (message) => {
  if !!(message) {
    return axios.get(
      "https://api.telegram.org/bot"
      + `${process.env.TG_TOKEN}`
      + "/sendMessage?chat_id="
      + `${process.env.TG_CHATID}`
      + "&parse_mode=Markdown&text="
      + `${message}`
    )
    .then()
    .catch((e) => {
      console.error(`Couldn't send message to chat_id #${chat_id}.\n${e}`);
    });
  }
  else {
    console.error("Message is undefined.");
    process.exit(0);
  }
};
