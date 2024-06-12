var pathfinder = require('pathfinder');

var rolePowerHarvester = {
    run: function(creep) {
        pathfinder.avoidRoomEdges(creep);

        updateCurrentRoom(creep);

        if (!creep.memory.powerBankId) {
            let powerBanks = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => structure.structureType == STRUCTURE_POWER_BANK
            });
            if (powerBanks.length) {
                creep.memory.powerBankId = powerBanks[0].id;
            }
        }

        let powerBank = Game.getObjectById(creep.memory.powerBankId);
        if (powerBank) {
            if (creep.attack(powerBank) == ERR_NOT_IN_RANGE) {
                let path = pathfinder.findOptimalPath(creep, powerBank);
                creep.moveByPath(path.path);
            }
        } else {
            let rallyPoint = Game.flags[creep.memory.rallyPointName];
            if (rallyPoint) {
                moveToRallyPoint(creep, rallyPoint);
            }
        }
    }
};

function updateCurrentRoom(creep) {
    if (creep.memory.currentRoom !== creep.room.name) {
        creep.memory.currentRoom = creep.room.name;
    }
}

function moveToRallyPoint(creep, rallyPoint) {
    if (creep.room.name !== rallyPoint.pos.roomName) {
        let path = pathfinder.findOptimalPath(creep, new RoomPosition(25, 25, rallyPoint.pos.roomName));
        creep.moveByPath(path.path);
    } else {
        let path = pathfinder.findOptimalPath(creep, rallyPoint);
        creep.moveByPath(path.path);
    }
}

module.exports = rolePowerHarvester;

