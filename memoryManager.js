const { defaultRoomMemory } = require('config');

var memoryManager = {
    updateRoomMemory: function() {
        for (let roomName in Game.rooms) {
            let room = Game.rooms[roomName];

            if (!Memory.rooms[roomName]) {
                Memory.rooms[roomName] = {};
            }

            // Controller memory
            if (!Memory.rooms[roomName].controller) {
                Memory.rooms[roomName].controller = {
                    level: room.controller.level,
                    progress: room.controller.progress,
                    progressTotal: room.controller.progressTotal,
                    owner: room.controller.owner ? room.controller.owner.username : 'neutral'
                };
            }

            // Sources memory
            if (!Memory.rooms[roomName].sources) {
                Memory.rooms[roomName].sources = [];
                let sources = room.find(FIND_SOURCES);
                for (let source of sources) {
                    Memory.rooms[roomName].sources.push({
                        id: source.id,
                        pos: source.pos
                    });
                }
            }

            // Structures memory
            if (!Memory.rooms[roomName].structures) {
                Memory.rooms[roomName].structures = {
                    spawns: [],
                    extensions: [],
                    towers: [],
                    storages: [],
                    containers: [],
                    links: [],
                    labs: [],
                    terminals: [],
                    roads: [],
                    walls: [],
                    ramparts: [],
                    observers: [],
                    powerSpawns: [],
                    nukers: [],
                    factories: []
                };

                let structures = room.find(FIND_MY_STRUCTURES);
                for (let structure of structures) {
                    switch (structure.structureType) {
                        case STRUCTURE_SPAWN:
                            Memory.rooms[roomName].structures.spawns.push({
                                id: structure.id,
                                pos: structure.pos
                            });
                            break;
                        case STRUCTURE_EXTENSION:
                            Memory.rooms[roomName].structures.extensions.push({
                                id: structure.id,
                                pos: structure.pos
                            });
                            break;
                        case STRUCTURE_TOWER:
                            Memory.rooms[roomName].structures.towers.push({
                                id: structure.id,
                                pos: structure.pos
                            });
                            break;
                        case STRUCTURE_STORAGE:
                            Memory.rooms[roomName].structures.storages.push({
                                id: structure.id,
                                pos: structure.pos
                            });
                            break;
                        case STRUCTURE_CONTAINER:
                            Memory.rooms[roomName].structures.containers.push({
                                id: structure.id,
                                pos: structure.pos
                            });
                            break;
                        case STRUCTURE_LINK:
                            Memory.rooms[roomName].structures.links.push({
                                id: structure.id,
                                pos: structure.pos
                            });
                            break;
                        case STRUCTURE_LAB:
                            Memory.rooms[roomName].structures.labs.push({
                                id: structure.id,
                                pos: structure.pos
                            });
                            break;
                        case STRUCTURE_TERMINAL:
                            Memory.rooms[roomName].structures.terminals.push({
                                id: structure.id,
                                pos: structure.pos
                            });
                            break;
                        case STRUCTURE_ROAD:
                            Memory.rooms[roomName].structures.roads.push({
                                id: structure.id,
                                pos: structure.pos
                            });
                            break;
                        case STRUCTURE_WALL:
                            Memory.rooms[roomName].structures.walls.push({
                                id: structure.id,
                                pos: structure.pos
                            });
                            break;
                        case STRUCTURE_RAMPART:
                            Memory.rooms[roomName].structures.ramparts.push({
                                id: structure.id,
                                pos: structure.pos
                            });
                            break;
                        case STRUCTURE_OBSERVER:
                            Memory.rooms[roomName].structures.observers.push({
                                id: structure.id,
                                pos: structure.pos
                            });
                            break;
                        case STRUCTURE_POWER_SPAWN:
                            Memory.rooms[roomName].structures.powerSpawns.push({
                                id: structure.id,
                                pos: structure.pos
                            });
                            break;
                        case STRUCTURE_NUKER:
                            Memory.rooms[roomName].structures.nukers.push({
                                id: structure.id,
                                pos: structure.pos
                            });
                            break;
                        case STRUCTURE_FACTORY:
                            Memory.rooms[roomName].structures.factories.push({
                                id: structure.id,
                                pos: structure.pos
                            });
                            break;
                        default:
                            break;
                    }
                }
            }

            // Initialize other room memory fields with default values if not already present
            Memory.rooms[roomName] = Object.assign({}, defaultRoomMemory, Memory.rooms[roomName]);

            // Initialize or update max limits based on spawnPriority
            if (!Memory.rooms[roomName].roleMaxLimits) {
                Memory.rooms[roomName].roleMaxLimits = {};
            }
            if (Memory.rooms[roomName].spawnPriority) {
                let roleCounts = {};
                Memory.rooms[roomName].spawnPriority.forEach(role => {
                    if (!roleCounts[role]) {
                        roleCounts[role] = 0;
                    }
                    roleCounts[role]++;
                });
                Memory.rooms[roomName].roleMaxLimits = roleCounts;
            }
        }
    }
};

module.exports = memoryManager;

