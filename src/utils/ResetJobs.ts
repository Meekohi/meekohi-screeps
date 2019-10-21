export default () => {
  Memory.jobs = []
  _.each(Game.creeps, creep => {
    creep.memory = { job_id: null }
  })
}
