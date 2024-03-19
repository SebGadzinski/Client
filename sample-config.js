const internalIp = require("internal-ip");
const fs = require("fs");

const ip = internalIp.v4.sync();
const useHTTPS = false;
const http = useHTTPS ? "https" : "http";
const isWin = process.platform === "win32";

let key, cert;
if (useHTTPS) {
	try {
		if (isWin) {
			(key = fs.readFileSync(`/path/${ip}.key`)),
				(cert = fs.readFileSync(`/path/${ip}.cert`));
		} else {
			(key = fs.readFileSync(`/path/key.key`)),
				(cert = fs.readFileSync(`/path/cert.cert`));
		}
	} catch (e) {}
}

// This is set up so I can make a production build from my windows computer
let options;
if (isWin) {
	options = {
		key: fs.readFileSync(`/path/key.key`),
		cert: fs.readFileSync(`/path/cert.cert`),
	};
} else {
	options = {
		key: fs.readFileSync(`/path/key.key`),
		cert: fs.readFileSync(`/path/cert.cert`),
	};
}

const env = {
	development: {
		devServer: {
			server: {
				type: http,
				options: {
					key,
					cert,
				},
			},
			open: true,
			port: 8080,
		},
		env: {
			SERVER_DOMAIN: `${http}://${ip}:5000/api`,
			STRIPE_PUBLIC_KEY_CATEGORY: `pk_test_***`,
		},
	},
	production: {
		devServer: {
			server: {
				type: "https",
				options,
			},
			port: 8080,
		},
		env: {
			SERVER_DOMAIN: `https://company.com/api`,
			STRIPE_PUBLIC_KEY_CLASSES: `pk_test_51Oh17DCLzO8sm51HS8DEToJcZ9rApPsChb4gOqhvaEjppEurRFO91DGJZgAXrMaq3RPfrLjRxWKhHdo7zPaw6fvD00mWXFrKQ9`,
			STRIPE_PUBLIC_KEY_SOFTWARE: `pk_test_51OTuPnKKWIvXkNEdw3BIXsxleNAgVpei1iQCA5Bc2AUhhzLJSOEr6ng3ezRrDbhnpNzgsiLaVp12zlv0Ogczc1kN00m6QTgo2a`,
			STRIPE_PUBLIC_KEY_PHOTOGRAPHY: `pk_test_51OTunWFOSEIM9vEtDA0ltHJ9ygY2ro2tmghMDP6NQUyUCJqpRJ1k9xTgNz2b8cbRmbL3Fj7w6FdWUzPOeJmsnwvc007qOznUbY`,
			STRIPE_PUBLIC_KEY_VIDEOGRAPHY: `pk_test_51OTupuGDD9i08mQtUcTlwvMLFCVyDTODJj18diZ3m2Ft4Mr9E1fgfNYZZkegkLo2qNyFP6Sfpy0JYghUFAOPpRyJ00KE0v2oRE`,
		},
	},
};

function getEnv(isDevelopment) {
	return isDevelopment ? env.development : env.production;
}

module.exports = getEnv;
