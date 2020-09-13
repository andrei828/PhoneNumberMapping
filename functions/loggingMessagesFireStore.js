// TODO: write the logging file separately and add all functions from below
// 		 as lambda funcs to pass parameters

exports.WRITE_SUCCESS = (collection, document, field) => {
    return `Succesfully added the field [${field}] to collection ` +
            `[${collection}] from document [${document}] in firestore`
}

exports.WRITE_FAILURE = (collection, document, field) => {
    return `Failed to add the field [${field}] to collection ` +
            `[${collection}] from document [${document}] in firestore`
}

exports.READ_SUCCESS = (collection, document) => {
    return `Succesfully accessed the document [${document}] ` +
            `from collection [${collection}] in firestore`
}

exports.READ_FAILURE = (collection, document) => {
    return `Failed to access the document [${document}] ` +
            `from collection [${collection}] in firestore`
}

exports.DELETE_SUCCESS = (collection, document, field) => {
    return `Succesfully deleted the field [${field}] from document ` +
            `[${document}] from collection [${collection}] in firestore`
}

exports.DELETE_FAILURE = (collection, document, field) => {
    return `Failed to delete the field [${field}] from document ` +
            `[${document}] from collection [${collection}] in firestore`
}