export interface AuthResponse {
  jwt: string;
}

export interface Employees {
  _id: string;
  email: string;
  name: string;
  lastname: string;
  attendance: Date | null;
  following: Following[];
}

export interface Following {
  email: string;
  name: string;
  lastname: string;
}

export interface EmployeesAndFollwing {
  employees: Employees[];
  following: Following[];
}
