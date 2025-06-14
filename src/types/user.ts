export default interface User {
  _id: string;
  name: string;
  email: string;
  password: string;
//   LcHandle: string;
//   LcRank: number;
//   LcRating: number;
//   CfHandle: string;
//   CfRank: number;
//   CfRating: number;
//   CcHandle: string;
//   CcRank: number;
//   CcRating: number;
  createdAt: Date;
  updatedAt: Date;
}