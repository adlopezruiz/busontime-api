const { getAllLinesFromDB, getLineFromDB, createNewLineInDB, updateLineInDB, deleteLineFromDB } = require('../services/busLineService');

//Get all
const getLines = async (req, res) => {
    try {
        const linesData = await getAllLinesFromDB() || [];
        
        if (linesData.length == 0) res.send({status: 'OK', data: 'No hay resultados'});
        else res.send({status: 200, data: linesData})
    } catch (error) {
        console.error('Error fetching lines: ', error);
        res.status(500).json({ error: 'Internal Server Error'});
    }
};

//Get one
const getLine = async (req,res) => {

    const {
        params: { lineId },
    } = req;

    if (!lineId) {
        res.status(400).send({
            status: 'FAILED',
            data: { error: "Parameter 'lineId' is empty"}
        });
    }
    try {
        const line = await getLineFromDB(lineId);
        res.send({ status: 200, data: line });
    } catch (error) {
    res.status(error?.status || 500 ).send({ status: 'FAILED', data: { error: error?.message || error } });
    }
};

//Create one
const createNewLine = async (req,res) => {

    const { body } = req;

    if (
        !body.name ||
        !body.schedule
        ) {
            res.status(400).send({
                status: 'FAILED',
                data: { error: 'One of the keys is missing.' }
            });
            return;
        }
    
        const newLine = {
            name: body.name,
            schedule: body.schedule,
            createdAt: Date.now(),
        };

    try {
        const createdLine = await createNewLineInDB(newLine);
        res.status(201).send({
            status: 201,
            data: createdLine
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
const updateLine = async (req,res) => {

    const {
        body,
        params: { lineId },
    } = req

    if (!lineId) {
        res.status(400).send({
            status: 'FAILED',
            data: {
                error: "Parameter lineId is empty",
            }
        });
    }

    try {
        
        const updatedLine = await updateLineInDB(lineId, body);
        res.send({
            status: 200, data: updatedLine
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
const deleteLine = async (req,res) => {

    const {
        params : { lineId },
    } = req;

    if (!lineId) {
        res
          .status(400)
          .send({
            status: "FAILED",
            data: { error: "Parameter 'lineId' is empty" },
          });
      }
      try {
        await deleteLineFromDB(lineId);
        res.status(201).send({ status: "Deleted" });
      } catch (error) {
        res
          .status(error?.status || 500)
          .send({ status: "FAILED", data: { error: error?.message || error } });
      }
};

//Get today requested schedule to Martos from the actual stop name
const getTodaySchedule = async (req,res) => {
    const {
        query : { lineId, stopName, direction },
    } = req;

    if (!lineId || !stopName || !direction) {
        res.status(400).send({
            status : "FAILED",
            data: {error : 'One of the parameters is missing'},
        })
    }

    try {
         //Martos outbound, Jaen inbound rembember
        const line = await getLineFromDB(lineId);

        //Getting today name of day and hoy
        let currentDay = new Date().getDay();
        let dayName;
        switch(currentDay) {
            case 0:
                dayName = 'sundays';
                break;
            case 1:
            case 2:
            case 3:
            case 4:
            case 5:
                dayName = 'weekdays';
                break;
            case 6:
                dayName = 'saturdays';
                break;

        }
         //Now searching schedule by location and name of day to get the hours
        let schedule = [];
        if (direction === 'martos') {
            schedule = line.schedule['toMartos'][`${dayName}`][`${stopName}`];
        }else {
            schedule = line.schedule['toJaen'][`${dayName}`][`${stopName}`];
        }
        
        //Send schedule
        res.send({data: schedule });
        
        
    } catch (error) {
        res.status(error?.status || 500).send({ status : "FAILED", data: { error: error?.message || error } });
    }
};

//Get today requested schedule to Jaen from the actual stop name

module.exports = { getLines, getLine, createNewLine, updateLine, deleteLine, getTodaySchedule };