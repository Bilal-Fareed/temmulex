// import admin from "firebase-admin";
// import serviceAccount from "../../firebase-service-account.json" assert { type: "json" };

// admin.initializeApp({
// 	credential: admin.credential.cert(serviceAccount)
// });

const sendNotification = async (tokens = [], title, body, data = {}) => {
	// const message = {
	// 	notification: {
	// 		title,
	// 		body
	// 	},
	// 	data,
	// 	tokens
	// };
	// await admin.messaging().sendEachForMulticast(message);
}

export {
	sendNotification
}