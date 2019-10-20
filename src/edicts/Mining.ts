import harvest from "jobs/harvest";

function AssignMiningPos() {
  Memory.miningJobs = [];
  _.each(Memory.sources, source => {
    const terrain = Game.map.getRoomTerrain(source.room.name);
    for (let i = -1; i < 2; i++) {
      for (let j = -1; j < 2; j++) {
        if (i == 0 && j == 0) continue;
        const miningPos = new RoomPosition(source.pos.x + i, source.pos.y + j, source.room.name);
        const tmask = terrain.get(miningPos.x, miningPos.y);
        if (tmask != TERRAIN_MASK_WALL) {
          Memory.miningJobs.push({
            type: JobType.Harvest,
            id: `Harvest @ ${miningPos.x},${miningPos.y},${miningPos.roomName}`,
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
  console.log("Mining Edict");
  if (Memory.miningJobs.length < Memory.sources.length) AssignMiningPos(); // don't need to do this so often...
};
