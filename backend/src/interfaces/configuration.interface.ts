//EASY-TRACABILITY: backend/src/interface/configuration.interface.ts

export interface IConfiguration {
  uuid: string;
  parameterName: string;
  parameterValue: string;
  lastModifiedAt: Date;
  lastModifiedBy: string;
}

export interface IConfigurationCreation {
  uuid?: string;
  parameterName: string;
  parameterValue: string;
  lastModifiedAt: Date;
  lastModifiedBy: string;
}

export interface IConfigurationUpdate {
  parameterName?: string;
  parameterValue?: string;
  lastModifiedAt?: Date;
  lastModifiedBy?: string;
}
