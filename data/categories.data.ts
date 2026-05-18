
export type CategoryStatus = "ACTIVE" | "HIDDEN";
export type Category = {
  id: string;
  name: string;
  description: string;
  status: CategoryStatus;
  _count:{
    blogs: number
  }
};
