var pathfinder = require('pathfinder');

var roleHealer = {
    run: function(creep) {
        pathfinder.avoidRoomEdges(creep);

        updateCurrentRoom(creep);

        let target = creep.pos.findClosestByPath(FIND_MY_CREEPS, {
            filter: (ally) => ally.hits < ally.hitsMax
        });

        if (target) {
            if (creep.heal(target) == ERR_NOT_IN_RANGE) {
                let path = pathfinder.findOptimalPath(creep, target);
                creep.moveByPath(path.path);
                creep.rangedHeal(target);
            }
        } else {
            let rallyPoint = Game.flags[creep.memory.rallyPointName];
            if (rallyPoint) {
                moveToRallyPoint(creep, rallyPoint);
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
        let path = pathfinder.findOptimalPath(creep, new RoomPosition(25, 25, rallyPoint.pos.roomName));
        creep.moveByPath(path.path);
    } else {
        let path = pathfinder.findOptimalPath(creep, rallyPoint);
        creep.moveByPath(path.path);
    }
}

module.exports = roleHealer;

