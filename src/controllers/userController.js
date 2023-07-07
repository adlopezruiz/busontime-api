const { getAllUsersFromDB, getUserFromDb, updateUserFromDB, deleteUserFromDB } = require('../services/userService');

//Get all users
const getUsers = async (req, res) => {
    try {
        const usersData = await getAllUsersFromDB() || [];
        
        if (usersData.length == 0) res.send({status: 'OK', data: 'No hay resultados'});
        else res.send({status: 200, data: usersData})
    } catch (error) {
        console.error('Error fetchign users: ', error);
        res.status(500).json({ error: 'Internal Server Error'});
    }
};

//Get one user
const getUser = async (req,res) => {
    const {
        params: { userId },
    } = req;

    if (!userId) {
        res.status(400).send({
            status: 'FAILED',
            data: { error: "Parameter 'userId' is empty"}
        });
    }
    try {
        const user = await getUserFromDb(userId);
        res.send({ status: 200, data: user });
    } catch (error) {
    res.status(error?.status || 500 ).send({ status: 'FAILED', data: { error: error?.message || error } });
    }
};

//Update one user
const updateUser = async (req,res) => {
    

    const {
        body,
        params: { userId },
    } = req
    
    if (!userId) {
        res.status(400).send({
            status: 'FAILED',
            data: {
                error: "Parameter userId is empty",
            }
        });
    }

    try {
        const updatedUser = await updateUserFromDB(userId, body);
        res.send({
            status: 200, data: updatedUser
        });

    } catch (error) {
        res.status(error?.status || 500).send({
            status: 'FAILED',
            data: {
                error: error?.message || error
            }
        });
    }
};

//Delete one user
const deleteUser = async (req,res) => {

    const {
        params : { userId },
    } = req;

    if (!userId) {
        res
          .status(400)
          .send({
            status: "FAILED",
            data: { error: "Parameter 'userId' is empty" },
          });
      }
      try {
        await deleteUserFromDB(userId);
        res.status(201).send({ status: "OK" });
      } catch (error) {
        res
          .status(error?.status || 500)
          .send({ status: "FAILED", data: { error: error?.message || error } });
      }
};
//Exports
module.exports = {getUsers, getUser, updateUser, deleteUser};