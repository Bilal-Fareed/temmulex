const admin = require("firebase-admin");
const serviceAccount = require("./firebase-service-account.json");

admin.initializeApp({
	credential: admin.credential.cert(serviceAccount)
});

const sendNotification = async (tokens = [], title, body, data = {}) => {
	const message = {
		notification: {
			title,
			body
		},
		data,
		tokens
	};
	await admin.messaging().sendEachForMulticast(message);
}

export {
	sendNotification
}