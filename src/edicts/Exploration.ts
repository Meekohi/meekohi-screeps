export default () => {
  console.log("Exploration Edict");
  // Update information in visible rooms
  // TODO: Should also run this at the end of an explore task so need to export it somewhere...
  const allVisibleSources = _.flatten(_.map(Game.rooms, room => room.find(FIND_SOURCES)));
  Memory.sources = Memory.sources.concat(allVisibleSources);
  Memory.sources = _.uniq(Memory.sources, s => s.id);

  const reachableRoomNames = _.uniq(_.flatten(_.map(Game.rooms, room => _.values(Game.map.describeExits(room.name)))));
  const reachableNonvisibleRooms = _.reject(reachableRoomNames, reachableRoomName =>
    _.some(Game.rooms, visibleRoom => visibleRoom.name == reachableRoomName)
  );

  // create some tasks to explore unexplored rooms? Under what conditions?
};
