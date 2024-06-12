const { defaultMemory } = require('config');
const { getDynamicBodyParts } = require('dynamicBodyParts');

let logging = false;

function getAssignedSource(room) {
    let sources = room.find(FIND_SOURCES);
    let minAssigned = Number.MAX_VALUE;
    let assignedSource = sources[0];

    for (let source of sources) {
        let assignedCreeps = _.filter(Game.creeps, (c) => c.memory.role == 'dropper' && c.memory.sourceId == source.id);
        if (assignedCreeps.length < minAssigned) {
            minAssigned = assignedCreeps.length;
            assignedSource = source;
        }
    }
    return assignedSource.id;
}

var spawnHelper = {
    spawnCreep: function(spawn, role, additionalMemory = {}) {
        const newName = `${role}_${Game.time}`;
        const body = getDynamicBodyParts(role, spawn.room);

        if (role === 'dropper') {
            const sourceId = getAssignedSource(spawn.room);
            const memory = Object.assign({}, defaultMemory[role], { sourceId: sourceId }, additionalMemory);

            if (spawn.spawnCreep(body, newName, { memory }) === OK) {
                log(`Spawning new ${role}: ${newName} assigned to source ${sourceId}`);
            }
        } else {
            if (spawn.spawnCreep(body, newName, { memory: Object.assign({}, defaultMemory[role], additionalMemory) }) === OK) {
                log(`Spawning new ${role}: ${newName}`);
            }
        }
    }
};

function log(message) {
    if (logging) {
        console.log(message);
    }
}

module.exports = spawnHelper;

