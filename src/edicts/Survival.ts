import upgradeController from 'jobs/upgradeController'

export default () => {
  //console.log("Survival Edict");

  // 1. To survive, Room Controller needs energy.
  //   1. Bring me energy
  //   2. If there's not enough energy, ask some from the Mining Edict

  // Maybe have a listen of "maintenance" tasks like this so we know if we're asking too much of the miners?

  _.each(Game.rooms, room => {
    if (!room.controller) return;
    const controller = room.controller

    // lol
    if (!controller.my) return;

    // Emergency Mode
    if (controller.ticksToDowngrade < 10000) {

    }

    // Let's have two dedicated picker-uppers
    _.each(["A", "B"], v => {
      const id = `${upgradeController.name} @ ${room.name} ${v}`
      if (_.some(Memory.jobs, j => j.id == id)) return;

      Memory.jobs.push({
        id,
        type: upgradeController.name,
        target_id: controller.id,
        priority: 10,
        creep_id: null
      });
    })
  })
};
