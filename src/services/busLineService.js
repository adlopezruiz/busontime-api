const admin = require('../firebase');
const db = admin.firestore();
const linesRef = db.collection('lines');

//Get all lines
const getAllLinesFromDB = async () => {
    const snapshot = await linesRef.get();

    const lines = [];

    snapshot.forEach((doc) => {
        const lineData = doc.data();
        lineData.id = doc.id;
        lines.push(lineData);
    });

    return lines;
}

//Get line
const getLineFromDB = async (lineId) => {
    
    let foundLine;

    await linesRef.doc(lineId).get().then((result) => {
        if (result.empty) {
            throw {
                status: 400,
                message: 'BusLine not found',
            };
        }
        
        foundLine = {
            id: result.id,
            ...result.data(),
        }
    }).catch((error) => {
        throw {
            status: error?.status || 500, message: error?.message || error
        };
    });
    return foundLine;
}

//Create new line
const createNewLineInDB = async (newLine) => {

    await linesRef.add(newLine).catch((error) => {
        throw { status: 500, message: error?.message || error};
    });
    
}

//Update a line
const updateLineInDB = async (lineId, changes) => {

    let foundLine;

    await linesRef.doc(lineId).get().then(async (result) => {
        if (result.empty) {
            throw {
                status: 400,
                message: `BusLine not found`,
            };
        }else {
        
            foundLine = {
                ...result.data(),
                ...changes,
                updatedAt: new Date().toLocaleString('es-ES'),
            }

            await linesRef.doc(lineId).update(foundLine);
            
        }
    }).catch((error) => {
        throw { status: 500, message: error?.message || error };
    });
    return foundLine;

}

//Delete a line
const deleteLineFromDB = async (lineId) => {
    await linesRef.doc(lineId).delete();
}


//Exports

module.exports = { getAllLinesFromDB, getLineFromDB, createNewLineInDB, updateLineInDB, deleteLineFromDB};