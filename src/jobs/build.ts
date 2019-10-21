import workHelper from 'utils/workHelper'

export default {
  name: "build",
  init(creep: Creep) { },
  work(creep: Creep) {
    console.log(`🚗 ${this.name}, ${creep.name}`)
    creep.say("🚗");
    const job = _.find(Memory.jobs, j => j.id == creep.memory.job_id);
    if (!job) {
      creep.memory = { job_id: null }
      return
    }

    const site = creep.pos.findClosestByPath(FIND_MY_CONSTRUCTION_SITES)
    if (!site) return workHelper.finishJob(creep, job)

    const moveResult = creep.moveTo(site.pos, { range: 3, visualizePathStyle: {} })
    const result = creep.build(site);
    const pct = (site.progress / site.progressTotal)
    const pie = pct < .25 ? '◷' :
      pct < .50 ? '◔' :
        pct < .75 ? '◒' : '◕'
    creep.say(`🚗 ${pie}`)

    if (result == OK) {
      if (creep.carry[RESOURCE_ENERGY] > 0) {
        return // Still have energy left, do it again next turn
      } else {
        return workHelper.finishJob(creep, job)
      }
    }

    if (creep.carry[RESOURCE_ENERGY] < creep.carryCapacity) {
      if (!creep.memory.target_id) {
        const drops = _.filter(creep.room.find(FIND_DROPPED_RESOURCES), drops => drops.amount > 50)
        const target = _.sample(drops)
        creep.memory.target_id = target.id
      }

      const target: Resource | null = Game.getObjectById(creep.memory.target_id)
      if (target) {
        creep.moveTo(target, { visualizePathStyle: {} });
        creep.pickup(target);
      } else {
        delete creep.memory.target_id
      }
    }
  }
};
