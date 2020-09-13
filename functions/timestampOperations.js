const twoHours = 2 * 60 * 60//5 //2 * 60 * 60
const twoHoursFiveMins = twoHours + 5 * 60//15 //twoHours + 5 * 60
const oneHourFiftyFive = twoHours - 5 * 60

exports.twoHours = twoHours;
exports.twoHoursFiveMins = twoHoursFiveMins;
exports.oneHourFiftyFive = oneHourFiftyFive;

exports.moreThanTwoHoursAndFiveMins = (timestampStart, timestampNow) => {
    return (timestampNow - timestampStart > twoHoursFiveMins ? true : false)
}

validExtend = (timestampStart, timestampNow) => {
    return moreThanTwoHoursAndFiveMins(timestampStart, timestampNow)
}

exports.secondsBetweenTimestamps = (timestampStart, timestampNow) => {
    return timestampNow - timestampStart
}