var pathfinder = require('pathfinder');

var roleScout = {
    run: function(creep) {
        pathfinder.avoidRoomEdges(creep);

        updateCurrentRoom(creep);

        if (creep.memory.targetRoom && creep.room.name !== creep.memory.targetRoom) {
            let exitDir = creep.room.findExitTo(creep.memory.targetRoom);
            let exit = creep.pos.findClosestByRange(exitDir);
            let path = pathfinder.findOptimalPath(creep, { pos: exit });
            creep.moveByPath(path.path);
        } else {
            let target = creep.pos.findClosestByRange(FIND_EXIT);
            if (target) {
                let path = pathfinder.findOptimalPath(creep, target);
                creep.moveByPath(path.path);
            }
        }
    }
};

function updateCurrentRoom(creep) {
    if (creep.memory.currentRoom !== creep.room.name) {
        creep.memory.currentRoom = creep.room.name;
    }
}

module.exports = roleScout;

