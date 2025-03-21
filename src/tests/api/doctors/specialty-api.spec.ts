import { test, expect } from "../../../fixtures/base-test-api";
import path from "path";
import {
  convertToBase64,
  createRandomSpecialtyInfor,
  createSpecialty,
} from "../../../utils/helper";

const imagePath = path.resolve(__dirname, "../testData/image-test-2.png");
let specialtyId: string;
let token: string;
let specialty: any;
let specialtyInfor: any;

test.describe("Create specialty API", () => {
  test.beforeAll(async ({ authToken }) => {
    token = process.env.ACCESS_TOKEN ? process.env.ACCESS_TOKEN : "";
    specialtyInfor = createRandomSpecialtyInfor();
    console.log("check specialtyInfor: ", specialtyInfor.name);
  });

  test("should fail to create without specialty name ", async ({ request }) => {
    const response = await request.post(
      `${process.env.SERVER_URL}/api/create-specialty`,
      {
        data: {
          image: specialtyInfor.iamge,
          descriptionMarkdown: specialtyInfor.descriptionMarkdown,
          descriptionHTML: specialtyInfor.descriptionHTML,
        },
        headers: { Authorization: token },
      }
    );
    let data = await response.json();
    expect(response.status()).toEqual(200);
    expect(data.errCode).toEqual(1);
    expect(data.message).toEqual("Missing required paramters: name");
  });

  test("should fail to create without authorization", async ({ request }) => {
    const response = await request.post(
      `${process.env.SERVER_URL}/api/create-specialty`,
      { data: specialtyInfor }
    );

    let data = await response.json();

    expect(response.status()).toEqual(401);
    expect(data.errCode).toEqual(-2);
    expect(data.message).toEqual("Authorization token is required.");
  });

  test("should fail to create with invalid authorization", async ({
    request,
  }) => {
    const response = await request.post(
      `${process.env.SERVER_URL}/api/create-specialty`,
      {
        data: specialtyInfor,
        headers: { Authorization: `Token ${token}` },
      }
    );

    let data = await response.json();

    expect(response.status()).toEqual(500);
    expect(data.errCode).toEqual(-3);
    expect(data.message).toEqual("Failed to authenticate token.");
  });

  test("should create specialty successfully", async ({ request }) => {
    //Create specialty successfully
    const response_1 = await request.post(
      `${process.env.SERVER_URL}/api/create-specialty`,
      {
        data: specialtyInfor,
        headers: { Authorization: token },
      }
    );
    let data_1 = await response_1.json();
    expect(response_1.status()).toEqual(200);
    expect(data_1.errCode).toEqual(0);
    expect(data_1).toHaveProperty("specialty");
    specialtyId = data_1.specialty.id;
    console.log("check specitaltyId: ", specialtyId);

    //Create specialty with existed name
    const response_2 = await request.post(
      `${process.env.SERVER_URL}/api/create-specialty`,
      { data: { name: specialtyInfor.name }, headers: { Authorization: token } }
    );
    let data_2 = await response_2.json();
    expect(response_2.status()).toEqual(200);
    expect(data_2.errCode).toEqual(2);
    expect(data_2.message).toEqual("The specialty already exists!");

    //teardown - delete specialty
    const deleteResponse = await request.delete(
      `${process.env.SERVER_URL}/api/delete-specialty`,
      { params: { id: specialtyId }, headers: { Authorization: token } }
    );
    let data = await deleteResponse.json();
    if (deleteResponse.status() !== 200 || data.errCode !== 0) {
      throw new Error("Fail to delete specialty");
    }
  });
});

test.describe("Get specialties API", () => {
  test("should get all specialties successfully", async ({ request }) => {
    const response = await request.get(
      `${process.env.SERVER_URL}/api/get-all-specialty`,
      { params: { id: "ALL" } }
    );
    let data = await response.json();
    expect(response.status()).toEqual(200);
    expect(data.specialties.length).toBeGreaterThanOrEqual(1);
    expect(data.specialties[0]).toHaveProperty("name");
    expect(data.specialties[0]).toHaveProperty("image");
    expect(data.specialties[0]).toHaveProperty("descriptionMarkdown");
    expect(data.specialties[0]).toHaveProperty("descriptionHTML");
  });

  test("should get specialty by id successfully", async ({ request }) => {
    token = process.env.ACCESS_TOKEN ? process.env.ACCESS_TOKEN : "";
    const specialty = await createSpecialty(token); //Create a new specialty
    const response = await request.get(
      `${process.env.SERVER_URL}/api/get-all-specialty`,
      { params: { id: specialty.id! } }
    );
    let data = await response.json();
    expect(response.status()).toEqual(200);
    expect(data.errCode).toEqual(0);
    expect(data.specialties.name).toBe(specialty.name);

    //teardown - delete specialty
    const deleteResponse = await request.delete(
      `${process.env.SERVER_URL}/api/delete-specialty`,
      { params: { id: specialty.id! }, headers: { Authorization: token } }
    );
    let deleteData = await deleteResponse.json();
    if (deleteResponse.status() !== 200 || deleteData.errCode !== 0) {
      throw new Error("Fail to delete specialty");
    }
  });

  test("should fail to get specialty without id", async ({ request }) => {
    const response = await request.get(
      `${process.env.SERVER_URL}/api/get-all-specialty`
    );
    let data = await response.json();
    expect(response.status()).toEqual(200);
    expect(data.errCode).toEqual(1);
    expect(data.message).toBe("Missing required paramter");
  });
});

test.describe("Delete specialty API", () => {
  test.beforeAll(async ({ authToken }) => {
    token = process.env.ACCESS_TOKEN ? process.env.ACCESS_TOKEN : "";
    let specialty = await createSpecialty(token);
    specialtyId = specialty.id!;
    console.log("check specialty id: ", specialtyId);
  });

  test("should fail to delete without id", async ({ request }) => {
    const response = await request.delete(
      `${process.env.SERVER_URL}/api/delete-specialty`,
      { headers: { Authorization: token } }
    );
    let data = await response.json();
    expect(response.status()).toEqual(200);
    expect(data.errCode).toEqual(2);
    expect(data.message).toEqual("Missing required parameter");
  });

  test("should fail to delete with invalid id", async ({ request }) => {
    const response = await request.delete(
      `${process.env.SERVER_URL}/api/delete-specialty`,
      {
        headers: { Authorization: token },
        params: { id: `invalid_id${specialtyId}` },
      }
    );
    let data = await response.json();
    expect(response.status()).toEqual(200);
    expect(data.errCode).toEqual(1);
    expect(data.message).toEqual("The specialty is not exist!");
  });

  test("should fail to delete without authorization", async ({ request }) => {
    const response = await request.delete(
      `${process.env.SERVER_URL}/api/delete-specialty`,
      { params: { id: specialtyId } }
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
      `${process.env.SERVER_URL}/api/delete-specialty`,
      {
        headers: { Authorization: `Token ${token}` },
        params: { id: specialtyId },
      }
    );
    let data = await response.json();

    expect(response.status()).toEqual(500);
    expect(data.errCode).toEqual(-3);
    expect(data.message).toEqual("Failed to authenticate token.");
  });

  test("should delete specialty successfully", async ({ request }) => {
    const response = await request.delete(
      `${process.env.SERVER_URL}/api/delete-specialty`,
      {
        headers: { Authorization: token },
        params: { id: specialtyId },
      }
    );
    let data = await response.json();
    expect(response.status()).toEqual(200);
    expect(data.errCode).toEqual(0);
    expect(data).toHaveProperty("specialty");
  });
});

test.describe("Update specialty API", () => {
  test.beforeAll(async ({ authToken }) => {
    //get token, create a new specialty, create specialtyInfor to update
    token = process.env.ACCESS_TOKEN ? process.env.ACCESS_TOKEN : "";
    specialty = await createSpecialty(token);
    specialtyId = specialty.id;
    console.log("check specialty id: ", specialty.id);
    specialtyInfor = createRandomSpecialtyInfor(imagePath);
  });

  test.afterAll(async ({ request }) => {
    //teardown - delete the specialty
    const response = await request.delete(
      `${process.env.SERVER_URL}/api/delete-specialty`,
      {
        headers: { Authorization: token },
        params: { id: specialtyId },
      }
    );
    let data = await response.json();
    if (response.status() !== 200 || data.errCode !== 0) {
      throw new Error("Fail to delete user");
    }
  });

  test("should fail to edit without id", async ({ request }) => {
    const response = await request.put(
      `${process.env.SERVER_URL}/api/edit-specialty`,
      {
        headers: { Authorization: token },
        data: {
          name: specialtyInfor.name,
          image: specialtyInfor.image,
          descriptionMarkdown: specialtyInfor.descriptionMarkdown,
          descriptionHTML: specialtyInfor.descriptionHTML,
        },
      }
    );
    let data = await response.json();
    expect(response.status()).toEqual(200);
    expect(data.errCode).toEqual(1);
    expect(data.message).toEqual("Missing require parameter: name, id");
  });

  test("should fail to edit without name", async ({ request }) => {
    const response = await request.put(
      `${process.env.SERVER_URL}/api/edit-specialty`,
      {
        headers: { Authorization: token },
        data: {
          id: specialtyId,
          image: specialtyInfor.image,
          descriptionMarkdown: specialtyInfor.descriptionMarkdown,
          descriptionHTML: specialtyInfor.descriptionHTML,
        },
      }
    );
    let data = await response.json();
    expect(response.status()).toEqual(200);
    expect(data.errCode).toEqual(1);
    expect(data.message).toEqual("Missing require parameter: name, id");
  });

  test("should fail to edit with invalid id", async ({ request }) => {
    const response = await request.put(
      `${process.env.SERVER_URL}/api/edit-specialty`,
      {
        headers: { Authorization: token },
        data: {
          id: `invalid_id${specialty.id}`,
          name: specialtyInfor.name,
          image: specialtyInfor.image,
          descriptionMarkdown: specialtyInfor.descriptionMarkdown,
          descriptionHTML: specialtyInfor.descriptionHTML,
        },
      }
    );
    let data = await response.json();
    expect(response.status()).toEqual(200);
    expect(data.errCode).toEqual(2);
    expect(data.message).toEqual("The specialty is not exist!");
  });

  test("should fail to edit without authorization", async ({ request }) => {
    const response = await request.put(
      `${process.env.SERVER_URL}/api/edit-specialty`,
      {
        data: {
          id: specialtyId,
          name: specialtyInfor.name,
          image: specialtyInfor.image,
          descriptionMarkdown: specialtyInfor.descriptionMarkdown,
          descriptionHTML: specialtyInfor.descriptionHTML,
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
      `${process.env.SERVER_URL}/api/edit-specialty`,
      {
        headers: { Authorization: `Token ${token}` },
        data: {
          id: specialtyId,
          name: specialtyInfor.name,
          image: specialtyInfor.image,
          descriptionMarkdown: specialtyInfor.descriptionMarkdown,
          descriptionHTML: specialtyInfor.descriptionHTML,
        },
      }
    );
    let data = await response.json();

    expect(response.status()).toEqual(500);
    expect(data.errCode).toEqual(-3);
    expect(data.message).toEqual("Failed to authenticate token.");
  });

  test("should edit specialty successfully", async ({ request }) => {
    const response = await request.put(
      `${process.env.SERVER_URL}/api/edit-specialty`,
      {
        headers: { Authorization: token },
        data: {
          id: specialtyId,
          name: specialtyInfor.name,
          image: specialtyInfor.image,
          descriptionMarkdown: specialtyInfor.descriptionMarkdown,
          descriptionHTML: specialtyInfor.descriptionHTML,
        },
      }
    );
    let data = await response.json();
    expect(response.status()).toEqual(200);
    expect(data.errCode).toEqual(0);
    expect(data).toHaveProperty("updatedSpecialty");
    expect(data.updatedSpecialty.name).toBe(specialtyInfor.name);
    expect(convertToBase64(data.updatedSpecialty.image)).toBe(
      specialtyInfor.image
    );
    expect(data.updatedSpecialty.descriptionMarkdown).toBe(
      specialtyInfor.descriptionMarkdown
    );
    expect(data.updatedSpecialty.descriptionHTML).toBe(
      specialtyInfor.descriptionHTML
    );
  });
});
