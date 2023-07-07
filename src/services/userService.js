const admin = require('../firebase');
const db = admin.firestore();
const usersRef = db.collection('users');

//Get all users
const getAllUsersFromDB = async () => {
    const snapshot = await usersRef.get();

    const users = [];

    snapshot.forEach((doc) => {
        const userData = doc.data();
        userData.id = doc.id;
        users.push(userData);
    });

    return users;
}

//Get one user
const getUserFromDb = async (userId) => {
    
    let foundUser;

    await usersRef.doc(userId).get().then((result) => {
        if (result.empty) {
            throw {
                status: 400,
                message: 'User not found',
            };
        }

        foundUser = {
            id: result.id,
            ...result.data(),
        }
    }).catch((error) => {
        throw {
            status: error?.status || 500, message: error?.message || error
        };
    });
    return foundUser;
}

//Update one user
const updateUserFromDB = async (userId, changes) => {

    let foundUser;

    await usersRef.doc(userId).get().then(async (result) => {
        if (result.empty) {
            throw {
                status: 400,
                message: `User not found`,
            };
        }else {
            
            
            foundUser = {
                ...result.data(),
                ...changes,
                updatedAt: Date.now(),
            }

            await usersRef.doc(userId).update(foundUser);
        }
    }).catch((error) => {
        throw { status: 500, message: error?.message || error };
    });
    return foundUser;

}

//Delete one user
const deleteUserFromDB = async (userId) => {
    await usersRef.doc(userId).delete();
} 

//Exports

module.exports = { getAllUsersFromDB, getUserFromDb, updateUserFromDB, deleteUserFromDB }