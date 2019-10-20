export default {
  name: "harvest",
  init(creep: Creep) {},
  work(creep: Creep) {
    creep.say("⛏");
    const job = _.find(Memory.miningJobs, j => j.id == creep.memory.job_id);
    if (!job) {
      creep.memory.job_id = null;
      return;
    }
    const p = new RoomPosition(job.startingPos.x, job.startingPos.y, job.startingPos.roomName);
    const result = creep.moveTo(p);
    const s: Source | null = Game.getObjectById(job.source_id);
    if (!s) throw "Fuuuuuck";
    creep.harvest(s);
    console.log(result);
  }
};
