import admin from "firebase-admin";
import serviceAccount from "../../temmluxe-2c76e-firebase-adminsdk-fbsvc-e37a5e673a.json" assert { type: "json" };

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