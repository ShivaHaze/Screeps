var pathfinder = require('pathfinder');

var roleMiner = {
    run: function(creep) {
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
            }
        }

        if (creep.store.getFreeCapacity() == 0) {
            creep.drop(RESOURCE_ENERGY);
        }
    }
};

function updateCurrentRoom(creep) {
    if (creep.memory.currentRoom !== creep.room.name) {
        creep.memory.currentRoom = creep.room.name;
    }
}

module.exports = roleMiner;

