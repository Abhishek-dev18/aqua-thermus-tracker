
export interface Customer {
  id: string;
  name: string;
  area: string;
  mobile: string;
  preferences: {
    jar: boolean;
    thermos: boolean;
  };
  rates: {
    jar: number;
    thermos: number;
  };
  createdAt: Date;
}

export interface Supply {
  id: string;
  customerId: string;
  date: Date;
  delivered: {
    jars: number;
    thermos: number;
  };
  returned: {
    jars: number;
    thermos: number;
  };
  payment: number;
}

export interface Area {
  id: string;
  name: string;
}
