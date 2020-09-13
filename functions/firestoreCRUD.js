/*
 * File that makes CRUD operations to FireStore db.
 * 
 * The admin instance is handling the connection to 
 * the Firebase Admin SDK to access Cloud Firestore.
 * 
 */

const log = require('./loggingMessagesFireStore')
const tOps = require('./timestampOperations')
const admin = require('firebase-admin')
admin.initializeApp()

/*
 * const data types needed 
 * throughout the operations below
 */
const Timestamp = admin.firestore.Timestamp
const FieldValue = admin.firestore.FieldValue

exports.Timestamp;
exports.FieldValue;

exports.addField = async (collection, document, key, value, logger) => {
	
	try {
		const tStamp = Timestamp.now()
		await admin
			.firestore()
			.collection(collection)
			.doc(document)
			.set({
				[key]: [value, tStamp]
			}, { merge: true })
		
		logger.log(log.WRITE_SUCCESS(collection, document, key))
		return tStamp

	} catch (error) {
		logger.error(
			log.WRITE_FAILURE(collection, document, key), 
			error
		)
		return null
	} 
	
}

exports.removeField = async (collection, document, key, logger) => {
	
	try {
		const removeDocument = await admin
			.firestore()
			.collection(collection)
			.doc(document)
			.update({
				[key]: FieldValue.delete()
			});

		logger.log(log.DELETE_SUCCESS(collection, document, key))		
		return removeDocument

	} catch (error) {		
		logger.error(
			log.DELETE_FAILURE(collection, document, key), 
			error
		)
		return null
	} 
}

exports.updateField = async (collection, document, key, value, logger) => {
		
	try {
		const tStamp = Timestamp.now()
		await admin
			.firestore()
			.collection(collection)
			.doc(document)
			.update({
				[key]: [value, tStamp]
			}, { merge: true })
		
		logger.log(log.WRITE_SUCCESS(collection, document, key))
		return tStamp

	} catch (error) {
		logger.error(
			log.WRITE_FAILURE(collection, document, key), 
			error
		)
		return null
	} 
	
}

exports.getDocument = async (collection, document, logger) => {

	try {
		const readDocument = await admin
			.firestore()
			.collection(collection)
			.doc(document)
			.get();

		if (readDocument.exists) {
			logger.log(log.READ_SUCCESS(collection, document))
			return readDocument	
		} else {
			logger.warn(log.READ_FAILURE(collection, document))
			return null;
		}

	} catch (error) {
		logger.error(log.READ_FAILURE(collection, document), error)
		return null
	}
}

exports.validExtendReservation = async (collection, document, phoneNum, logger) => {
	
	try {
		const creationTimeStamp = 
			(await this.getDocument(collection, document, logger))
			.data()[phoneNum][1]._seconds
		
		const tDiff = tOps.secondsBetweenTimestamps(
			creationTimeStamp, Timestamp.now()._seconds)
	
		if (tDiff < 20) 
			return true
		return false

		// console.log(tOps.twoHoursFiveMins)
		// if (tDiff < tOps.twoHours - 5)
		// 	return true;
		// else if (tDiff < tOps.twoHoursFiveMins)
		// 	return true;
		// else 
		// 	return false;

	} catch (error) {
		logger.error(log.READ_FAILURE(collection, document), error)
		return null
	}
}

exports.validRemoval = async (collection, document, phoneNum, logger) => {
	
	try {
		const doc = (await this.getDocument
		(collection, document, logger)).data()[phoneNum]

		const servicePhoneNum = doc[0]
		const creationTimeStamp	= doc[1]._seconds
		
		const tDiff = tOps.secondsBetweenTimestamps(
			creationTimeStamp, Timestamp.now()._seconds)
		
		if (tDiff > tOps.oneHourFiftyFive && tDiff < tOps.twoHoursFiveMins)
			return { canRemove: true, servicePhoneNum: servicePhoneNum }
		return { canRemove: false, servicePhoneNum: servicePhoneNum }

		// if (tDiff > 29 * 60000 && tDiff < 32 * 60000)
		// 	return { canRemove: true, servicePhoneNum: servicePhoneNum }
		// return { canRemove: false, servicePhoneNum: servicePhoneNum }

		
		// if (tDiff > 19 && tDiff < 23)
		// 	return { canRemove: true, servicePhoneNum: servicePhoneNum }
		// return { canRemove: false, servicePhoneNum: servicePhoneNum }

		// console.log(tOps.twoHoursFiveMins)
		// if (tDiff < tOps.twoHours - 5)
		// 	return true;
		// else if (tDiff < tOps.twoHoursFiveMins)
		// 	return true;
		// else 
		// 	return false;

	} catch (error) {
		logger.error(log.READ_FAILURE(collection, document), error)
		return null
	}
}
