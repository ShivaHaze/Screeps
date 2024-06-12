var towerLogic = {
    run: function(tower) {
        let roomMemory = Memory.rooms[tower.room.name];

        if (roomMemory.options.towerAttack) {
            var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS, {
                filter: (creep) => {
                    // If the creep is named "Drainer" and is within 2 tiles of the room edge, ignore it
                    if (creep.name.includes("Drainer")) {
                        if (creep.pos.x <= 2 || creep.pos.x >= 47 || creep.pos.y <= 2 || creep.pos.y >= 47) {
                            return false;
                        }
                    }
                    // Attack all other hostiles
                    return true;
                }
            });
            
            if (closestHostile) {
                tower.attack(closestHostile);
            }
        }

        if (roomMemory.options.towerHeal) {
            var closestDamagedCreep = tower.pos.findClosestByRange(FIND_MY_CREEPS, {
                filter: (creep) => creep.hits < creep.hitsMax
            });
            if (closestDamagedCreep) {
                tower.heal(closestDamagedCreep);
            }
        }

        if (roomMemory.options.towerRepair) {
            var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (structure) => structure.hits < structure.hitsMax && structure.structureType != STRUCTURE_WALL
            });
            if (closestDamagedStructure) {
                tower.repair(closestDamagedStructure);
            }
        }
    }
};

module.exports = towerLogic;

