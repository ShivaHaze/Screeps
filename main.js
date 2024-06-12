var roleDropper = require('role.dropper');
var roleUpgrader = require('role.upgrader');
var rolePicker = require('role.picker');
var roleBuilder = require('role.builder');
var towerLogic = require('tower');
var roleAttacker = require('role.attacker');
var roleDefender = require('role.defender');
var roleClaimer = require('role.claimer');
var roleHealer = require('role.healer');
var roleMiner = require('role.miner');
var rolePowerHarvester = require('role.powerHarvester');
var roleRemoteHarvester = require('role.remoteHarvester');
var roleScout = require('role.scout');
var rolePioneer = require('role.pioneer');
var memoryManager = require('memoryManager');
var spawnHelper = require('spawnHelper');
var helperScript = require('helperScript');
const { getDynamicBodyParts } = require('dynamicBodyParts');

let logging = false;

global.spawnHelper = spawnHelper; // Expose spawnHelper to the global scope
global.helperScript = helperScript; // Expose helperScript to the global scope

function getCurrentCreepCount(roomName, role) {
    return _.filter(Game.creeps, (creep) => creep.memory.role === role && creep.memory.room === roomName).length;
}

function log(message) {
    if (logging) {
        console.log(message);
    }
}

module.exports.loop = function () {
    // Clear memory of dead creeps
    for (var name in Memory.creeps) {
        if (!Game.creeps[name]) {
            delete Memory.creeps[name];
        }
    }

    // Update room memory information
    memoryManager.updateRoomMemory();

    // Spawning logic
    for (let spawnName in Game.spawns) {
        let spawn = Game.spawns[spawnName];
        let room = spawn.room;
        let roomName = room.name;

        if (!Memory.rooms[roomName].spawnPriority) {
            // Default spawn priorities
            Memory.rooms[roomName].spawnPriority = ['dropper', 'picker', 'dropper', 'picker', 'upgrader', 'builder', 'upgrader', 'builder'];
        }

        let spawnPriority = Memory.rooms[roomName].spawnPriority;
        let roleMaxLimits = Memory.rooms[roomName].roleMaxLimits || {};

        let roleCounts = {};
        spawnPriority.forEach(role => {
            roleCounts[role] = (roleCounts[role] || 0) + 1;
        });

        let roleToSpawn = null;

        // Determine the highest priority role that needs to be spawned
        for (let role of spawnPriority) {
            let currentRoleCount = getCurrentCreepCount(roomName, role);

            // If there are not enough creeps of this role
            if (currentRoleCount < roleCounts[role]) {
                roleToSpawn = role;
                break;
            }

            // Decrement the count of required roles as we move through the list
            roleCounts[role]--;
        }

        if (roleToSpawn) {
            let roleBodyParts = getDynamicBodyParts(roleToSpawn, room); // Use dynamic body parts
            // Try to spawn the creep
            let result = spawn.spawnCreep(roleBodyParts, `${roleToSpawn}_${Game.time}`, { dryRun: true });
            if (result == OK) {
                spawnHelper.spawnCreep(spawn, roleToSpawn, { room: roomName });
                log(`Spawning new ${roleToSpawn}`);
            } else {
                log(`Cannot spawn ${roleToSpawn} yet, waiting for energy`);
            }
        } else {
            log(`All roles are sufficiently spawned.`);
        }

        // Tower logic execution
        var towers = room.find(FIND_MY_STRUCTURES, {
            filter: { structureType: STRUCTURE_TOWER }
        });
        for (var tower of towers) {
            towerLogic.run(tower);
        }
    }

    // Role execution
    for (var name in Game.creeps) {
        var creep = Game.creeps[name];
        switch (creep.memory.role) {
            case 'dropper':
                roleDropper.run(creep);
                break;
            case 'upgrader':
                roleUpgrader.run(creep);
                break;
            case 'picker':
                rolePicker.run(creep);
                break;
            case 'builder':
                roleBuilder.run(creep);
                break;
            case 'attacker':
                roleAttacker.run(creep);
                break;
            case 'defender':
                roleDefender.run(creep);
                break;
            case 'claimer':
                roleClaimer.run(creep);
                break;
            case 'healer':
                roleHealer.run(creep);
                break;
            case 'miner':
                roleMiner.run(creep);
                break;
            case 'powerHarvester':
                rolePowerHarvester.run(creep);
                break;
            case 'remoteHarvester':
                roleRemoteHarvester.run(creep);
                break;
            case 'scout':
                roleScout.run(creep);
                break;
            case 'pioneer':
                rolePioneer.run(creep);
                break;
        }
    }
};

