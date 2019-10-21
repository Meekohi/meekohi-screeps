export default {
  finishJob(creep: Creep, job: Job) {
    console.log(`${creep.name} is done.`)
    creep.memory = { job_id: null }
    if (job) job.creep_id = null
  }
}
