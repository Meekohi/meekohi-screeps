import { ErrorMapper } from "utils/ErrorMapper";
import Mining from "edicts/Mining";
import Population from "edicts/Population";
import Transit from "edicts/Transit";
import Exploration from "edicts/Exploration";

import harvest from "jobs/harvest";

Memory.sources = Memory.sources || [];
Memory.miningJobs = Memory.miningJobs || [];
Memory.jobs = Memory.jobs || [];

// When compiling TS to JS and bundling with rollup, the line numbers and file names in error messages change
// This utility uses source maps to get the line numbers and file names of the original, TS source code
export const loop = ErrorMapper.wrapLoop(() => {
  console.log(`Current game tick is ${Game.time}`);

  // Edicts cache useful information in Memory and generate jobs
  Population();
  Exploration();
  Mining();
  Transit();

  // The thing that assigns work to creeps
  const jobs = _.filter(Memory.jobs, j => j.creep_id == null);
  const idleCreeps = _.filter(Game.creeps, c => !c.memory.job_id);

  const job = _.sample(jobs);
  const idleCreep = _.sample(idleCreeps);

  console.log(jobs);
  console.log(idleCreeps);

  if (job && idleCreep) {
    console.log(job, idleCreep);
    idleCreep.memory.job_id = job.id;
    const idx = _.findIndex(Memory.jobs, j => j.id == job.id);
    if (idx >= 0) Memory.jobs[idx].creep_id = idleCreep.id;
  }

  // The thing that makes creeps do work
  _.each(Memory.jobs, job => {
    if (!job.creep_id) {
      job.creep_id = null;
      return; // Worker died
    }
    const creep: Creep | null = Game.getObjectById(job.creep_id);
    if (!creep) return;
    harvest.work(creep);
  });

  // Automatically delete memory of missing creeps
  for (const name in Memory.creeps) {
    if (!(name in Game.creeps)) {
      delete Memory.creeps[name];
    }
  }
});
