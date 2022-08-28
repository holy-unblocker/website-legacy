# Holy Unblocker website

# Who/What this repository is for

This repository contains the base Holy Unblocker website. This includes tools and dependencies used to compile the website (Webpack, React) and development tools (ESLint, Prettier).

This repository should not be ran alone. There are several dependencies that require configuration.

If you are a developer, this repository is ideal for testing commits and building for production.

If you are just looking to self-host/deploy Holy Unblocker, check out [website-aio](https://github.com/e9x/website-aio).

# Prerequisites

## APIs

This project depends on the following APIs/scripts:

- [DB server](https://git.holy.how/holy/db-server) (ran on port 3001)
- [Theatre](https://git.holy.how/holy/theatre) (webserver on `public`, ran on port 3002)
- [Bare Server Node](https://github.com/tomphttp/bare-server-node) (ran on port 8001)
- [Rammerhead](https://github.com/binary-person/rammerhead) (ran on port 8002)

## Rammerhead config

`src/config.js`:

```js
// ...
	port: 8002,
	crossDomainPort: 8003,
// ...
// ON PRODUCTION SERVER (SSL) (PROXY PASSED BY NGINX)
	getServerInfo: (req) => {
		return { hostname: new URL(`https://${req.headers.host}`).hostname, port: 443, crossDomainPort: 443, protocol: 'https:' };
	},
// ON DEVELOPMENT SERVER
	getServerInfo: () => ({ hostname: new URL(`https://${req.headers.host}`).hostname, port: 8002, crossDomainPort: 8002, protocol: 'http:' }),
// ...
	password: null,
// ...
```

## Recommended VSC Extensions

- [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)

## Recommended Chromium extensions

Protections against clickjacking and CORS prevents the website running locally from interacting with other scripts such as Rammerhead. These extensions will circumvent these protections for development.

- [CORS unblock](https://chrome.google.com/webstore/detail/cors-unblock/lfhmikememgdcahcdlaciloancbhjino)
- [Ignore X-Frame headers](https://chrome.google.com/webstore/detail/ignore-x-frame-headers/gleekbfjekiniecknbkamfmkohkpodhe)

# Scripts

In the project directory, you can run:

## **npm run dev**

> Starts the React development server.

By default, the development server listens on [http://localhost:3000](http://localhost:3000).

## **npm run build**

> Builds the React app.

## **npm start**

> Starts the static webserver.

Output is found in the `build` folder.
