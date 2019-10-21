import workHelper from "utils/workHelper";

export default {
  name: "harvest",
  init(creep: Creep) { },
  work(creep: Creep) {
    //creep.say(`⛏`);
    creep.room.visual.text(`⛏`, creep.pos.x, creep.pos.y + 0.2, { font: 0.5 })
    const job = _.find(Memory.jobs, j => j.id == creep.memory.job_id);
    if (!job) {
      creep.memory = { job_id: null }
      return;
    }
    if (!job.source_id) return workHelper.finishJob(creep, job) // not a miningJob
    if (!job.startingPos) return workHelper.finishJob(creep, job) // not a miningJob

    creep.drop(RESOURCE_ENERGY)

    const p = new RoomPosition(job.startingPos.x, job.startingPos.y, job.startingPos.roomName);

    // Make sure it's actually available
    try {
      const blocker = p.lookFor("structure")
      if (blocker.length && blocker[0].structureType != STRUCTURE_ROAD) {
        console.log("Vetoed job because a structure is in the way.")
        console.log(blocker)
        console.log(job.id)
        return workHelper.finishJob(creep, job)
      }
    } catch (e) { }

    const result = creep.moveTo(p);
    if (result == ERR_NO_PATH) {
      console.log("Vetoed job because I couldn't find a path.")
      console.log(creep.name)
      console.log(job.id)
      return workHelper.finishJob(creep, job)
    }

    const s: Source | null = Game.getObjectById(job.source_id);
    if (!s) throw "Fuuuuuck";
    creep.harvest(s);
  }
};
