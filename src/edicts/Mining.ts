import harvest from "jobs/harvest";

function AssignMiningPos() {
  _.each(Memory.sources, source => {

    const r = _.map(Game.spawns, spawn => {
      const p = new RoomPosition(source.pos.x, source.pos.y, source.pos.roomName)
      return spawn.pos.getRangeTo(p)
    })
    if (_.min(r) > 100) {
      console.log(`Aborting job because the source is too far from the spawn`)
      console.log(r)
      return;
    }

    const terrain = Game.map.getRoomTerrain(source.room.name);
    for (let i = -1; i < 2; i++) {
      for (let j = -1; j < 2; j++) {
        if (i == 0 && j == 0) continue;

        const miningPos = new RoomPosition(source.pos.x + i, source.pos.y + j, source.room.name);
        const id = `Harvest @ ${miningPos.x},${miningPos.y},${miningPos.roomName}`

        // Check for duplicate
        if (_.some(Memory.jobs, j => j.id == id)) continue;

        const tmask = terrain.get(miningPos.x, miningPos.y);
        if (tmask != TERRAIN_MASK_WALL) {
          Memory.jobs.push({
            id,
            type: harvest.name,
            startingPos: miningPos,
            priority: 10,
            source_id: source.id,
            creep_id: null
          });
        }
      }
    }
  });
}

export default () => {
  //console.log("Mining Edict");

  // Don't need to do this so often. Trigger from Explore if you find a new one...
  const miningJobs = _.filter(Memory.jobs, j => j.type == 'harvest')
  if (miningJobs.length == 0) AssignMiningPos();
};
