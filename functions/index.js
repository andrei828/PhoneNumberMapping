const fireStore = require('./firestoreCRUD')
const tOps = require('./timestampOperations')
const functions = require('firebase-functions')
const numberHandler = require('./phoneNumberManagement')
const _req = require('request')

/* TODO: Make this env variables */
const timeoutReqUrl = 'http://localhost:3001/timer'
const removePhoneUrl = 'http://localhost:5001/generate-phone-number/us-central1/removePhoneNum'

exports.helloWorld = functions.https.onRequest((request, response) => {
	// response.send("Hello from Firebase!");
	const data = request;
	console.log(data)
	
	_req.post({url:url, form: {"url":"http://localhost:5001/generate-phone-number/us-central1/helloWorld", "data": "123"}}, (err, res, body) => {
		if (err) { 
		response.send(err)
		return console.log(err)
		}
		response.send(body)
		console.log("DONE: ", body)  
  	})
});

/**
 * method to request a service phone number
 */
exports.useService = functions.https.onRequest(async (req, res) => {
	
	// Grab the text parameter.
	const userPhoneNum = req.query.phone;
	const phoneHashTable = await fireStore.getDocument(
		'phoneManagement', 'phoneAvailability', functions.logger
	)
	
	/* there is no mapping for this number so
	   we'll go ahead and add it to Firestore */
	if (phoneHashTable === null || 
		phoneHashTable.data()[userPhoneNum] === undefined) {
		
		mapPhoneNumber(userPhoneNum, res)
	}
	/* the user tried to extend its reservation period 
	   and we'll do so if he meets the requirements */
	else {

		extendPhoneBurrow(userPhoneNum, phoneHashTable.data()[userPhoneNum][0])
		res.send("TODO: extend the rezervation period")
	}
})

exports.removePhoneNum = functions.https.onRequest(async (req, res) => {

	/* phone number to remove */
	const userPhoneNum = req.body.data

	functions.logger.info("Trying to remove the filed...")
	const isValidForRemoval = await fireStore.validRemoval(
		'phoneManagement', 'phoneAvailability', userPhoneNum, functions.logger)

	if (isValidForRemoval === null) {
		/* error handling here */
		functions.logger.error("An error occured")
		res.json({result: `Failed to remove phone number`})

	} else if (isValidForRemoval.canRemove === true) {
		/* can delete the reservation now */
		try {
			await fireStore.removeField('phoneManagement', 
			'phoneAvailability', userPhoneNum, functions.logger)
			
			numberHandler.freeServicePhoneNumber(
				isValidForRemoval.userPhoneNum)
		} catch (error)  {
			functions.logger.error(error)
			res.json({result: `Failed to remove phone number: ${userPhoneNum}`})
		}
	} else {
		/* else just ignore the removal action */
		res.json({result: `Ignoring the rquest :)`})
	}
})

getOpenPhoneNum = async () => {
	try {
		const servicePhoneNum = numberHandler.getServicePhoneNumber()
		
		if (servicePhoneNum === null) {
			functions.logger.warn("No more service numbers available")
			return ""
		}

		return servicePhoneNum
		
	} catch (error) {
		functions.logger.error(error)
		return ""
	}
}

requestTimeout = async (urlToCall, time, userPhoneNum) => {
	_req.post({
		url: timeoutReqUrl,
		form: {
			time: time,
			data: userPhoneNum,
			url: urlToCall
		}
	}, (err, res, body) => {
		if (err) { 
			functions.logger.error(err)
		}
		functions.logger.info("Sent a timeoutRequest: ", body)  
  	})
}

/**
 * Take the text parameter passed to this HTTP endpoint and insert it into
 * Cloud Firestore under the path /messages/:documentId/original
 */
mapPhoneNumber = async (userPhoneNum, res) => {
	try {
		const servicePhoneNum = await getOpenPhoneNum(userPhoneNum)
		const writeTimeStamp = await fireStore.addField('phoneManagement', 
		'phoneAvailability', userPhoneNum, servicePhoneNum, functions.logger)
		
		/* replacing set timeout with a request */
		/* setTimeout(removePhoneNum, 20000, userPhoneNum) */
		requestTimeout(removePhoneUrl, tOps.twoHours * 1000, userPhoneNum)
		res.json({result: `Message added at timestamp: ${writeTimeStamp._seconds}`})
	} catch (error) {
		res.json({result: `Failed to add the phoneNumber: ${userPhoneNum}`})
	}
};

extendPhoneBurrow = async (userPhoneNum, servicePhoneNum) => {
	const isValidForExtension = await fireStore.validExtendReservation(
	'phoneManagement', 'phoneAvailability', userPhoneNum, functions.logger)

	if (isValidForExtension === null) {
		/* error handling here */
		functions.logger.error("An error occured")

	} else if (isValidForExtension === true) {
		/* can delete the reservation now */
		try {
			await fireStore.updateField('phoneManagement', 
			'phoneAvailability', userPhoneNum, servicePhoneNum, functions.logger)

			/* replacing set timeout with a request */
			/* setTimeout(removePhoneNum, 20000, userPhoneNum); */
			requestTimeout(removePhoneUrl, tOps.twoHours * 1000, userPhoneNum)
		} catch (error)  {
			functions.logger.error(error)
		}
	}
};

// Listens for new messages added to /messages/:documentId/original and creates an
// uppercase version of the message to /messages/:documentId/uppercase
// exports.makeUppercase = functions.firestore.document('/messages/{documentId}')
//     .onCreate((snap, context) => {
//       // Grab the current value of what was written to Cloud Firestore.
//       const original = snap.data().original;

//       // Access the parameter `{documentId}` with `context.params`
//       functions.logger.log('Uppercasing', context.params.documentId, original);
      
//       const uppercase = original.toUpperCase();
      
//       // You must return a Promise when performing asynchronous tasks inside a Functions such as
//       // writing to Cloud Firestore.
//       // Setting an 'uppercase' field in Cloud Firestore document returns a Promise.
//       return snap.ref.set({uppercase}, {merge: true});
//     });
