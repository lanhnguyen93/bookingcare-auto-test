import { Role, User } from "./types";
import { api } from "./api";
import { randomUserData } from "../tests/testData/userData";

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
