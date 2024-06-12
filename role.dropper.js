var pathfinder = require('pathfinder');

let logging = false;

var roleDropper = {
    run: function(creep) {
        updateCurrentRoom(creep);

        let source = Game.getObjectById(creep.memory.sourceId);

        if (!source) {
            log(`${creep.name} has no valid source assigned with id ${creep.memory.sourceId}`);
            return;
        }

        let currentContainer = creep.pos.lookFor(LOOK_STRUCTURES).find(structure => structure.structureType == STRUCTURE_CONTAINER);

        if (currentContainer) {
            log(`${creep.name} is already on a container, continuing to harvest`);
            let harvestResult = creep.harvest(source);
            log(`${creep.name} harvest result: ${harvestResult}`);
            if (harvestResult == OK) {
                log(`${creep.name} is harvesting, dropping energy`);
                creep.drop(RESOURCE_ENERGY);
            }
            return;
        }

        let containers = source.pos.findInRange(FIND_STRUCTURES, 1, {
            filter: (structure) => structure.structureType == STRUCTURE_CONTAINER
        });

        let unoccupiedContainer = containers.find(container => {
            let isOccupied = container.pos.lookFor(LOOK_CREEPS).length > 0;
            return !isOccupied;
        });

        if (unoccupiedContainer) {
            if (!creep.pos.isEqualTo(unoccupiedContainer.pos)) {
                log(`${creep.name} moving to unoccupied container at ${unoccupiedContainer.pos}`);
                creep.moveTo(unoccupiedContainer.pos);
                return;
            }
        } else {
            log(`${creep.name} found no unoccupied containers, checking free spaces around source`);
        }

        if (creep.pos.getRangeTo(source) > 1) {
            log(`${creep.name} moving to free space around source at ${source.pos}`);
            let path = pathfinder.findOptimalPath(creep, source.pos);
            if (path && path.path && path.path.length > 0) {
                creep.moveByPath(path.path);
            } else {
                log(`${creep.name} no path found to source`);
            }
            return;
        }

        let harvestResult = creep.harvest(source);
        log(`${creep.name} harvest result: ${harvestResult}`);

        if (harvestResult == ERR_NOT_IN_RANGE) {
            let path = pathfinder.findOptimalPath(creep, source.pos);
            logNextMove(creep, path);
            if (path && path.path && path.path.length > 0) {
                creep.moveByPath(path.path);
            } else {
                log(`${creep.name} no path found to source`);
            }
        } else if (harvestResult == ERR_NO_BODYPART) {
            log(`${creep.name} has no WORK body parts to harvest`);
        } else if (harvestResult == OK) {
            log(`${creep.name} is harvesting, dropping energy`);
            creep.drop(RESOURCE_ENERGY);
        } else {
            log(`${creep.name} cannot harvest due to error: ${harvestResult}`);
        }
    }
};

function logNextMove(creep, path) {
    if (path && path.path && path.path.length > 0) {
        let nextMove = path.path[0];
        log(`${creep.name} next move to ${nextMove.x}, ${nextMove.y}`);
    } else {
        log(`${creep.name} no path found`);
    }
}

function log(message) {
    if (logging) {
        console.log(message);
    }
}

function updateCurrentRoom(creep) {
    if (creep.memory.currentRoom !== creep.room.name) {
        creep.memory.currentRoom = creep.room.name;
    }
}

module.exports = roleDropper;

