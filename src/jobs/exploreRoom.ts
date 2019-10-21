import workHelper from "utils/workHelper";

export default {
  name: "exploreRoom",
  init(creep: Creep) { },
  work(creep: Creep) {
    console.log(`🔭 ${this.name}, ${creep.name}`)
    creep.say("🔭");
    const job = _.find(Memory.jobs, j => j.id == creep.memory.job_id);
    if (!job) {
      creep.memory = { job_id: null };
      return;
    }
    if (job.type != this.name) {
      console.log("JOB MISMATCH???")
      return;
    }
    if (!job.targetPos) {
      console.log("Exploration job is missing a targetPos?")
      return workHelper.finishJob(creep, job) // not an exploreRoom job
    }

    const p = new RoomPosition(job.targetPos.x, job.targetPos.y, job.targetPos.roomName)

    if (creep.room.name != job.targetPos.roomName) {
      console.log("FOUND ANOTHER ROOM, WOW")

      // Don't write down sources is enemy rooms, I guess?
      if (!creep.room.controller || creep.room.controller.my) {
        const newSources = creep.room.find(FIND_SOURCES)
        Memory.sources = Memory.sources.concat(newSources);
        Memory.sources = _.uniq(Memory.sources, s => s.id);
      }

      // This job is FINISHED.
      workHelper.finishJob(creep, job)
      job.creep_id = "FINISHED" // never do it again
      return
    }

    const result = creep.moveTo(p, { visualizePathStyle: {} })

    if (result != OK) {
      console.log("NO PATH")
      console.log(p)
      console.log(result)
      return workHelper.finishJob(creep, job)
    }

  }
};
