import workHelper from "utils/workHelper";

export default {
  name: "upgradeController",
  init(creep: Creep) { },
  work(creep: Creep) {
    // console.log(`🐝 ${this.name}, ${creep.name}`)
    creep.say("🐝");
    const job = _.find(Memory.jobs, j => j.id == creep.memory.job_id);
    if (!job) {
      creep.memory = { job_id: null };
      return;
    }
    if (!job.target_id) return workHelper.finishJob(creep, job) // not an upgradeController job

    const controller: StructureController | null = Game.getObjectById(job.target_id)
    if (!controller) throw ("Fuuuuck")

    creep.moveTo(controller.pos, { range: 3 })
    const result = creep.upgradeController(controller);

    if (result == OK) {
      if (creep.carry[RESOURCE_ENERGY] > 0) {
        return // Still have energy left, do it again next turn
      } else {
        return workHelper.finishJob(creep, job)
      }
    }

    if (creep.carry[RESOURCE_ENERGY] < creep.carryCapacity) {
      const target = creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES)
      if (target) {
        creep.moveTo(target, { visualizePathStyle: {} });
        creep.pickup(target);
      }
    }
  }
};
