var pathfinder = require('pathfinder');

var roleRemoteHarvester = {
    run: function(creep) {
        pathfinder.avoidRoomEdges(creep);

        updateCurrentRoom(creep);

        if (!creep.memory.miningSourceId) {
            let sources = creep.room.find(FIND_SOURCES);
            creep.memory.miningSourceId = sources[0].id; // Simple assignment, can be improved
        }

        let source = Game.getObjectById(creep.memory.miningSourceId);
        if (source) {
            if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
                let path = pathfinder.findOptimalPath(creep, source);
                creep.moveByPath(path.path);
            } else {
                if (creep.store.getFreeCapacity() == 0) {
                    creep.drop(RESOURCE_ENERGY);
                }
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

module.exports = roleRemoteHarvester;

