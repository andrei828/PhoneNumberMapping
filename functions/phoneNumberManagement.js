// exports.phoneNumbers = {
// 	'100': false,
// 	'102': false,
// 	'104': true,
// }

servicePhoneNumbers = ["100", "102", "104", "106", "108", "110"]

exports.getServicePhoneNumber = () => {
	
	if (servicePhoneNumbers.length === 0)
		return null
	
	return servicePhoneNumbers
		.splice(Math.floor(Math.random()
		* servicePhoneNumbers.length), 1)[0];
}

exports.freeServicePhoneNumber = (servicePhoneNum) => {
	servicePhoneNumbers.push(servicePhoneNum)
}