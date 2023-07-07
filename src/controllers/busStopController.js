const { getAllStopsFromDB, getStopFromDB, addStopToDB, updateStopInDB, deleteStopFromDB} = require('../services/busStopService');

//Get all
const getStops = async (req, res) => {
    try {
        const stopsData = await getAllStopsFromDB() || [];
        
        if (stopsData.length == 0) res.send({status: 'OK', data: 'No hay resultados'});
        else res.send({status: 200, data: stopsData})
    } catch (error) {
        console.error('Error fetching stops: ', error);
        res.status(500).json({ error: 'Internal Server Error'});
    }
};

//Get one
const getStop = async (req,res) => {

    const {
        params: { stopId },
    } = req;

    if (!stopId) {
        res.status(400).send({
            status: 'FAILED',
            data: { error: "Parameter 'stopId' is empty"}
        });
    }
    try {
        const stop = await getStopFromDB(stopId);
        res.send({ status: 200, data: stop });
    } catch (error) {
    res.status(error?.status || 500 ).send({ status: 'FAILED', data: { error: error?.message || error } });
    }
};

//Create one
const addStop = async (req,res) => {

    const { body } = req;

    if (
        !body.name ||
        !body.location ||
        !body.street ||
        !body.line
        ) {
            res.status(400).send({
                status: 'FAILED',
                data: { error: 'One of the keys is missing.' }
            });
            return;
        }
    
        const newStop = {
            name: body.name,
            line: body.line,
            location: body.location,
            street: body.street,
            createdAt: new Date().toLocaleString('es-ES'),
        };

    try {
        const createdStop = await addStopToDB(newStop);
        res.status(201).send({
            status: 201,
            data: createdStop
        });
    } catch (error) {
        res.status(error?.status || 500).send({
            staus: 'FAILED',
            data: {
                error: error?.message || error
            }
        });
    }
};

//Update one
const updateStop = async (req,res) => {

    const {
        body,
        params: { stopId },
    } = req

    if (!stopId) {
        res.status(400).send({
            status: 'FAILED',
            data: {
                error: "Parameter stopId is empty",
            }
        });
    }

    try {
        
        const updatedStop = await updateStopInDB(stopId, body);
        res.send({
            status: 200, data: updatedStop
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

//Delete one
const deleteStop = async (req,res) => {

    const {
        params : { stopId },
    } = req;

    if (!stopId) {
        res
          .status(400)
          .send({
            status: "FAILED",
            data: { error: "Parameter 'stopId' is empty" },
          });
      }
      try {
        await deleteStopFromDB(stopId);
        res.status(201).send({ status: "Deleted" });
      } catch (error) {
        res
          .status(error?.status || 500)
          .send({ status: "FAILED", data: { error: error?.message || error } });
      }
};

module.exports = { getStops, getStop, addStop, updateStop, deleteStop };