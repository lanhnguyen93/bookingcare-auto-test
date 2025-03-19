import { expect, test } from "@playwright/test";
import { apiClient } from "../../../utils/apiClient";
import testData from "../testData/testLoginData.json";

test.describe("Login API", () => {
  test("should login successfully with valid credentials", async ({
    request,
  }) => {
    const response = await request.post(`${process.env.SERVER_URL}/api/login`, {
      data: {
        email: testData.validEmail,
        password: testData.validPassword,
      },
    });

    let data = await response.json();

    expect(response.status()).toBe(200);
    expect(data.errCode).toBe(0);
    expect(data).toHaveProperty("token");
    expect(data).toHaveProperty("userInfor");
  });

  test("should fail to login with missing email", async () => {
    const response = await apiClient.post("/api/login", {
      email: "",
      password: testData.validPassword,
    });

    expect(response.data.errCode).toBe(1);
    expect(response.data.message).toBe("Missing input parameter");
  });

  test("should fail to login with missing password", async () => {
    const response = await apiClient.post("/api/login", {
      email: testData.validEmail,
      password: "",
    });

    expect(response.data.errCode).toBe(1);
    expect(response.data.message).toBe("Missing input parameter");
  });

  test("should fail to login with non-existent email", async () => {
    const response = await apiClient.post("/api/login", {
      email: testData.invalidEmail,
      password: testData.validPassword,
    });

    expect(response.data.errCode).toBe(2);
    expect(response.data.message).toBe("The email is not exits!");
  });

  test("should fail to login with wrong password", async () => {
    const response = await apiClient.post("/api/login", {
      email: testData.validEmail,
      password: testData.invalidPassword,
    });

    expect(response.data.errCode).toBe(4);
    expect(response.data.message).toBe("The password is not mapping!");
  });

  test("should fail to login by user without password", async () => {
    const response = await apiClient.post("/api/login", {
      email: testData.userWithoutPassword,
      password: testData.invalidPassword,
    });

    expect(response.data.errCode).toBe(3);
    expect(response.data.message).toBe("This email can't login to the system");
  });

  test("should not return sensitive information", async () => {
    const response = await apiClient.post("/api/login", {
      email: testData.validEmail,
      password: testData.validPassword,
    });

    expect(response.status).toBe(200);
    expect(response.data.errCode).toBe(0);
    expect(response.data.userInfor).not.toHaveProperty("password");
  });
});

// Kiểm thử phân quyền user (admin, doctor, patient)
// Tìm phương án, tạo - xoá user cho khi chạy test 1 - global (đảm bảo có 1 số user khi chạy test)
