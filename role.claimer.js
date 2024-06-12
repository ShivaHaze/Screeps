var pathfinder = require('pathfinder');

let logging = false;

var roleClaimer = {
    run: function(creep) {
        updateCurrentRoom(creep);

        if (!creep.memory.targetRoom) {
            log(`${creep.name} has no target room specified`);
            return;
        }

        if (creep.room.name != creep.memory.targetRoom) {
            moveToTargetRoom(creep);
        } else {
            claimOrReserveController(creep);
        }
    }
};

function moveToTargetRoom(creep) {
    let targetRoom = creep.memory.targetRoom;
    let exitDir = creep.room.findExitTo(targetRoom);
    let exit = creep.pos.findClosestByRange(exitDir);
    let path = pathfinder.findOptimalPath(creep, { pos: exit });
    log(`${creep.name} moving to target room ${targetRoom}`);
    creep.moveByPath(path.path);
}

function claimOrReserveController(creep) {
    let controller = creep.room.controller;

    if (!controller) {
        log(`${creep.name} cannot find a controller in room ${creep.room.name}`);
        return;
    }

    if (creep.room.controller.my) {
        log(`${creep.name} has already claimed this controller in room ${creep.room.name}`);
        return;
    }

    if (creep.reserveController(controller) == ERR_NOT_IN_RANGE) {
        let path = pathfinder.findOptimalPath(creep, controller);
        log(`${creep.name} moving to reserve controller in room ${creep.room.name}`);
        creep.moveByPath(path.path);
    } else {
        log(`${creep.name} reserving controller in room ${creep.room.name}`);
    }

    if (controller.reservation && controller.reservation.username != creep.owner.username) {
        if (creep.attackController(controller) == ERR_NOT_IN_RANGE) {
            let path = pathfinder.findOptimalPath(creep, controller);
            log(`${creep.name} moving to attack enemy reservation in room ${creep.room.name}`);
            creep.moveByPath(path.path);
        } else {
            log(`${creep.name} attacking enemy reservation in room ${creep.room.name}`);
        }
    }

    if (!controller.reservation || (controller.reservation && controller.reservation.ticksToEnd < 100)) {
        if (creep.claimController(controller) == ERR_NOT_IN_RANGE) {
            let path = pathfinder.findOptimalPath(creep, controller);
            log(`${creep.name} moving to claim controller in room ${creep.room.name}`);
            creep.moveByPath(path.path);
        } else {
            log(`${creep.name} claiming controller in room ${creep.room.name}`);
        }
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

module.exports = roleClaimer;

