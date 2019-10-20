// example declaration file - remove these and add your own custom typings

// memory extension samples
interface CreepMemory {
  job_id: string | null;
}

declare enum JobType {
  Harvest
}

interface Job {
  id: string;
  type: JobType;
  startingPos: RoomPosition;
  priority: number;
  creep_id: string | null;
}

interface MiningJob extends Job {
  source_id: string;
}

interface Memory {
  uuid: number;
  log: any;
  sources: Source[];
  miningJobs: MiningJob[];
  jobs: Job[];
}

// `global` extension samples
declare namespace NodeJS {
  interface Global {
    log: any;
  }
}
