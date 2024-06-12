var pathfinder = require('pathfinder');
var roleUpgrader = require('role.upgrader');

let logging = false;

var rolePicker = {
    run: function(creep) {
        updateCurrentRoom(creep);

        let energyThreshold = creep.room.memory.energyThreshold || 0.1;

        if (creep.store.getFreeCapacity() == 0 || (creep.store[RESOURCE_ENERGY] / creep.store.getCapacity() > energyThreshold)) {
            storeEnergyOrMinerals(creep);
        } else {
            if (creep.memory.pickupOrder === 'energy') {
                if (!collectEnergy(creep)) {
                    collectMinerals(creep);
                }
            } else {
                if (!collectMinerals(creep)) {
                    collectEnergy(creep);
                }
            }
        }
    }
};

function collectEnergy(creep) {
    let pickupPriority = creep.memory.pickupPriority || ['dropped', 'container', 'storage', 'spawn', 'extension', 'tombstone'];
    let pickupThreshold = creep.memory.pickupThreshold || { 'dropped': 100, 'container': 100, 'storage': 100, 'tombstone': 100 };

    if (creep.store[RESOURCE_ENERGY] / creep.store.getCapacity() > (creep.room.memory.energyThreshold || 0.1)) {
        return false;
    }

    for (let priority of pickupPriority) {
        let energySources = [];
        switch (priority) {
            case 'dropped':
                energySources = creep.room.find(FIND_DROPPED_RESOURCES, {
                    filter: resource => resource.resourceType == RESOURCE_ENERGY && resource.amount >= pickupThreshold['dropped']
                });
                break;
            case 'container':
                energySources = creep.room.find(FIND_STRUCTURES, {
                    filter: structure => structure.structureType == STRUCTURE_CONTAINER &&
                        structure.store.getUsedCapacity(RESOURCE_ENERGY) > pickupThreshold['container']
                });
                break;
            case 'storage':
                energySources = creep.room.find(FIND_STRUCTURES, {
                    filter: structure => structure.structureType == STRUCTURE_STORAGE &&
                        structure.store.getUsedCapacity(RESOURCE_ENERGY) > pickupThreshold['storage']
                });
                break;
            case 'spawn':
                energySources = creep.room.find(FIND_STRUCTURES, {
                    filter: structure => structure.structureType == STRUCTURE_SPAWN &&
                        structure.store.getUsedCapacity(RESOURCE_ENERGY) > pickupThreshold['spawn']
                });
                break;
            case 'extension':
                energySources = creep.room.find(FIND_STRUCTURES, {
                    filter: structure => structure.structureType == STRUCTURE_EXTENSION &&
                        structure.store.getUsedCapacity(RESOURCE_ENERGY) > pickupThreshold['extension']
                });
                break;
            case 'tombstone':
                energySources = creep.room.find(FIND_TOMBSTONES, {
                    filter: tombstone => tombstone.store.getUsedCapacity(RESOURCE_ENERGY) > pickupThreshold['tombstone']
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
            return true;
        }
    }
    log(`${creep.name} found no energy sources`);
    return false;
}

function collectMinerals(creep) {
    let mineralPickupPriority = creep.memory.mineralPickupPriority || [
        'G', 'X', 'H', 'O', 'U', 'L', 'K', 'Z',
        'OH', 'ZK', 'UL', 'UH', 'UO', 'KH', 'KO', 'LH', 'LO',
        'ZH', 'ZO', 'GH', 'GO', 'UH2O', 'UHO2', 'KH2O', 'KHO2',
        'LH2O', 'LHO2', 'ZH2O', 'ZHO2', 'GH2O', 'GHO2', 'XUH2O', 'XUHO2',
        'XKH2O', 'XKHO2', 'XLH2O', 'XLHO2', 'XZH2O', 'XZHO2', 'XGH2O', 'XGHO2'
    ];
    let mineralPickupThreshold = creep.memory.mineralPickupThreshold || {
        'H': 1, 'O': 1, 'U': 1, 'L': 1, 'K': 1, 'Z': 1, 'X': 1, 'G': 1,
        'OH': 1, 'ZK': 1, 'UL': 1, 'UH': 1, 'UO': 1, 'KH': 1, 'KO': 1, 'LH': 1, 'LO': 1,
        'ZH': 1, 'ZO': 1, 'GH': 1, 'GO': 1, 'UH2O': 1, 'UHO2': 1, 'KH2O': 1, 'KHO2': 1,
        'LH2O': 1, 'LHO2': 1, 'ZH2O': 1, 'ZHO2': 1, 'GH2O': 1, 'GHO2': 1, 'XUH2O': 1, 'XUHO2': 1,
        'XKH2O': 1, 'XKHO2': 1, 'XLH2O': 1, 'XLHO2': 1, 'XZH2O': 1, 'XZHO2': 1, 'XGH2O': 1, 'XGHO2': 1
    };

    for (let priority of mineralPickupPriority) {
        let mineralSources = [];
        mineralSources = creep.room.find(FIND_DROPPED_RESOURCES, {
            filter: resource => resource.resourceType == priority && resource.amount >= mineralPickupThreshold[priority]
        });

        if (mineralSources.length > 0) {
            mineralSources.sort((a, b) => creep.pos.getRangeTo(a) - creep.pos.getRangeTo(b));
            let closestSource = mineralSources[0];

            if (creep.pickup(closestSource) == ERR_NOT_IN_RANGE) {
                let path = pathfinder.findOptimalPath(creep, closestSource);
                logNextMove(creep, path);
                creep.moveByPath(path.path);
            } else {
                log(`${creep.name} picking up dropped mineral ${priority} at ${closestSource.pos}`);
            }
            return true;
        }

        mineralSources = creep.room.find(FIND_TOMBSTONES, {
            filter: tombstone => tombstone.store.getUsedCapacity(priority) >= mineralPickupThreshold[priority]
        });

        if (mineralSources.length > 0) {
            mineralSources.sort((a, b) => creep.pos.getRangeTo(a) - creep.pos.getRangeTo(b));
            let closestSource = mineralSources[0];

            if (creep.withdraw(closestSource, priority) == ERR_NOT_IN_RANGE) {
                let path = pathfinder.findOptimalPath(creep, closestSource);
                logNextMove(creep, path);
                creep.moveByPath(path.path);
            } else {
                log(`${creep.name} withdrawing ${priority} from tombstone at ${closestSource.pos}`);
            }
            return true;
        }
    }
    log(`${creep.name} found no mineral sources`);
    return false;
}

function storeEnergyOrMinerals(creep) {
    let storageAvailable = creep.room.find(FIND_STRUCTURES, {
        filter: (structure) => {
            return (structure.structureType == STRUCTURE_CONTAINER ||
                structure.structureType == STRUCTURE_STORAGE ||
                structure.structureType == STRUCTURE_EXTENSION ||
                structure.structureType == STRUCTURE_SPAWN ||
                structure.structureType == STRUCTURE_TOWER);
        }
    });

    if (storageAvailable.length > 0) {
        storeResources(creep, storageAvailable);
    } else {
        roleUpgrader.run(creep);
    }
}

function storeResources(creep, storageAvailable) {
    let resources = Object.keys(creep.store);
    resources.sort((a, b) => (a === RESOURCE_ENERGY ? -1 : 1)); // Prioritize energy

    let minerals = resources.filter(resource => resource !== RESOURCE_ENERGY);
    if (minerals.length > 0) {
        let storage = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => structure.structureType == STRUCTURE_STORAGE
        });
        if (storage.length > 0) {
            for (let mineral of minerals) {
                if (creep.transfer(storage[0], mineral) == ERR_NOT_IN_RANGE) {
                    let path = pathfinder.findOptimalPath(creep, storage[0]);
                    log(`${creep.name} moving to store ${mineral} at ${storage[0].structureType} at ${storage[0].pos}`);
                    creep.moveByPath(path.path);
                    return;
                } else if (creep.transfer(storage[0], mineral) == OK) {
                    log(`${creep.name} transferring ${mineral} to ${storage[0].structureType} at ${storage[0].pos}`);
                    return;
                }
            }
        }
    }

    let energyThreshold = creep.room.memory.energyThreshold || 0.1;
    let fillPriority = creep.room.memory.fillPriority || [
        STRUCTURE_EXTENSION, STRUCTURE_SPAWN, STRUCTURE_TOWER,
        STRUCTURE_CONTAINER, STRUCTURE_STORAGE, STRUCTURE_LAB,
        STRUCTURE_TERMINAL, STRUCTURE_NUKER, STRUCTURE_FACTORY
    ];

    for (let priority of fillPriority) {
        let targets = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return structure.structureType == priority && structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
            }
        });

        if (targets.length > 0) {
            log(`${creep.name} found targets for ${priority}: ${targets.map(t => `${t.structureType} at ${t.pos}`).join(', ')}`);
            targets.sort((a, b) => creep.pos.getRangeTo(a) - creep.pos.getRangeTo(b));
            let target = targets[0];

            if (creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                let path = pathfinder.findOptimalPath(creep, target);
                log(`${creep.name} moving to ${target.structureType} at ${target.pos}`);
                creep.moveByPath(path.path);
            } else {
                log(`${creep.name} transferring to ${target.structureType} at ${target.pos}`);
            }

            if (creep.store[RESOURCE_ENERGY] / creep.store.getCapacity() <= energyThreshold) {
                return;
            }
            return;
        } else {
            log(`${creep.name} found no targets for ${priority}`);
        }
    }
    log(`${creep.name} found no energy targets`);
}

function logNextMove(creep, path) {
    if (logging && path && path.path && path.path.length > 0) {
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

module.exports = rolePicker;

