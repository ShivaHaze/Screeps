const { defaultMemory, defaultRoomMemory, bodyParts } = require('config');

var helperScript = {
    changeRole: function(creep, newRole) {
        if (!defaultMemory[newRole]) {
            console.log(`Role ${newRole} does not exist in default memory configuration.`);
            return;
        }
        creep.memory = Object.assign({}, defaultMemory[newRole], {
            role: newRole
        });
        console.log(`Creep ${creep.name} role changed to ${newRole}`);
    },

    changeBuildPriority: function(roomName, newBuildPriority) {
        if (!Game.rooms[roomName]) {
            console.log(`Room ${roomName} does not exist.`);
            return;
        }
        if (!Memory.rooms[roomName]) {
            Memory.rooms[roomName] = {};
        }
        Memory.rooms[roomName].buildPriority = newBuildPriority;
        console.log(`Build priority for room ${roomName} changed to ${JSON.stringify(newBuildPriority)}`);
    },

    changeSpawnPriority: function(roomName, newSpawnPriority) {
        if (!Game.rooms[roomName]) {
            console.log(`Room ${roomName} does not exist.`);
            return;
        }
        if (!Memory.rooms[roomName]) {
            Memory.rooms[roomName] = {};
        }
        Memory.rooms[roomName].spawnPriority = newSpawnPriority;
        console.log(`Spawn priority for room ${roomName} changed to ${JSON.stringify(newSpawnPriority)}`);
    },

    changeOptions: function(roomName, newOptions) {
        if (!Game.rooms[roomName]) {
            console.log(`Room ${roomName} does not exist.`);
            return;
        }
        if (!Memory.rooms[roomName]) {
            Memory.rooms[roomName] = {};
        }
        Memory.rooms[roomName].options = newOptions;
        console.log(`Options for room ${roomName} changed to ${JSON.stringify(newOptions)}`);
    },

    changeRepairPriority: function(roomName, newRepairPriority) {
        if (!Game.rooms[roomName]) {
            console.log(`Room ${roomName} does not exist.`);
            return;
        }
        if (!Memory.rooms[roomName]) {
            Memory.rooms[roomName] = {};
        }
        Memory.rooms[roomName].repairPriority = newRepairPriority;
        console.log(`Repair priority for room ${roomName} changed to ${JSON.stringify(newRepairPriority)}`);
    },

    changeRepairThresholds: function(roomName, newRepairThresholds) {
        if (!Game.rooms[roomName]) {
            console.log(`Room ${roomName} does not exist.`);
            return;
        }
        if (!Memory.rooms[roomName]) {
            Memory.rooms[roomName] = {};
        }
        Memory.rooms[roomName].repairThresholds = newRepairThresholds;
        console.log(`Repair thresholds for room ${roomName} changed to ${JSON.stringify(newRepairThresholds)}`);
    },
    
    changeMaxRepair: function(roomName, newMaxRepair) {
        if (!Game.rooms[roomName]) {
            console.log(`Room ${roomName} does not exist.`);
            return;
        }
        if (!Memory.rooms[roomName]) {
            Memory.rooms[roomName] = {};
        }
        Memory.rooms[roomName].maxRepair = newMaxRepair;
        console.log(`Max repair values for room ${roomName} changed to ${JSON.stringify(newMaxRepair)}`);
    },

    changeFillPriority: function(roomName, newFillPriority) {
        if (!Game.rooms[roomName]) {
            console.log(`Room ${roomName} does not exist.`);
            return;
        }
        if (!Memory.rooms[roomName]) {
            Memory.rooms[roomName] = {};
        }
        Memory.rooms[roomName].fillPriority = newFillPriority;
        console.log(`Fill priority for room ${roomName} changed to ${JSON.stringify(newFillPriority)}`);
    },

    changeEnergyThreshold: function(roomName, newEnergyThreshold) {
        if (!Game.rooms[roomName]) {
            console.log(`Room ${roomName} does not exist.`);
            return;
        }
        if (!Memory.rooms[roomName]) {
            Memory.rooms[roomName] = {};
        }
        Memory.rooms[roomName].energyThreshold = newEnergyThreshold;
        console.log(`Energy threshold for room ${roomName} changed to ${newEnergyThreshold}`);
    },

    changePickupPriority: function(creepName, newPickupPriority) {
        let creep = Game.creeps[creepName];
        if (creep) {
            creep.memory.pickupPriority = newPickupPriority;
            console.log(`Pickup priority for ${creepName} changed to ${JSON.stringify(newPickupPriority)}`);
        } else {
            console.log(`Creep ${creepName} not found.`);
        }
    },

    changeAllPickersPickupPriority: function(roomName, newPickupPriority) {
        let creeps = _.filter(Game.creeps, (creep) => creep.memory.role === 'picker' && creep.room.name === roomName);
        creeps.forEach(creep => {
            creep.memory.pickupPriority = newPickupPriority;
            console.log(`Pickup priority for picker ${creep.name} changed to ${JSON.stringify(newPickupPriority)}`);
        });
        console.log(`Pickup priority for all pickers in room ${roomName} changed to ${JSON.stringify(newPickupPriority)}`);
    },

    changePickupThreshold: function(creepName, newPickupThreshold) {
        let creep = Game.creeps[creepName];
        if (creep) {
            creep.memory.pickupThreshold = newPickupThreshold;
            console.log(`Pickup threshold for ${creepName} changed to ${JSON.stringify(newPickupThreshold)}`);
        } else {
            console.log(`Creep ${creepName} not found.`);
        }
    },

    changeAllPickersPickupThreshold: function(roomName, newPickupThreshold) {
        let creeps = _.filter(Game.creeps, (creep) => creep.memory.role === 'picker' && creep.room.name === roomName);
        creeps.forEach(creep => {
            creep.memory.pickupThreshold = newPickupThreshold;
            console.log(`Pickup threshold for picker ${creep.name} changed to ${JSON.stringify(newPickupThreshold)}`);
        });
        console.log(`Pickup threshold for all pickers in room ${roomName} changed to ${JSON.stringify(newPickupThreshold)}`);
    },

    changeMineralPickupThreshold: function(creepName, newMineralPickupThreshold) {
        let creep = Game.creeps[creepName];
        if (creep) {
            creep.memory.mineralPickupThreshold = newMineralPickupThreshold;
            console.log(`Mineral pickup threshold for ${creepName} changed to ${JSON.stringify(newMineralPickupThreshold)}`);
        } else {
            console.log(`Creep ${creepName} not found.`);
        }
    },

    changeAllPickersMineralPickupThreshold: function(roomName, newMineralPickupThreshold) {
        let creeps = _.filter(Game.creeps, (creep) => creep.memory.role === 'picker' && creep.room.name === roomName);
        creeps.forEach(creep => {
            creep.memory.mineralPickupThreshold = newMineralPickupThreshold;
            console.log(`Mineral pickup threshold for picker ${creep.name} changed to ${JSON.stringify(newMineralPickupThreshold)}`);
        });
        console.log(`Mineral pickup threshold for all pickers in room ${roomName} changed to ${JSON.stringify(newMineralPickupThreshold)}`);
    },

    changeMineralPickupPriority: function(creepName, newMineralPickupPriority) {
        let creep = Game.creeps[creepName];
        if (creep) {
            creep.memory.mineralPickupPriority = newMineralPickupPriority;
            console.log(`Mineral pickup priority for ${creepName} changed to ${JSON.stringify(newMineralPickupPriority)}`);
        } else {
            console.log(`Creep ${creepName} not found.`);
        }
    },

    changeAllPickersMineralPickupPriority: function(roomName, newMineralPickupPriority) {
        let creeps = _.filter(Game.creeps, (creep) => creep.memory.role === 'picker' && creep.room.name === roomName);
        creeps.forEach(creep => {
            creep.memory.mineralPickupPriority = newMineralPickupPriority;
            console.log(`Mineral pickup priority for picker ${creep.name} changed to ${JSON.stringify(newMineralPickupPriority)}`);
        });
        console.log(`Mineral pickup priority for all pickers in room ${roomName} changed to ${JSON.stringify(newMineralPickupPriority)}`);
    },

    changePickupOrder: function(creepName, newPickupOrder) {
        let creep = Game.creeps[creepName];
        if (creep) {
            creep.memory.pickupOrder = newPickupOrder;
            console.log(`Pickup order for ${creepName} changed to ${newPickupOrder}`);
        } else {
            console.log(`Creep ${creepName} not found.`);
        }
    },

    changeAllPickersPickupOrder: function(roomName, newPickupOrder) {
        let creeps = _.filter(Game.creeps, (creep) => creep.memory.role === 'picker' && creep.room.name === roomName);
        creeps.forEach(creep => {
            creep.memory.pickupOrder = newPickupOrder;
            console.log(`Pickup order for picker ${creep.name} changed to ${newPickupOrder}`);
        });
        console.log(`Pickup order for all pickers in room ${roomName} changed to ${newPickupOrder}`);
    },

    initializeRoomMemory: function(roomName) {
        if (!Game.rooms[roomName]) {
            console.log(`Room ${roomName} does not exist.`);
            return;
        }
        if (!Memory.rooms[roomName]) {
            Memory.rooms[roomName] = {};
        }
        Memory.rooms[roomName] = deepMerge(Memory.rooms[roomName], defaultRoomMemory);
        console.log(`Initialized memory for room ${roomName} with default values.`);
    },

    changeAllBuildersBuildPriority: function(roomName, newBuildPriority) {
        let creeps = _.filter(Game.creeps, (creep) => creep.memory.role === 'builder' && creep.room.name === roomName);
        creeps.forEach(creep => {
            creep.memory.buildPriority = newBuildPriority;
            console.log(`Build priority for builder ${creep.name} changed to ${JSON.stringify(newBuildPriority)}`);
        });
        console.log(`Build priority for all builders in room ${roomName} changed to ${JSON.stringify(newBuildPriority)}`);
    },

    changeBuilderBuildPriority: function(creepName, newBuildPriority) {
        let creep = Game.creeps[creepName];
        if (creep && creep.memory.role === 'builder') {
            creep.memory.buildPriority = newBuildPriority;
            console.log(`Build priority for builder ${creepName} changed to ${JSON.stringify(newBuildPriority)}`);
        } else {
            console.log(`Builder ${creepName} not found or is not a builder.`);
        }
    },

    changeAllBuildersRepairPriority: function(roomName, newRepairPriority) {
        let creeps = _.filter(Game.creeps, (creep) => creep.memory.role === 'builder' && creep.room.name === roomName);
        creeps.forEach(creep => {
            creep.memory.repairPriority = newRepairPriority;
            console.log(`Repair priority for builder ${creep.name} changed to ${JSON.stringify(newRepairPriority)}`);
        });
        console.log(`Repair priority for all builders in room ${roomName} changed to ${JSON.stringify(newRepairPriority)}`);
    },

    changeBuilderRepairPriority: function(creepName, newRepairPriority) {
        let creep = Game.creeps[creepName];
        if (creep && creep.memory.role === 'builder') {
            creep.memory.repairPriority = newRepairPriority;
            console.log(`Repair priority for builder ${creepName} changed to ${JSON.stringify(newRepairPriority)}`);
        } else {
            console.log(`Builder ${creepName} not found or is not a builder.`);
        }
    },

    changeAllBuildersPrioritizeRepairing: function(roomName, prioritizeRepairing) {
        let creeps = _.filter(Game.creeps, (creep) => creep.memory.role === 'builder' && creep.room.name === roomName);
        creeps.forEach(creep => {
            creep.memory.prioritizeRepairing = prioritizeRepairing;
            console.log(`Prioritize repairing for builder ${creep.name} changed to ${prioritizeRepairing}`);
        });
        console.log(`Prioritize repairing for all builders in room ${roomName} changed to ${prioritizeRepairing}`);
    },

    changeBuilderPrioritizeRepairing: function(creepName, prioritizeRepairing) {
        let creep = Game.creeps[creepName];
        if (creep && creep.memory.role === 'builder') {
            creep.memory.prioritizeRepairing = prioritizeRepairing;
            console.log(`Prioritize repairing for builder ${creepName} changed to ${prioritizeRepairing}`);
        } else {
            console.log(`Builder ${creepName} not found or is not a builder.`);
        }
    },

    changeAllBuildersPickupPriority: function(roomName, newPickupPriority) {
        let creeps = _.filter(Game.creeps, (creep) => creep.memory.role === 'builder' && creep.room.name === roomName);
        creeps.forEach(creep => {
            creep.memory.pickupPriority = newPickupPriority;
            console.log(`Pickup priority for builder ${creep.name} changed to ${JSON.stringify(newPickupPriority)}`);
        });
        console.log(`Pickup priority for all builders in room ${roomName} changed to ${JSON.stringify(newPickupPriority)}`);
    },

    changeBuilderPickupPriority: function(creepName, newPickupPriority) {
        let creep = Game.creeps[creepName];
        if (creep && creep.memory.role === 'builder') {
            creep.memory.pickupPriority = newPickupPriority;
            console.log(`Pickup priority for builder ${creepName} changed to ${JSON.stringify(newPickupPriority)}`);
        } else {
            console.log(`Builder ${creepName} not found or is not a builder.`);
        }
    },
    
    changeAllBuildersPickupThreshold: function(roomName, newPickupThreshold) {
        let creeps = _.filter(Game.creeps, (creep) => creep.memory.role === 'builder' && creep.room.name === roomName);
        creeps.forEach(creep => {
            creep.memory.pickupThreshold = newPickupThreshold;
            console.log(`Pickup threshold for builder ${creep.name} changed to ${JSON.stringify(newPickupThreshold)}`);
        });
        console.log(`Pickup threshold for all builders in room ${roomName} changed to ${JSON.stringify(newPickupThreshold)}`);
    },
    
    changeAllBuildersPickupPriority: function(roomName, newPickupPriority) {
        let creeps = _.filter(Game.creeps, (creep) => creep.memory.role === 'builder' && creep.room.name === roomName);
        creeps.forEach(creep => {
            creep.memory.pickupPriority = newPickupPriority;
            console.log(`Pickup priority for builder ${creep.name} changed to ${JSON.stringify(newPickupPriority)}`);
        });
        console.log(`Pickup priority for all builders in room ${roomName} changed to ${JSON.stringify(newPickupPriority)}`);
    },
    
    changeAllUpgradersPickupThreshold: function(roomName, newPickupThreshold) {
        let creeps = _.filter(Game.creeps, (creep) => creep.memory.role === 'upgrader' && creep.room.name === roomName);
        creeps.forEach(creep => {
            creep.memory.pickupThreshold = newPickupThreshold;
            console.log(`Pickup threshold for upgraders ${creep.name} changed to ${JSON.stringify(newPickupThreshold)}`);
        });
        console.log(`Pickup threshold for all upgrader in room ${roomName} changed to ${JSON.stringify(newPickupThreshold)}`);
    },
    
    changeAllUpgradersPickupPriority: function(roomName, newPickupPriority) {
        let creeps = _.filter(Game.creeps, (creep) => creep.memory.role === 'upgrader' && creep.room.name === roomName);
        creeps.forEach(creep => {
            creep.memory.pickupPriority = newPickupPriority;
            console.log(`Pickup priority for upgrader ${creep.name} changed to ${JSON.stringify(newPickupPriority)}`);
        });
        console.log(`Pickup priority for all upgraders in room ${roomName} changed to ${JSON.stringify(newPickupPriority)}`);
    },
    
    makeAllCreepsSayRole: function(role = null) {
        for (let name in Game.creeps) {
            let creep = Game.creeps[name];
            if (role === null || creep.memory.role === role) {
                creep.say(creep.memory.role);
            }
        }
        if (role) {
            console.log(`All ${role} creeps are saying their roles.`);
        } else {
            console.log('All creeps are saying their roles.');
        }
    },
        
    manualSpawnCreep: function(roomName, role, bodyP = null, customMemory = {}) {
        let spawn = Game.rooms[roomName].find(FIND_MY_SPAWNS)[0];
        if (!spawn) {
            console.log(`No spawn found in room ${roomName}`);
            return;
        }
        if (!defaultMemory[role]) {
            console.log(`Role ${role} does not exist in default memory configuration.`);
            return;
        }
    
        // Use default body parts if none are provided
        if (!bodyP) {
            bodyP = bodyParts[role];
            if (!bodyP) {
                console.log(`No default body parts found for role ${role}.`);
                return;
            }
        }
    
        const newName = `${role}_${Game.time}`;
        const memory = Object.assign({}, defaultMemory[role], customMemory);
    
        let result = spawn.spawnCreep(bodyP, newName, { memory });
        if (result === OK) {
            console.log(`Spawning new ${role}: ${newName} in room ${roomName}`);
        } else {
            console.log(`Failed to spawn ${role} in room ${roomName}: ${result}`);
        }
    },
        
    setClaimerTargetRoom: function(creepName, targetRoom) {
        let creep = Game.creeps[creepName];
        if (creep && creep.memory.role === 'claimer') {
            creep.memory.targetRoom = targetRoom;
            console.log(`Set target room for claimer ${creepName} to ${targetRoom}`);
        } else {
            console.log(`Claimer ${creepName} not found or is not a claimer.`);
        }
    },
    
    getCreepsInRoom: function(roomName) {
        console.log(_.filter(Game.creeps, (creep) => creep.room.name === roomName));
    },
    
    assignCreepToRoom: function(creepName, roomName) {
        if (Memory.creeps[creepName]) {
            Memory.creeps[creepName].room = roomName;
        } else {
            console.log(`Creep ${creepName} not found.`);
        }
    },

    setCreepFlag: function(creepName, flagName) {
        let creep = Game.creeps[creepName];
        if (creep) {
            creep.memory.flag = flagName;
            console.log(`Flag ${flagName} assigned to ${creepName}`);
        } else {
            console.log(`Creep ${creepName} not found.`);
        }
    },

    setRoleFlag: function(role, flagName) {
        let creeps = _.filter(Game.creeps, (creep) => creep.memory.role === role);
        creeps.forEach(creep => {
            creep.memory.flag = flagName;
            console.log(`Flag ${flagName} assigned to ${creep.name}`);
        });
        console.log(`Flag ${flagName} assigned to all ${role} creeps.`);
    },

    setRoleFlagInRoom: function(role, roomName, flagName) {
        let creeps = _.filter(Game.creeps, (creep) => creep.memory.role === role && creep.room.name === roomName);
        creeps.forEach(creep => {
            creep.memory.flag = flagName;
            console.log(`Flag ${flagName} assigned to ${creep.name} in room ${roomName}`);
        });
        console.log(`Flag ${flagName} assigned to all ${role} creeps in room ${roomName}.`);
    },
    
    setClaimerTargetRoom: function(creepName, targetRoom) {
        let creep = Game.creeps[creepName];
        if (creep && creep.memory.role === 'claimer') {
            creep.memory.targetRoom = targetRoom;
            console.log(`Set target room for claimer ${creepName} to ${targetRoom}`);
        } else {
            console.log(`Claimer ${creepName} not found or is not a claimer.`);
        }
    },
    
    spawnClaimer: function(roomName, targetRoom) {
        let spawn = Game.rooms[roomName].find(FIND_MY_SPAWNS)[0];
        if (!spawn) {
            console.log(`No spawn found in room ${roomName}`);
            return;
        }
        const newName = `claimer_${Game.time}`;
        const body = bodyParts['claimer'];
        const memory = Object.assign({}, defaultMemory['claimer'], { targetRoom: targetRoom });

        let result = spawn.spawnCreep(body, newName, { memory });
        if (result === OK) {
            console.log(`Spawning new claimer: ${newName} to claim room ${targetRoom}`);
        } else {
            console.log(`Failed to spawn claimer in room ${roomName}: ${result}`);
        }
    },
    
    spawnPioneer: function(roomName, targetRoom) {
        let spawn = Game.rooms[roomName].find(FIND_MY_SPAWNS)[0];
        if (!spawn) {
            console.log(`No spawn found in room ${roomName}`);
            return;
        }
        const newName = `pioneer_${Game.time}`;
        const body = bodyParts['pioneer'];
        const memory = Object.assign({}, defaultMemory['pioneer'], { targetRoom: targetRoom });

        let result = spawn.spawnCreep(body, newName, { memory });
        if (result === OK) {
            console.log(`Spawning new pioneer: ${newName} to help build room ${targetRoom}`);
        } else {
            console.log(`Failed to spawn pioneer in room ${roomName}: ${result}`);
        }
    }
};

// Deep merge function
function deepMerge(target, source) {
    for (const key in source) {
        if (source[key] instanceof Object && key in target) {
            Object.assign(source[key], deepMerge(target[key], source[key]));
        }
    }
    Object.assign(target || {}, source);
    return target;
}

module.exports = helperScript;

