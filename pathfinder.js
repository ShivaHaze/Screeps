let logging = false;

var pathfinder = {
    findOptimalPath: function(creep, target) {
        const plainCost = 2;
        const swampCost = 10;
        const roadCost = 1;
        const obstacleCost = 255;
        const creepCost = 255; // High cost to avoid creeps

        let roomCallback = function(roomName) {
            let room = Game.rooms[roomName];
            if (!room) return new PathFinder.CostMatrix;

            let costs = new PathFinder.CostMatrix;

            // Add terrain costs
            let terrain = new Room.Terrain(roomName);
            for (let y = 0; y < 50; y++) {
                for (let x = 0; x < 50; x++) {
                    if (terrain.get(x, y) === TERRAIN_MASK_SWAMP) {
                        costs.set(x, y, swampCost);
                    } else if (terrain.get(x, y) === TERRAIN_MASK_WALL) {
                        costs.set(x, y, obstacleCost);
                    } else {
                        costs.set(x, y, plainCost);
                    }
                }
            }

            // Add structure costs
            room.find(FIND_STRUCTURES).forEach(function(struct) {
                if (struct.structureType === STRUCTURE_ROAD) {
                    costs.set(struct.pos.x, struct.pos.y, roadCost);
                } else if (
                    struct.structureType === STRUCTURE_CONTAINER ||
                    (struct.structureType === STRUCTURE_RAMPART && struct.my)
                ) {
                    costs.set(struct.pos.x, struct.pos.y, plainCost);
                } else {
                    costs.set(struct.pos.x, struct.pos.y, obstacleCost);
                }
            });

            // Add construction site costs
            room.find(FIND_CONSTRUCTION_SITES).forEach(function(site) {
                if (site.structureType === STRUCTURE_ROAD) {
                    costs.set(site.pos.x, site.pos.y, roadCost);
                } else {
                    costs.set(site.pos.x, site.pos.y, obstacleCost);
                }
            });

            // Add creep costs
            room.find(FIND_CREEPS).forEach(function(otherCreep) {
                if (otherCreep.id !== creep.id) {
                    costs.set(otherCreep.pos.x, otherCreep.pos.y, creepCost);
                }
            });

            return costs;
        };

        // Ensure target is formatted correctly
        let targetPos = target.pos ? target.pos : target;

        // Log the current positions
        log(`${creep.name} moving from [${creep.pos.x}, ${creep.pos.y}] to target [${targetPos.x}, ${targetPos.y}]`);

        let path = PathFinder.search(
            creep.pos, { pos: targetPos, range: 1 },
            {
                plainCost: plainCost,
                swampCost: swampCost,
                roomCallback: roomCallback,
                maxOps: 2000, // Increase maxOps for more complex pathfinding
                flee: false
            }
        );

        // Log the path for debugging
        if (path.path && path.path.length > 0) {
            log(`${creep.name} path: ${path.path.map(p => `[${p.x}, ${p.y}]`).join(' -> ')}`);
        } else {
            log(`${creep.name} no path found to target at [${targetPos.x}, ${targetPos.y}]`);
        }

        return path;
    },

    avoidRoomEdges: function(creep) {
        if (creep.pos.x === 0) {
            creep.move(RIGHT);
        } else if (creep.pos.x === 49) {
            creep.move(LEFT);
        } else if (creep.pos.y === 0) {
            creep.move(BOTTOM);
        } else if (creep.pos.y === 49) {
            creep.move(TOP);
        }
    }
};

function log(message) {
    if (logging) {
        console.log(message);
    }
}

module.exports = pathfinder;

