var pathfinder = require('pathfinder');

let logging = false;

var roleUpgrader = {
    run: function(creep) {
        updateCurrentRoom(creep);

        if (creep.store[RESOURCE_ENERGY] == 0) {
            collectEnergy(creep);
        } else {
            if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                let path = pathfinder.findOptimalPath(creep, creep.room.controller);
                logNextMove(creep, path);
                creep.moveByPath(path.path);
            }

            let constructionSites = creep.room.lookForAt(LOOK_CONSTRUCTION_SITES, creep.pos);
            if (constructionSites.length > 0) {
                creep.move((Math.random() * 8) + 1); // Move to a random direction
                log(`${creep.name} moving away from construction site`);
            }
        }
    }
};

function collectEnergy(creep) {
    let pickupPriority = creep.memory.pickupPriority || ['dropped', 'container', 'storage'];
    let pickupThreshold = creep.memory.pickupThreshold || { 'dropped': 100, 'container': 100, 'storage': 100 };

    for (let priority of pickupPriority) {
        let energySources = [];
        switch (priority) {
            case 'dropped':
                energySources = creep.room.find(FIND_DROPPED_RESOURCES, {
                    filter: resource => resource.resourceType == RESOURCE_ENERGY && resource.amount >= pickupThreshold.dropped
                });
                break;
            case 'container':
                energySources = creep.room.find(FIND_STRUCTURES, {
                    filter: structure => structure.structureType == STRUCTURE_CONTAINER &&
                                         structure.store.getUsedCapacity(RESOURCE_ENERGY) >= pickupThreshold.container
                });
                break;
            case 'storage':
                energySources = creep.room.find(FIND_STRUCTURES, {
                    filter: structure => structure.structureType == STRUCTURE_STORAGE &&
                                         structure.store.getUsedCapacity(RESOURCE_ENERGY) >= pickupThreshold.storage
                });
                break;
            case 'spawn':
                energySources = creep.room.find(FIND_STRUCTURES, {
                    filter: structure => structure.structureType == STRUCTURE_SPAWN &&
                                         structure.store.getUsedCapacity(RESOURCE_ENERGY) >= pickupThreshold.spawn
                });
                break;
            case 'extension':
                energySources = creep.room.find(FIND_STRUCTURES, {
                    filter: structure => structure.structureType == STRUCTURE_EXTENSION &&
                                         structure.store.getUsedCapacity(RESOURCE_ENERGY) >= pickupThreshold.extension
                });
                break;
        }

        if (energySources.length > 0) {
            energySources.sort((a, b) => creep.pos.getRangeTo(a) - creep.pos.getRangeTo(b));
            let closestSource = energySources[0];

            if (closestSource instanceof Resource) {
                if (creep.pickup(closestSource) == ERR_NOT_IN_RANGE) {
                    let path = pathfinder.findOptimalPath(creep, closestSource);
                    logNextMove(creep, path);
                    creep.moveByPath(path.path);
                } else {
                    log(`${creep.name} picking up dropped energy at ${closestSource.pos}`);
                }
            } else {
                if (creep.withdraw(closestSource, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    let path = pathfinder.findOptimalPath(creep, closestSource);
                    logNextMove(creep, path);
                    creep.moveByPath(path.path);
                } else {
                    log(`${creep.name} withdrawing energy from ${closestSource.structureType} at ${closestSource.pos}`);
                }
            }
            return; // Stop once a valid source is found
        }
    }
    log(`${creep.name} found no energy sources`);
}

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

module.exports = roleUpgrader;

