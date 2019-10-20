import names from "./Population/names";

export default () => {
  console.log("Population Edict");
  console.log(Game.creeps);

  _.each(Game.spawns, spawn => {
    if (spawn.spawning) return;

    // At a minimum, make sure somebody is in the room helping you out.
    const roomCreeps = spawn.room.find(FIND_MY_CREEPS);
    if (roomCreeps.length < 3) {
      spawn.spawnCreep([WORK, MOVE, CARRY], _.sample(names));
    }
  });
};
