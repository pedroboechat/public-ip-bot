# Public IP BOT

## Table of contents

- [Introduction](#introduction)
- [Configuration](#config)

<h2 id="introduction"> Introduction </h2>

This repository contains the code for a program that updates your domain's DNS on [GoDaddy](https://www.godaddy.com/) and [Freenom](https://www.freenom.com/) based on your current IP. The motivation was to help updating the domain DNS in home servers, with dynamic ISP IPs. It was made in a way that, with the help of a job scheduler such as [CRON](https://en.wikipedia.org/wiki/Cron), it will run in a given time frame on your server to check for its current public IP, compare with the last IP logged and, in case of change, update the DNS registry for your domains.

<h2 id="config"> Configuration </h2>

1. Environment variables (`.env`)

   The `example.env` file needs to be renamed to simply `.env` and edited:

   - GoDaddy API key and secret. You can get yours [here](https://developer.godaddy.com/keys/).

```bash
# API key
GD_KEY=''

# API secret
GD_SEC=''
```

   - Freenom user credentials. The same ones used to [log into your account](https://my.freenom.com/clientarea.php).

```bash
# User email
FN_USER=''

# User password
FN_PSWD=''
```

   - Telegram BOT token and chat id. Learn how to create or find yours [here](https://medium.com/@ManHay_Hong/how-to-create-a-telegram-bot-and-send-messages-with-python-4cf314d9fa3e#7ae0).

```bash
# BOT token
TG_TOKEN=''

# Chat ID
TG_CHATID=''
```

2. Configuration file (`config.json`)

   The `example.config.json` file needs to be renamed to simply `config.json` and edited:

   - Both JSON's `godaddy` and `freenom` keys have an object as their values. The keys of these objects need to be your domain names with its TLD for each domain plataform. Their values are an array containing the subdomains you want to update. There are special subdomains `@` for no subdomain (e.g. `domain.com`) and `*` for the wildcard subdomains (i.e. any subdomain under that domain). The wildcard subdomain can only be used with GoDaddy domains.
   - In the `example.config.json`, there is the configuration for updating `example.com` domain (registered at GoDaddy) for its root (`example.com` itself) its wildcard subdomains (`*.example.com`) and `subdomain.example.com`. Also, there is the configuration for updating `example.tk` (registered at Freenom) for its root (`example.tk` itself), and both `www.example.tk` and `subdomain.example.tk` subdomains.



