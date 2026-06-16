module.exports = {
	apps: [
		{
			name: "my-app",
			script: "server.js",
			interpreter: "node",
			exec_mode: "fork",
			watch: false
		}
	]
};