const { bodyParts } = require('config');

function getDynamicBodyParts(role, room) {
    const controllerLevel = room.controller.level;
    const energyCapacity = room.energyCapacityAvailable;

    const dynamicBodyParts = {
        dropper: [WORK, WORK, MOVE],
        upgrader: [WORK, WORK, CARRY, MOVE],
        picker: [CARRY, CARRY, CARRY, CARRY, MOVE, MOVE],
        builder: [WORK, CARRY, CARRY, MOVE, MOVE],
        attacker: [TOUGH, TOUGH, ATTACK, ATTACK, MOVE, MOVE],
        defender: [TOUGH, TOUGH, RANGED_ATTACK, MOVE, MOVE],
        claimer: [CLAIM, MOVE],
        healer: [HEAL, MOVE],
        miner: [WORK, WORK, MOVE],
        powerHarvester: [WORK, CARRY, CARRY, MOVE, MOVE],
        remoteHarvester: [WORK, CARRY, MOVE, MOVE],
        scout: [MOVE],
        pioneer: [WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE]
    };

    if (controllerLevel >= 2 && energyCapacity >= 550) {
        dynamicBodyParts.dropper = [WORK, WORK, WORK, MOVE, MOVE],
        dynamicBodyParts.upgrader = [WORK, WORK, WORK, CARRY, MOVE],
        dynamicBodyParts.picker = [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE],
        dynamicBodyParts.builder = [WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE],
        dynamicBodyParts.attacker = [TOUGH, TOUGH, ATTACK, ATTACK, MOVE, MOVE],
        dynamicBodyParts.defender = [TOUGH, TOUGH, RANGED_ATTACK, RANGED_ATTACK, MOVE, MOVE],
        dynamicBodyParts.claimer = [CLAIM, MOVE],
        dynamicBodyParts.healer = [HEAL, MOVE],
        dynamicBodyParts.miner = [WORK, WORK, WORK, WORK, WORK, MOVE],
        dynamicBodyParts.powerHarvester = [WORK, WORK, CARRY, CARRY, MOVE, MOVE],
        dynamicBodyParts.remoteHarvester = [WORK, CARRY, MOVE, MOVE],
        dynamicBodyParts.scout = [MOVE]
    }

    if (controllerLevel >= 4 && energyCapacity >= 800) {
        dynamicBodyParts.dropper = [WORK, WORK, WORK, MOVE, MOVE],
        dynamicBodyParts.upgrader = [WORK, WORK, WORK, CARRY, MOVE],
        dynamicBodyParts.picker = [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE],
        dynamicBodyParts.builder = [WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE],
        dynamicBodyParts.attacker = [TOUGH, TOUGH, ATTACK, ATTACK, MOVE, MOVE],
        dynamicBodyParts.defender = [TOUGH, TOUGH, RANGED_ATTACK, RANGED_ATTACK, MOVE, MOVE],
        dynamicBodyParts.claimer = [CLAIM, MOVE],
        dynamicBodyParts.healer = [HEAL, MOVE],
        dynamicBodyParts.miner = [WORK, WORK, WORK, WORK, WORK, MOVE],
        dynamicBodyParts.powerHarvester = [WORK, WORK, CARRY, CARRY, MOVE, MOVE],
        dynamicBodyParts.remoteHarvester = [WORK, CARRY, MOVE, MOVE],
        dynamicBodyParts.scout = [MOVE]
    }

    // Further adjustments for higher levels

    return dynamicBodyParts[role] || bodyParts[role] || [WORK, CARRY, MOVE];
}

module.exports = {
    getDynamicBodyParts,
};

