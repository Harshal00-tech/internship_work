const express = require("express");
const session = require("express-session");
const { Issuer, generators } = require("openid-client");

const app = express();
let client;

// Initialize OpenID Client
async function initializeClient() {
	const issuer = await Issuer.discover(
		"https://cognito-idp.ap-south-1.amazonaws.com/ap-south-1_xTxk7Oo64"
	);
	client = new issuer.Client({
		client_id: "243pd67tn8kjjhdrnugpt9mk6k",
		client_secret: "1f8ekrcacmprsp5jou40co06mt3p52paijbhv9idhiiltgqdhpjc",
		redirect_uris: ["http://localhost:3000"], // Updated Redirect URI
		response_types: ["code"],
	});
}
initializeClient().catch(console.error);

app.use(
	session({
		secret: "some secret",
		resave: false,
		saveUninitialized: false,
	})
);

const checkAuth = (req, res, next) => {
	req.isAuthenticated = !!req.session.userInfo;
	next();
};

// Home route
app.get("/", checkAuth, (req, res) => {
	res.render("home", {
		isAuthenticated: req.isAuthenticated,
		userInfo: req.session.userInfo,
	});
});

// Login route
app.get("/login", (req, res) => {
	const nonce = generators.nonce();
	const state = generators.state();

	req.session.nonce = nonce;
	req.session.state = state;

	const authUrl = client.authorizationUrl({
		scope: "phone openid email",
		state: state,
		nonce: nonce,
	});

	console.log("Redirecting to Auth URL:", authUrl); // ✅ Log the URL before redirection
	res.redirect(authUrl);
});

// Redirect URL (callback) - Now Logs Token
app.get("/callback", async (req, res) => {
	try {
		const params = client.callbackParams(req);
		const tokenSet = await client.callback(
			"http://localhost:3000/callback", // Updated redirect URI
			params,
			{
				nonce: req.session.nonce,
				state: req.session.state,
			}
		);

		console.log("\n✅ Authentication Successful!");
		console.log("🔹 Access Token:", tokenSet.access_token);
		console.log("🔹 ID Token:", tokenSet.id_token);
		console.log("🔹 Refresh Token:", tokenSet.refresh_token);

		const userInfo = await client.userinfo(tokenSet.access_token);
		req.session.userInfo = userInfo;

		console.log("\n🔹 User Info:", userInfo); // ✅ Log user info

		res.redirect("/");
	} catch (err) {
		console.error("❌ Callback error:", err);
		res.redirect("/");
	}
});

// Logout route
app.get("/logout", (req, res) => {
	req.session.destroy();
	const logoutUrl = `https://<user-pool-domain>/logout?client_id=243pd67tn8kjjhdrnugpt9mk6k&logout_uri=http://localhost:3000`;
	console.log("\n🔹 Logging out, Redirecting to:", logoutUrl);
	res.redirect(logoutUrl);
});

app.set("view engine", "ejs");

app.listen(3000, () => {
	console.log("🚀 App is running on port 3000");
});
