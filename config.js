module.exports = {
    defaultMemory: {
        dropper: { role: 'dropper', room: null, currentRoom: null },
        picker: { 
            role: 'picker', 
            pickupPriority: ['dropped', 'container', 'storage'],
            pickupThreshold: { 'dropped': 100, 'container': 100, 'storage': 100 },
            mineralPickupThreshold: {
                'H': 1, 'O': 1, 'U': 1, 'L': 1, 'K': 1, 'Z': 1, 'X': 1, 'G': 1,
                'OH': 1, 'ZK': 1, 'UL': 1, 'UH': 1, 'UO': 1, 'KH': 1, 'KO': 1, 'LH': 1, 'LO': 1,
                'ZH': 1, 'ZO': 1, 'GH': 1, 'GO': 1, 'UH2O': 1, 'UHO2': 1, 'KH2O': 1, 'KHO2': 1,
                'LH2O': 1, 'LHO2': 1, 'ZH2O': 1, 'ZHO2': 1, 'GH2O': 1, 'GHO2': 1, 'XUH2O': 1, 'XUHO2': 1,
                'XKH2O': 1, 'XKHO2': 1, 'XLH2O': 1, 'XLHO2': 1, 'XZH2O': 1, 'XZHO2': 1, 'XGH2O': 1, 'XGHO2': 1
            },
            mineralPickupPriority: [
                'G', 'X', 'H', 'O', 'U', 'L', 'K', 'Z',
                'OH', 'ZK', 'UL', 'UH', 'UO', 'KH', 'KO', 'LH', 'LO',
                'ZH', 'ZO', 'GH', 'GO', 'UH2O', 'UHO2', 'KH2O', 'KHO2',
                'LH2O', 'LHO2', 'ZH2O', 'ZHO2', 'GH2O', 'GHO2', 'XUH2O', 'XUHO2',
                'XKH2O', 'XKHO2', 'XLH2O', 'XLHO2', 'XZH2O', 'XZHO2', 'XGH2O', 'XGHO2'
            ],
            pickupOrder: 'energy', // Default pickup order
            room: null,
            currentRoom: null
        },
        upgrader: { 
            role: 'upgrader',
            pickupPriority: ['dropped', 'container', 'storage'],
            pickupThreshold: { 'dropped': 100, 'container': 100, 'storage': 100 },
            room: null,
            currentRoom: null
        },
        builder: { 
            role: 'builder',
            buildPriority: [
                STRUCTURE_CONTAINER,
                STRUCTURE_SPAWN, STRUCTURE_EXTENSION, STRUCTURE_ROAD, STRUCTURE_WALL, STRUCTURE_RAMPART,
                STRUCTURE_TOWER, STRUCTURE_CONTAINER, STRUCTURE_STORAGE, STRUCTURE_LINK, STRUCTURE_TERMINAL,
                STRUCTURE_LAB, STRUCTURE_OBSERVER, STRUCTURE_POWER_SPAWN, STRUCTURE_NUKER, STRUCTURE_FACTORY,
                STRUCTURE_EXTRACTOR
            ],
            repairPriority: [
                STRUCTURE_TOWER, STRUCTURE_CONTAINER, STRUCTURE_ROAD, STRUCTURE_WALL, STRUCTURE_RAMPART,
                STRUCTURE_EXTENSION, STRUCTURE_SPAWN, STRUCTURE_STORAGE, STRUCTURE_LINK, STRUCTURE_TERMINAL,
                STRUCTURE_LAB, STRUCTURE_OBSERVER, STRUCTURE_POWER_SPAWN, STRUCTURE_NUKER, STRUCTURE_FACTORY
            ],
            prioritizeRepairing: false,
            pickupPriority: ['dropped', 'container', 'storage'], // Default pickup priority
            pickupThreshold: { 'dropped': 100, 'container': 100, 'storage': 100 },
            room: null,
            currentRoom: null
        },
        attacker: { role: 'attacker', room: null, currentRoom: null, rallyPointName: 'RallyPoint' },
        defender: { role: 'defender', room: null, currentRoom: null, rallyPointName: 'DefendPoint' },
        claimer: { role: 'claimer', room: null, currentRoom: null, targetRoom: null },
        healer: { role: 'healer', room: null, currentRoom: null, rallyPointName: 'HealPoint' },
        miner: { role: 'miner', room: null, currentRoom: null },
        powerHarvester: { role: 'powerHarvester', room: null, currentRoom: null, rallyPointName: 'PowerHarvestPoint' },
        remoteHarvester: { role: 'remoteHarvester', room: null, currentRoom: null, rallyPointName: 'RemoteHarvestPoint' },
        scout: { role: 'scout', room: null, currentRoom: null, targetRoom: null },
        pioneer: { role: 'pioneer', room: null, currentRoom: null, targetRoom: null }
    },
    bodyParts: {
        dropper: [WORK, WORK, WORK, MOVE, MOVE],
        upgrader: [WORK, WORK, WORK, CARRY, MOVE],
        picker: [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE],
        builder: [WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE],
        attacker: [TOUGH, TOUGH, ATTACK, ATTACK, MOVE, MOVE],
        defender: [TOUGH, TOUGH, RANGED_ATTACK, RANGED_ATTACK, MOVE, MOVE],
        claimer: [CLAIM, MOVE],
        healer: [HEAL, MOVE],
        miner: [WORK, WORK, WORK, WORK, WORK, MOVE],
        powerHarvester: [WORK, WORK, CARRY, CARRY, MOVE, MOVE],
        remoteHarvester: [WORK, CARRY, MOVE, MOVE],
        scout: [MOVE],
        pioneer: [WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE]
    },
    defaultRoomMemory: {
        buildPriority: [
            STRUCTURE_SPAWN, STRUCTURE_EXTENSION, STRUCTURE_ROAD,
            STRUCTURE_WALL, STRUCTURE_RAMPART, STRUCTURE_KEEPER_LAIR,
            STRUCTURE_PORTAL, STRUCTURE_CONTROLLER, STRUCTURE_LINK,
            STRUCTURE_STORAGE, STRUCTURE_TOWER, STRUCTURE_OBSERVER,
            STRUCTURE_POWER_BANK, STRUCTURE_POWER_SPAWN, STRUCTURE_EXTRACTOR,
            STRUCTURE_LAB, STRUCTURE_TERMINAL, STRUCTURE_CONTAINER, STRUCTURE_NUKER,
            STRUCTURE_FACTORY
        ],
        repairPriority: [
            STRUCTURE_SPAWN, STRUCTURE_EXTENSION, STRUCTURE_ROAD,
            STRUCTURE_WALL, STRUCTURE_RAMPART, STRUCTURE_KEEPER_LAIR,
            STRUCTURE_PORTAL, STRUCTURE_CONTROLLER, STRUCTURE_LINK,
            STRUCTURE_STORAGE, STRUCTURE_TOWER, STRUCTURE_OBSERVER,
            STRUCTURE_POWER_BANK, STRUCTURE_POWER_SPAWN, STRUCTURE_EXTRACTOR,
            STRUCTURE_LAB, STRUCTURE_TERMINAL, STRUCTURE_CONTAINER, STRUCTURE_NUKER,
            STRUCTURE_FACTORY
        ],
        repairThresholds: {
            [STRUCTURE_ROAD]: 0.7,
            [STRUCTURE_CONTAINER]: 0.8,
            [STRUCTURE_WALL]: 0.00033,
            [STRUCTURE_RAMPART]: 0.025,
            [STRUCTURE_SPAWN]: 0.9,
            [STRUCTURE_EXTENSION]: 0.9,
            [STRUCTURE_LINK]: 0.9,
            [STRUCTURE_STORAGE]: 0.9,
            [STRUCTURE_TOWER]: 0.9,
            [STRUCTURE_OBSERVER]: 0.9,
            [STRUCTURE_POWER_SPAWN]: 0.9,
            [STRUCTURE_EXTRACTOR]: 0.9,
            [STRUCTURE_LAB]: 0.9,
            [STRUCTURE_TERMINAL]: 0.9,
            [STRUCTURE_NUKER]: 0.9,
            [STRUCTURE_FACTORY]: 0.9
        },
        maxRepair: {
            [STRUCTURE_ROAD]: 1,
            [STRUCTURE_CONTAINER]: 1,
            [STRUCTURE_WALL]: 0.00033,
            [STRUCTURE_RAMPART]: 0.040,
            [STRUCTURE_SPAWN]: 1.0,
            [STRUCTURE_EXTENSION]: 1.0,
            [STRUCTURE_LINK]: 1.0,
            [STRUCTURE_STORAGE]: 1.0,
            [STRUCTURE_TOWER]: 1.0,
            [STRUCTURE_OBSERVER]: 1.0,
            [STRUCTURE_POWER_SPAWN]: 1.0,
            [STRUCTURE_EXTRACTOR]: 1.0,
            [STRUCTURE_LAB]: 1.0,
            [STRUCTURE_TERMINAL]: 1.0,
            [STRUCTURE_NUKER]: 1.0,
            [STRUCTURE_FACTORY]: 1.0
        },
        fillPriority: [
            STRUCTURE_EXTENSION, STRUCTURE_SPAWN, STRUCTURE_TOWER,
            STRUCTURE_STORAGE, STRUCTURE_CONTAINER, STRUCTURE_LAB,
            STRUCTURE_TERMINAL, STRUCTURE_NUKER, STRUCTURE_FACTORY
        ],
        options: {
            towerAttack: true,
            towerHeal: false,
            towerRepair: false
        },
        energyThreshold: 0.1
    }
};

