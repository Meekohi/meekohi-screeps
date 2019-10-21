// example declaration file - remove these and add your own custom typings

// memory extension samples
interface CreepMemory {
  job_id: string | null;
  target_id?: string;
}

interface Job {
  id: string;
  type: string;
  priority: number;
  creep_id: string | null;
  startingPos?: RoomPosition;
  targetPos?: RoomPosition;
  source_id?: string;
  target_id?: string;
  llama?: string;
}

interface Memory {
  uuid: number;
  log: any;
  sources: Source[];
  jobs: Job[];
}

// `global` extension samples
declare namespace NodeJS {
  interface Global {
    log: any;
  }
}
