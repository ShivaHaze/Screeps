var pathfinder = require('pathfinder');

let logging = false;

var roleBuilder = {
    run: function(creep) {
        updateCurrentRoom(creep);

        if (creep.memory.working && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.working = false;
            delete creep.memory.repairTarget; // Clear repair target when out of energy
            log(`${creep.name} is out of energy, switching to collecting mode`);
        }
        if (!creep.memory.working && creep.store.getFreeCapacity() == 0) {
            creep.memory.working = true;
            log(`${creep.name} is full of energy, switching to working mode`);
        }

        if (creep.memory.working) {
            log(`${creep.name} is working`);
            if (repairRamparts(creep)) return;
            if (creep.memory.prioritizeRepairing) {
                if (repairStructures(creep)) return;
                buildStructures(creep);
            } else {
                if (buildStructures(creep)) return;
                repairStructures(creep);
            }
        } else {
            log(`${creep.name} is collecting energy`);
            collectEnergy(creep);
        }
    }
};

function buildStructures(creep) {
    let buildPriority = creep.memory.buildPriority || [
        STRUCTURE_SPAWN, STRUCTURE_EXTENSION, STRUCTURE_ROAD, STRUCTURE_WALL, STRUCTURE_RAMPART,
        STRUCTURE_TOWER, STRUCTURE_CONTAINER, STRUCTURE_STORAGE, STRUCTURE_LINK, STRUCTURE_TERMINAL,
        STRUCTURE_LAB, STRUCTURE_OBSERVER, STRUCTURE_POWER_SPAWN, STRUCTURE_NUKER, STRUCTURE_FACTORY
    ];

    for (let priority of buildPriority) {
        let targets = creep.room.find(FIND_CONSTRUCTION_SITES, {
            filter: (structure) => structure.structureType == priority
        });

        log(`${creep.name} found ${targets.length} construction sites for ${priority}`);

        if (targets.length) {
            targets.sort((a, b) => creep.pos.getRangeTo(a) - creep.pos.getRangeTo(b));
            let closestTarget = targets[0];

            if (creep.build(closestTarget) == ERR_NOT_IN_RANGE) {
                let path = pathfinder.findOptimalPath(creep, closestTarget);
                log(`${creep.name} moving to build ${closestTarget.structureType} at ${closestTarget.pos}`);
                logNextMove(creep, path);
                creep.moveByPath(path.path);
            } else {
                log(`${creep.name} building ${closestTarget.structureType} at ${closestTarget.pos}`);
            }
            return true; // Stop once a target is found and action is taken
        }
    }
    log(`${creep.name} found no construction sites`);
    return false; // No targets found for any priority
}

function repairRamparts(creep) {
    let repairThresholds = creep.room.memory.repairThresholds || {};
    let maxRepair = creep.room.memory.maxRepair || {};
    let threshold = repairThresholds[STRUCTURE_RAMPART] || 1.0;
    let maxRepairLimit = maxRepair[STRUCTURE_RAMPART] || 1.0;

    let targets = creep.room.find(FIND_STRUCTURES, {
        filter: (structure) => structure.structureType == STRUCTURE_RAMPART && structure.hits < structure.hitsMax * maxRepairLimit
    });

    if (targets.length > 0) {
        targets.sort((a, b) => creep.pos.getRangeTo(a) - creep.pos.getRangeTo(b));
        let target = targets[0];

        if (target.hits < target.hitsMax * threshold || (creep.memory.repairTarget && creep.memory.repairTarget === target.id)) {
            creep.memory.repairTarget = target.id;

            if (creep.repair(target) == ERR_NOT_IN_RANGE) {
                let path = pathfinder.findOptimalPath(creep, target);
                log(`${creep.name} moving to repair priority rampart at ${target.pos}`);
                logNextMove(creep, path);
                creep.moveByPath(path.path);
            } else {
                log(`${creep.name} repairing priority rampart at ${target.pos}`);
            }
            return true; // Stop once a rampart is being repaired
        }
    }
    return false; // No rampart found for priority repair
}

function repairStructures(creep) {
    if (creep.memory.repairTarget) {
        let target = Game.getObjectById(creep.memory.repairTarget);
        if (target && target.hits < target.hitsMax) {
            let maxRepair = creep.room.memory.maxRepair || {};
            let maxRepairLimit = maxRepair[target.structureType] || 1.0;

            if (target.hits >= target.hitsMax * maxRepairLimit) {
                delete creep.memory.repairTarget;
                log(`${creep.name} reached max repair limit for ${target.structureType} at ${target.pos}`);
            } else if (creep.repair(target) == ERR_NOT_IN_RANGE) {
                let path = pathfinder.findOptimalPath(creep, target);
                log(`${creep.name} moving to repair ${target.structureType} at ${target.pos}`);
                logNextMove(creep, path);
                creep.moveByPath(path.path);
            } else {
                log(`${creep.name} repairing ${target.structureType} at ${target.pos}`);
            }
            return true; // Continue repairing the current target
        } else {
            delete creep.memory.repairTarget; // Target is fully repaired
            log(`${creep.name} finished repairing ${target.structureType} at ${target.pos}`);
        }
    }

    let repairPriority = creep.memory.repairPriority || [
        STRUCTURE_TOWER, STRUCTURE_CONTAINER, STRUCTURE_ROAD, STRUCTURE_WALL, STRUCTURE_RAMPART,
        STRUCTURE_EXTENSION, STRUCTURE_SPAWN, STRUCTURE_STORAGE, STRUCTURE_LINK, STRUCTURE_TERMINAL,
        STRUCTURE_LAB, STRUCTURE_OBSERVER, STRUCTURE_POWER_SPAWN, STRUCTURE_NUKER, STRUCTURE_FACTORY
    ];
    let repairThresholds = creep.room.memory.repairThresholds || {};
    let maxRepair = creep.room.memory.maxRepair || {};

    for (let priority of repairPriority) {
        let threshold = repairThresholds[priority] || 1.0;
        let maxRepairLimit = maxRepair[priority] || 1.0;

        let targets = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => structure.structureType == priority && structure.hits < structure.hitsMax * threshold
        });

        log(`${creep.name} found ${targets.length} repair targets for ${priority}`);

        if (targets.length) {
            targets.sort((a, b) => creep.pos.getRangeTo(a) - creep.pos.getRangeTo(b));
            let target = targets[0];
            creep.memory.repairTarget = target.id;

            if (creep.repair(target) == ERR_NOT_IN_RANGE) {
                let path = pathfinder.findOptimalPath(creep, target);
                log(`${creep.name} moving to repair ${target.structureType} at ${target.pos}`);
                logNextMove(creep, path);
                creep.moveByPath(path.path);
            } else {
                log(`${creep.name} repairing ${target.structureType} at ${target.pos}`);
            }
            return true; // Stop once a target is found and action is taken
        }
    }
    log(`${creep.name} found no repair targets`);
    return false; // No targets found for any priority
}

function collectEnergy(creep) {
    let pickupPriority = creep.memory.pickupPriority || ['dropped', 'container', 'storage', 'spawn', 'extension'];
    let pickupThreshold = creep.memory.pickupThreshold || { 'dropped': 100, 'container': 100, 'storage': 100, 'spawn': 100, 'extension': 100 };

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
                    log(`${creep.name} moving to pickup dropped energy at ${closestSource.pos}`);
                    logNextMove(creep, path);
                    creep.moveByPath(path.path);
                } else {
                    log(`${creep.name} picking up dropped energy at ${closestSource.pos}`);
                }
            } else {
                if (creep.withdraw(closestSource, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    let path = pathfinder.findOptimalPath(creep, closestSource);
                    log(`${creep.name} moving to withdraw energy from ${closestSource.structureType} at ${closestSource.pos}`);
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

module.exports = roleBuilder;

