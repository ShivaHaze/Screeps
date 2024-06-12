var pathfinder = require('pathfinder');

var roleDefender = {
    run: function(creep) {
        updateCurrentRoom(creep);
        pathfinder.avoidRoomEdges(creep);

        if (creep.memory.targetRoom && creep.room.name !== creep.memory.targetRoom) {
            let exit = creep.room.findExitTo(creep.memory.targetRoom);
            creep.moveTo(creep.pos.findClosestByRange(exit));
        } else {
            let target = creep.pos.findClosestByPath(FIND_HOSTILE_CREEPS);
            if (target) {
                if (creep.rangedAttack(target) == ERR_NOT_IN_RANGE) {
                    let path = pathfinder.findOptimalPath(creep, target);
                    creep.moveByPath(path.path);
                }
            } else {
                let invaderCore = creep.pos.findClosestByPath(FIND_HOSTILE_STRUCTURES, {
                    filter: (structure) => structure.structureType === STRUCTURE_INVADER_CORE
                });
                if (invaderCore) {
                    if (creep.rangedAttack(invaderCore) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(invaderCore);
                    }
                } else {
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
        creep.moveTo(new RoomPosition(25, 25, rallyPoint.pos.roomName));
    } else {
        let path = pathfinder.findOptimalPath(creep, rallyPoint);
        creep.moveByPath(path.path);
    }
}

module.exports = roleDefender;

