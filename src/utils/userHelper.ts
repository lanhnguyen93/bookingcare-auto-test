import { Role, User } from "./types";
import { api } from "./api";
import { randomUserData } from "../tests/testData/userData";
import axios from "axios";

export async function createUserByApi(token: string, role?: Role) {
  const randomUser = randomUserData(role);

  const response = await api.post("/api/create-new-user", randomUser, {
    headers: { Authorization: token },
  });

  let user: User = await response.data.user;
  return user;
}

export async function deleteUserByApi(token: string, userId: string) {
  const response = await api.delete("/api/delete-user", {
    headers: { Authorization: token },
    params: { id: userId },
  });
  if (response.status !== 200 || response.data.errCode !== 0) {
    throw new Error("Failed to delete user");
  }
}

export async function deleteUserByEmail(token: string, email: string) {
  const users = await getAllUserByApi(token);
  let id = "";
  const user = users.find((user: User) => user.email === email);
  if (user.id) {
    await deleteUserByApi(token, user.id);
  } else {
    throw new Error("The user is not exist");
  }
}

/**
 * The function get user by Id
 * @param token
 * @param id is userId, default "ALL" when get all users
 * @returns list of users
 */
export async function getAllUserByApi(token: string, id?: string) {
  const response = await axios.get(
    `${process.env.SERVER_URL}/api/get-all-users`,
    {
      headers: { Authorization: token },
      params: { id: id ? id : "ALL" },
    }
  );
  if (response.status !== 200 || response.data.errCode !== 0) {
    throw new Error("Failed to get user");
  }
  return response.data.users;
}
