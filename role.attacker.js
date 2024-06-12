var pathfinder = require('pathfinder');

var roleAttacker = {
    run: function(creep) {
        updateCurrentRoom(creep);
        pathfinder.avoidRoomEdges(creep);

        if (creep.memory.targetRoom && creep.room.name !== creep.memory.targetRoom) {
            // Move to the target room
            let exitDir = creep.room.findExitTo(creep.memory.targetRoom);
            let exit = creep.pos.findClosestByRange(exitDir);
            if (exit) {
                let path = pathfinder.findOptimalPath(creep, exit);
                creep.moveByPath(path.path);
            }
        } else {
            let target = creep.pos.findClosestByPath(FIND_HOSTILE_CREEPS);
            if (target) {
                if (creep.attack(target) == ERR_NOT_IN_RANGE) {
                    let path = pathfinder.findOptimalPath(creep, target);
                    creep.moveByPath(path.path);
                }
            } else {
                let invaderCore = creep.pos.findClosestByPath(FIND_HOSTILE_STRUCTURES, {
                    filter: (structure) => structure.structureType === STRUCTURE_INVADER_CORE
                });
                if (invaderCore) {
                    if (creep.attack(invaderCore) == ERR_NOT_IN_RANGE) {
                        let path = pathfinder.findOptimalPath(creep, invaderCore);
                        creep.moveByPath(path.path);
                    }
                } else {
                    // No hostile creeps or invader cores, move to the rally point
                    let rallyPoint = Game.flags[creep.memory.rallyPointName];
                    if (rallyPoint) {
                        moveToRallyPoint(creep, rallyPoint);
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

function moveToRallyPoint(creep, rallyPoint) {
    if (creep.room.name !== rallyPoint.pos.roomName) {
        // Move to the rally point's room
        let path = pathfinder.findOptimalPath(creep, new RoomPosition(25, 25, rallyPoint.pos.roomName));
        creep.moveByPath(path.path);
    } else {
        // Move to the rally point's position within the room
        let path = pathfinder.findOptimalPath(creep, rallyPoint.pos);
        creep.moveByPath(path.path);
    }
}

module.exports = roleAttacker;

