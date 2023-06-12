# Holy Unblocker website

## Who/What this repository is for

This repository contains the base Holy Unblocker website. This includes tools and dependencies used to compile the website (Webpack, React) and development tools (ESLint, Prettier).

This repository should not be ran alone. There are several dependencies that require configuration.

If you are a developer, this repository is ideal for testing commits and building for production.

If you are just looking to self-host/deploy Holy Unblocker, check out [website-aio](https://github.com/holy-unblocker/website-aio).

## Scripts

In the project directory, you can run:

### **npm run dev**

> Starts the Vite development server.

You need to run the dev command again in order to rebuilt the proxy configs because they're built before the vite dev server starts.

### **npm run build**

> Builds the Vite app.

### **npm start**

> Starts the static webserver.

Output is found in the `dist` folder.

## Prerequisites

## APIs

This project depends on the following APIs/scripts:

- [DB server](https://github.com/holy-unblocker/db-server)
- [Theatre](https://github.com/holy-unblocker/theatre)
- [Bare Server Node](https://github.com/tomphttp/bare-server-node)
- [Rammerhead](https://github.com/binary-person/rammerhead)

Everything with the exception of Rammerhead are either automatically setup in the Vite dev server or proxied to the official holyubofficial.net instance.

### Recommended VSC Extensions

- [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)

### Recommended Chromium extensions

Protections against clickjacking and CORS prevents the website running locally from interacting with other scripts such as Rammerhead. These extensions will circumvent these protections for development.

- [CORS unblock](https://chrome.google.com/webstore/detail/cors-unblock/lfhmikememgdcahcdlaciloancbhjino)
- [Ignore X-Frame headers](https://chrome.google.com/webstore/detail/ignore-x-frame-headers/gleekbfjekiniecknbkamfmkohkpodhe)
