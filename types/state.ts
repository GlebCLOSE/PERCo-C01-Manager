    type acm = 'control' | 'open' | ''
    type status = 'unlocked' | 'locked' | 'break' | ''
    type pass = 'active' | 'normal' | ''

export interface ExdevsState {
  number: string;
  type: string;
  physical_state: pass[];
  unlock_state: status[];
  access_mode: acm[];
}

const data: ExdevsState[] = [
  {
    "number": "1",
    "type": "turnstyle",
    "physical_state": ["", ""],
    "unlock_state": ["", ""],
    "access_mode": ["", ""]
  },
  {
    "number": "2",
    "type": "turnstyle",
    "physical_state": ["", ""],
    "unlock_state": ["", ""],
    "access_mode": ["", ""]
  }
];