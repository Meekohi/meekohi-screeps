import _ from 'lodash'

import { ErrorMapper } from "utils/ErrorMapper";
import ResetJobs from "utils/ResetJobs"

import Survival from "edicts/Survival";
import Mining from "edicts/Mining";
import Population from "edicts/Population";
import Transit from "edicts/Transit";
import Exploration from "edicts/Exploration";

import harvest from "jobs/harvest";
import upgradeController from "jobs/upgradeController";
import exploreRoom from "jobs/exploreRoom";
import build from "jobs/build";

Memory.sources = Memory.sources || [];
Memory.jobs = Memory.jobs || [];

console.log("======= Reploy @", new Date())

export const loop = ErrorMapper.wrapLoop(() => {
  console.log(`~~~~~~~~~~ ${Game.time}`);

  if (Game.flags['reset']) {
    console.log("Resetting all jobs...")
    Game.flags['reset'].remove()
    ResetJobs();
  }

  // Edicts cache useful information in Memory and generate jobs
  Survival()
  Population();
  Exploration();
  Mining();
  Transit();

  // The thing that assigns work to creeps
  {
    const jobs = _.filter(Memory.jobs, j => j.creep_id == null);
    const idleCreeps = _.filter(Game.creeps, c => (c.id && !c.memory.job_id));

    const job = _.sample(jobs);
    const idleCreep = _.sample(idleCreeps);

    if (job && idleCreep) {
      console.log(`Assigned ${job.id} to ${idleCreep.name}`)
      idleCreep.memory.job_id = job.id;
      job.creep_id = idleCreep.id
      job.llama = "ok!"
    }
  }

  // The thing that makes creeps do work
  _.each(Memory.jobs, job => {
    if (!job.creep_id) {
      job.creep_id = null;
      return;
    }
    const creep: Creep | null = Game.getObjectById(job.creep_id);
    if (!creep) {
      job.creep_id = null;
      return; // Worker died
    }
    creep.room.visual.circle(creep.pos.x, creep.pos.y, { radius: 0.5, fill: '#fff0', lineStyle: 'dashed', stroke: creep.name })

    if (job.id != creep.memory.job_id) {
      console.log("JOB MISMATCH")
      console.log(`Sending ${creep.name} to`)
      console.log(job.id)
      console.log(creep.memory.job_id)
    }


    if (job.type == harvest.name)
      harvest.work(creep);
    if (job.type == upgradeController.name)
      upgradeController.work(creep)
    if (job.type == exploreRoom.name)
      exploreRoom.work(creep)
    if (job.type == build.name)
      build.work(creep)

  });

  // Automatically delete memory of missing creeps
  for (const name in Memory.creeps) {
    if (!(name in Game.creeps)) {
      delete Memory.creeps[name];
    }
  }
});
