var pathfinder = require('pathfinder');

var rolePioneer = {
    run: function(creep) {
        updateCurrentRoom(creep);
        pathfinder.avoidRoomEdges(creep);

        if (creep.memory.targetRoom && creep.room.name !== creep.memory.targetRoom) {
            let exit = creep.room.findExitTo(creep.memory.targetRoom);
            creep.moveTo(creep.pos.findClosestByRange(exit)); // Using standard moveTo for exiting the room
        } else {
            if (creep.store[RESOURCE_ENERGY] === 0) {
                creep.memory.harvesting = true;
            }
            if (creep.store.getFreeCapacity() === 0) {
                creep.memory.harvesting = false;
            }

            if (creep.memory.harvesting) {
                let source = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
                if (source) {
                    if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
                        let path = pathfinder.findOptimalPath(creep, source);
                        creep.moveByPath(path.path);
                    }
                } else {
                    console.log(`${creep.name} cannot find a source to harvest`);
                }
            } else {
                let target = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
                if (target) {
                    if (creep.build(target) == ERR_NOT_IN_RANGE) {
                        let path = pathfinder.findOptimalPath(creep, target);
                        creep.moveByPath(path.path);
                    }
                } else {
                    if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                        let path = pathfinder.findOptimalPath(creep, creep.room.controller);
                        creep.moveByPath(path.path);
                    } else {
                        console.log(`${creep.name} has nothing to build and cannot upgrade controller`);
                    }
                }
            }
        }
    }
};

function updateCurrentRoom(creep) {
    if (creep.memory.currentRoom !== creep.room.name) {
        creep.memory.currentRoom = creep.room.name;
    }
}

module.exports = rolePioneer;

