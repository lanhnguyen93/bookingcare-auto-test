import { test, expect } from "../../../fixtures/base-test-api";
import path from "path";
import {
  convertToBase64,
  createClinic,
  createRandomClinicInfor,
} from "../../../utils/helper";

const imagePath = path.resolve(__dirname, "../testData/image-test-2.png");
let clinicId: string;
let token: string;
let clinic: any;
let clinicInfor: any;

test.describe("Create clinic API", () => {
  test.beforeAll(async ({ authToken }) => {
    //get token, create clinic infor
    token = process.env.ACCESS_TOKEN ? process.env.ACCESS_TOKEN : "";
    clinicInfor = await createRandomClinicInfor();
    console.log("check clinic Infor: ", clinicInfor.name);
  });

  test("should fail to create without clinic name ", async ({ request }) => {
    const response = await request.post(
      `${process.env.SERVER_URL}/api/create-clinic`,
      {
        data: {
          // name: clinicInfor.name,
          address: clinicInfor.address,
          descriptionMarkdown: clinicInfor.descriptionMarkdown,
          descriptionHTML: clinicInfor.descriptionHTML,
          provinceId: clinicInfor.provinceId,
          image: clinicInfor.image,
        },
        headers: { Authorization: token },
      }
    );
    let data = await response.json();
    expect(response.status()).toEqual(200);
    expect(data.errCode).toEqual(1);
    expect(data.message).toEqual("Missing required paramters: name or address");
  });

  test("should fail to create without clinic address ", async ({ request }) => {
    const response = await request.post(
      `${process.env.SERVER_URL}/api/create-clinic`,
      {
        data: {
          name: clinicInfor.name,
          // address: clinicInfor.address,
          descriptionMarkdown: clinicInfor.descriptionMarkdown,
          descriptionHTML: clinicInfor.descriptionHTML,
          provinceId: clinicInfor.provinceId,
          image: clinicInfor.image,
        },
        headers: { Authorization: token },
      }
    );
    let data = await response.json();
    expect(response.status()).toEqual(200);
    expect(data.errCode).toEqual(1);
    expect(data.message).toEqual("Missing required paramters: name or address");
  });

  test("should fail to create without authorization", async ({ request }) => {
    const response = await request.post(
      `${process.env.SERVER_URL}/api/create-clinic`,
      {
        data: clinicInfor,
        // headers: { Authorization: token },
      }
    );

    let data = await response.json();

    expect(response.status()).toEqual(401);
    expect(data.errCode).toEqual(-2);
    expect(data.message).toEqual("Authorization token is required.");
  });

  test("should fail to create a user with invalid authorization", async ({
    request,
  }) => {
    const response = await request.post(
      `${process.env.SERVER_URL}/api/create-clinic`,
      {
        data: clinicInfor,
        headers: { Authorization: `Token ${token}` },
      }
    );

    let data = await response.json();

    expect(response.status()).toEqual(500);
    expect(data.errCode).toEqual(-3);
    expect(data.message).toEqual("Failed to authenticate token.");
  });

  test("should create clinic successfully", async ({ request }) => {
    //Create clinic successfully
    const response_1 = await request.post(
      `${process.env.SERVER_URL}/api/create-clinic`,
      {
        data: clinicInfor,
        headers: { Authorization: token },
      }
    );
    let data_1 = await response_1.json();
    expect(response_1.status()).toEqual(200);
    expect(data_1.errCode).toEqual(0);
    expect(data_1).toHaveProperty("clinic");
    clinicId = data_1.clinic.id;
    console.log("check clinicID: ", clinicId);

    //Create clinic with existed name
    const response_2 = await request.post(
      `${process.env.SERVER_URL}/api/create-clinic`,
      {
        data: { name: clinicInfor.name, address: clinicInfor.address },
        headers: { Authorization: token },
      }
    );
    let data_2 = await response_2.json();
    expect(response_2.status()).toEqual(200);
    expect(data_2.errCode).toEqual(2);
    expect(data_2.message).toEqual("The clinic already exists!");

    //teardown - delete clinic
    const deleteResponse = await request.delete(
      `${process.env.SERVER_URL}/api/delete-clinic`,
      { params: { id: clinicId }, headers: { Authorization: token } }
    );
    let data = await deleteResponse.json();
    if (deleteResponse.status() !== 200 || data.errCode !== 0) {
      throw new Error("Fail to delete clinic");
    }
  });
});

test.describe("Get clinics API", () => {
  test("should get all clinics successfully", async ({ request }) => {
    const response = await request.get(
      `${process.env.SERVER_URL}/api/get-all-clinics`,
      { params: { id: "ALL" } }
    );
    let data = await response.json();
    expect(response.status()).toEqual(200);
    expect(data.clinics.length).toBeGreaterThanOrEqual(1);
    expect(data.clinics[0]).toHaveProperty("name");
    expect(data.clinics[0]).toHaveProperty("address");
    expect(data.clinics[0]).toHaveProperty("descriptionMarkdown");
    expect(data.clinics[0]).toHaveProperty("descriptionHTML");
    expect(data.clinics[0]).toHaveProperty("provinceId");
    expect(data.clinics[0]).toHaveProperty("image");
  });

  test("should get clinic by id successfully", async ({ request }) => {
    token = process.env.ACCESS_TOKEN ? process.env.ACCESS_TOKEN : "";
    clinic = await createClinic(token); //Create a new clinic
    console.log("check clinicId: ", clinic.id!);
    const response = await request.get(
      `${process.env.SERVER_URL}/api/get-all-clinics`,
      { params: { id: clinic.id! } }
    );
    let data = await response.json();
    expect(response.status()).toEqual(200);
    expect(data.errCode).toEqual(0);
    expect(data.clinics.name).toBe(clinic.name);

    //teardown - delete clinic
    const deleteResponse = await request.delete(
      `${process.env.SERVER_URL}/api/delete-clinic`,
      { params: { id: clinic.id! }, headers: { Authorization: token } }
    );
    let deleteData = await deleteResponse.json();
    if (deleteResponse.status() !== 200 || deleteData.errCode !== 0) {
      throw new Error("Fail to delete clinic");
    }
  });

  test("should fail to get clinic without id", async ({ request }) => {
    const response = await request.get(
      `${process.env.SERVER_URL}/api/get-all-clinics`
    );
    let data = await response.json();
    expect(response.status()).toEqual(200);
    expect(data.errCode).toEqual(1);
    expect(data.message).toBe("Missing required paramter");
  });
});

test.describe("Delete clinic API", () => {
  test.beforeAll(async ({ authToken }) => {
    //get token, create a clinic
    token = process.env.ACCESS_TOKEN ? process.env.ACCESS_TOKEN : "";
    clinic = await createClinic(token); //Create a new clinic
    clinicId = clinic.id!;
    console.log("check clinic id: ", clinicId);
  });

  test("should fail to delete without id", async ({ request }) => {
    const response = await request.delete(
      `${process.env.SERVER_URL}/api/delete-clinic`,
      { headers: { Authorization: token } }
    );
    let data = await response.json();
    expect(response.status()).toEqual(200);
    expect(data.errCode).toEqual(2);
    expect(data.message).toEqual("Missing required parameter");
  });

  test("should fail to delete with invalid id", async ({ request }) => {
    const response = await request.delete(
      `${process.env.SERVER_URL}/api/delete-clinic`,
      {
        headers: { Authorization: token },
        params: { id: `invalid_id${clinicId}` },
      }
    );
    let data = await response.json();
    expect(response.status()).toEqual(200);
    expect(data.errCode).toEqual(1);
    expect(data.message).toEqual("The clinic is not exist!");
  });

  test("should fail to delete without authorization", async ({ request }) => {
    const response = await request.delete(
      `${process.env.SERVER_URL}/api/delete-clinic`,
      { params: { id: clinicId } }
    );
    let data = await response.json();
    expect(response.status()).toEqual(401);
    expect(data.errCode).toEqual(-2);
    expect(data.message).toEqual("Authorization token is required.");
  });

  test("should fail to delete with invalid authorization", async ({
    request,
  }) => {
    const response = await request.delete(
      `${process.env.SERVER_URL}/api/delete-clinic`,
      {
        headers: { Authorization: `Token ${token}` },
        params: { id: clinicId },
      }
    );
    let data = await response.json();

    expect(response.status()).toEqual(500);
    expect(data.errCode).toEqual(-3);
    expect(data.message).toEqual("Failed to authenticate token.");
  });

  test("should delete clinic successfully", async ({ request }) => {
    const response = await request.delete(
      `${process.env.SERVER_URL}/api/delete-clinic`,
      {
        headers: { Authorization: token },
        params: { id: clinicId },
      }
    );
    let data = await response.json();
    expect(response.status()).toEqual(200);
    expect(data.errCode).toEqual(0);
    expect(data).toHaveProperty("clinic");
  });
});

test.describe("Update clinic API", () => {
  test.beforeAll(async ({ authToken }) => {
    //get token, create a new clinic, create clinicInfor to update
    token = process.env.ACCESS_TOKEN ? process.env.ACCESS_TOKEN : "";
    clinic = await createClinic(token);
    clinicId = clinic.id;
    console.log("check clinic id: ", clinic.id);
    clinicInfor = await createRandomClinicInfor(imagePath);
  });

  test.afterAll(async ({ request }) => {
    //teardown - delete the clinic
    const response = await request.delete(
      `${process.env.SERVER_URL}/api/delete-clinic`,
      {
        headers: { Authorization: token },
        params: { id: clinicId },
      }
    );
    let data = await response.json();
    if (response.status() !== 200 || data.errCode !== 0) {
      throw new Error("Fail to delete clinic");
    }
  });

  test("should fail to edit without id", async ({ request }) => {
    const response = await request.put(
      `${process.env.SERVER_URL}/api/edit-clinic`,
      {
        headers: { Authorization: token },
        data: {
          name: clinicInfor.name,
          address: clinicInfor.address,
          descriptionMarkdown: clinicInfor.descriptionMarkdown,
          descriptionHTML: clinicInfor.descriptionHTML,
          provinceId: clinicInfor.provinceId,
          image: clinicInfor.image,
        },
      }
    );
    let data = await response.json();
    expect(response.status()).toEqual(200);
    expect(data.errCode).toEqual(1);
    expect(data.message).toEqual(
      "Missing require parameter: name, address, id"
    );
  });

  test("should fail to edit without name", async ({ request }) => {
    const response = await request.put(
      `${process.env.SERVER_URL}/api/edit-clinic`,
      {
        headers: { Authorization: token },
        data: {
          id: clinicId,
          // name: clinicInfor.name,
          address: clinicInfor.address,
          descriptionMarkdown: clinicInfor.descriptionMarkdown,
          descriptionHTML: clinicInfor.descriptionHTML,
          provinceId: clinicInfor.provinceId,
          image: clinicInfor.image,
        },
      }
    );
    let data = await response.json();
    expect(response.status()).toEqual(200);
    expect(data.errCode).toEqual(1);
    expect(data.message).toEqual(
      "Missing require parameter: name, address, id"
    );
  });

  test("should fail to edit without address", async ({ request }) => {
    const response = await request.put(
      `${process.env.SERVER_URL}/api/edit-clinic`,
      {
        headers: { Authorization: token },
        data: {
          id: clinicId,
          name: clinicInfor.name,
          // address: clinicInfor.address,
          descriptionMarkdown: clinicInfor.descriptionMarkdown,
          descriptionHTML: clinicInfor.descriptionHTML,
          provinceId: clinicInfor.provinceId,
          image: clinicInfor.image,
        },
      }
    );
    let data = await response.json();
    expect(response.status()).toEqual(200);
    expect(data.errCode).toEqual(1);
    expect(data.message).toEqual(
      "Missing require parameter: name, address, id"
    );
  });

  test("should fail to edit with invalid id", async ({ request }) => {
    const response = await request.put(
      `${process.env.SERVER_URL}/api/edit-clinic`,
      {
        headers: { Authorization: token },
        data: {
          id: `invalid_id${clinicId}`,
          name: clinicInfor.name,
          address: clinicInfor.address,
          descriptionMarkdown: clinicInfor.descriptionMarkdown,
          descriptionHTML: clinicInfor.descriptionHTML,
          provinceId: clinicInfor.provinceId,
          image: clinicInfor.image,
        },
      }
    );
    let data = await response.json();
    expect(response.status()).toEqual(200);
    expect(data.errCode).toEqual(2);
    expect(data.message).toEqual("The clinic is not exist!");
  });

  test("should fail to edit without authorization", async ({ request }) => {
    const response = await request.put(
      `${process.env.SERVER_URL}/api/edit-clinic`,
      {
        data: {
          id: clinicId,
          name: clinicInfor.name,
          address: clinicInfor.address,
          descriptionMarkdown: clinicInfor.descriptionMarkdown,
          descriptionHTML: clinicInfor.descriptionHTML,
          provinceId: clinicInfor.provinceId,
          image: clinicInfor.image,
        },
      }
    );
    let data = await response.json();
    expect(response.status()).toEqual(401);
    expect(data.errCode).toEqual(-2);
    expect(data.message).toEqual("Authorization token is required.");
  });

  test("should fail to delete with invalid authorization", async ({
    request,
  }) => {
    const response = await request.put(
      `${process.env.SERVER_URL}/api/edit-clinic`,
      {
        headers: { Authorization: `Token ${token}` },
        data: {
          id: clinicId,
          name: clinicInfor.name,
          address: clinicInfor.address,
          descriptionMarkdown: clinicInfor.descriptionMarkdown,
          descriptionHTML: clinicInfor.descriptionHTML,
          provinceId: clinicInfor.provinceId,
          image: clinicInfor.image,
        },
      }
    );
    let data = await response.json();

    expect(response.status()).toEqual(500);
    expect(data.errCode).toEqual(-3);
    expect(data.message).toEqual("Failed to authenticate token.");
  });

  test("should edit clinic successfully", async ({ request }) => {
    const response = await request.put(
      `${process.env.SERVER_URL}/api/edit-clinic`,
      {
        headers: { Authorization: token },
        data: {
          id: clinicId,
          name: clinicInfor.name,
          address: clinicInfor.address,
          descriptionMarkdown: clinicInfor.descriptionMarkdown,
          descriptionHTML: clinicInfor.descriptionHTML,
          provinceId: clinicInfor.provinceId,
          image: clinicInfor.image,
        },
      }
    );
    let data = await response.json();
    expect(response.status()).toEqual(200);
    expect(data.errCode).toEqual(0);
    expect(data).toHaveProperty("updatedClinic");
    expect(data.updatedClinic.name).toBe(clinicInfor.name);
    expect(convertToBase64(data.updatedClinic.image)).toBe(clinicInfor.image);
    expect(data.updatedClinic.descriptionMarkdown).toBe(
      clinicInfor.descriptionMarkdown
    );
    expect(data.updatedClinic.descriptionHTML).toBe(
      clinicInfor.descriptionHTML
    );
  });
});
