import React from "react";
import { compare, genSalt, hash } from "bcrypt";
interface ArgStructure {
  email: string;
  password: string;
}
const ERROR_MESSAGE = { success: false, user: null };
export default async function validateUser({ email, password }: ArgStructure) {
  
}
