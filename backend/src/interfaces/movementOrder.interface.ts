//EASY-TRACABILITY: backend//src/interface/mouvementOrderl.interface.ts

export interface IMovementOrder {
  uuid: string;
  ticketId: string;
  userUUID: string;
  date: Date;
}

export interface IMovementOrderCreation {
  uuid?: string;
  ticketId: string;
  userUUID: string;
  date: Date;
}
