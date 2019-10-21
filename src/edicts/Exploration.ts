import exploreRoom from 'jobs/exploreRoom';

export default () => {
  //console.log("Exploration Edict");

  // Update information in visible rooms
  // TODO: Should also run this at the end of an explore task so need to export it somewhere...
  const allVisibleSources = _.flatten(_.map(Game.rooms, room => room.find(FIND_SOURCES)));
  Memory.sources = Memory.sources.concat(allVisibleSources);
  Memory.sources = _.uniq(Memory.sources, s => s.id);

  // Any rooms we should explore?
  // For now just search one step from any spawn...
  _.each(Game.spawns, spawn => {
    const dirs = [FIND_EXIT_TOP, FIND_EXIT_LEFT, FIND_EXIT_RIGHT, FIND_EXIT_BOTTOM]
    _.each(dirs, dir => {
      const id = `${exploreRoom.name} ${spawn.room.name} ${dir}`
      if (_.some(Memory.jobs, j => j.id == id)) return;

      const exit = spawn.pos.findClosestByPath(dir);
      if (!exit) return

      Memory.jobs.push({
        id,
        type: exploreRoom.name,
        priority: 10,
        targetPos: exit,
        creep_id: null
      });
    })
  })

};
