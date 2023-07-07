const admin = require('../firebase');
const db = admin.firestore();
const stopsRef = db.collection('stops');

//Get all stops
const getAllStopsFromDB = async () => {
    const snapshot = await stopsRef.get();

    const stops = [];

    snapshot.forEach((doc) => {
        const stopData = doc.data();
        stopData.id = doc.id;
        stops.push(stopData);
    });

    return stops;
}

//Get one stops
const getStopFromDB = async (stopId) => {
    
    let foundStop;

    await stopsRef.doc(stopId).get().then((result) => {
        if (result.empty) {
            throw {
                status: 400,
                message: 'Stop not found',
            };
        }

        foundStop = {
            id: result.id,
            ...result.data(),
        }
    }).catch((error) => {
        throw {
            status: error?.status || 500, message: error?.message || error
        };
    });
    return foundStop;
}

//Create new stop
const addStopToDB = async (newStop) => {
    await stopsRef.add(newStop).catch((error) => {
        throw { status: 500, message: error?.message || error};
    });
}

//Update one stop
const updateStopInDB = async (stopId, changes) => {

    let foundStop;

    await stopsRef.doc(stopId).get().then(async (result) => {
        if (result.empty) {
            throw {
                status: 400,
                message: `Stop not found`,
            };
        }else {
        
            foundStop = {
                ...result.data(),
                ...changes,
                updatedAt: new Date().toLocaleString('es-ES'),
            }

            await stopsRef.doc(stopId).update(foundStop);
            
        }
    }).catch((error) => {
        throw { status: 500, message: error?.message || error };
    });
    return foundStop;

}

//Delete stop
const deleteStopFromDB = async (stopId) => {
    await stopsRef.doc(stopId).delete();
}

module.exports = { getAllStopsFromDB, getStopFromDB, addStopToDB, updateStopInDB, deleteStopFromDB }