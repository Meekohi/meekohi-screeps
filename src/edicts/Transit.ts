import build from 'jobs/build'

export default () => {
  _.each(Game.spawns, spawn => {
    const controller = spawn.room.controller
    if (!controller) return
    if (controller.level <= 1) return

    // Level 2... let's increase efficiency a bit with roads
    buildRoadsLevel2(spawn)
  })
};

let transitLevel: number = 0;

function buildRoadsLevel2(spawn: StructureSpawn) {
  if (transitLevel >= 2) return;
  transitLevel = 2;
  console.log("Upgrading to Transit Level 2")

  Memory.jobs = _.reject(Memory.jobs, j => j.id.includes('RoadBuilder'))

  const controller = spawn.room.controller
  if (!controller) return
  const sources = spawn.room.find(FIND_SOURCES);
  _.each(sources, source => {
    const path = controller.pos.findPathTo(source.pos, { swampCost: 1, ignoreCreeps: true, range: 1 })
    _.each(path, step => {
      spawn.room.createConstructionSite(step.x, step.y, STRUCTURE_ROAD)
    })

    const id = `RoadBuilder ${controller.room.name} ${source.id}`
    Memory.jobs.push({
      id,
      type: build.name,
      priority: 10,
      creep_id: null
    });
  })
}
