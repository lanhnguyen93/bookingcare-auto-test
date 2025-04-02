import { Page as PlaywrightPage, expect } from "@playwright/test";
import { Page } from "../basePage";
import { User } from "../../utils/types";
import {
  convertBufferToBase64,
  getToken,
  randomIndex,
} from "../../utils/commonUtils";
import { getAllUserByApi } from "../../utils/userHelper";
import { randomUserData, UserDataType } from "../../tests/testData/userData";
import path from "path";

export class UserVuexPage extends Page {
  readonly pageUrl: string;
  private readonly token = getToken();
  private imagePath = path.resolve(
    __dirname,
    "../../tests/testData/image-add-new.png"
  );
  private editImagePath = path.resolve(
    __dirname,
    "../../tests/testData/image-edit.png"
  );
  private users: User[];

  constructor(page: PlaywrightPage) {
    super(page);
    this.pageUrl = process.env.USERVUEX_URL || "/";
  }

  //Locators
  inputFrame = this.page.locator(".user-content");
  listFrame = this.page.locator(".user-list-content");
  titleForm = this.page.locator(".user-header");
  emailInput = this.page.getByPlaceholder("Email");
  passwordInput = this.page.getByPlaceholder("Password");
  firstNameInput = this.page.getByPlaceholder("First name");
  lastNameInput = this.page.getByPlaceholder("Last name");
  phonenumberInput = this.page.getByPlaceholder("0123456789");
  addressInput = this.page.getByPlaceholder("Ha Noi, Viet Nam");
  genderInput = this.page
    .locator(".form-group")
    .filter({ hasText: "Gender" })
    .getByRole("combobox");
  roleInput = this.page
    .locator(".form-group")
    .filter({ hasText: "Role" })
    .getByRole("combobox");
  positionInput = this.page
    .locator(".form-group")
    .filter({ hasText: "Position" })
    .getByRole("combobox");
  imageInput = this.page.locator('input[type="file"]');
  imagePreview = this.page.locator(".img-preview");

  submitButton = this.page.locator('button[type="submit"]');
  clearButton = this.page.getByRole("button", { name: "Clear form" });

  rows = this.page.locator("table tbody tr");
  emailCells = this.page.locator("table .email");
  firstNameCells = this.page.locator("table .first-name");
  lastNameCells = this.page.locator("table .last-name");
  addressCells = this.page.locator("table .address");
  editIcons = this.page.locator("table .action .edit-icon");
  deleteIcons = this.page.locator("table .action .delete-icon");

  async goto() {
    await this.initializeUsers();
    const response = await this.page.goto(this.pageUrl);
    expect(response?.status()).toBeLessThan(400);
  }

  async waitForLoad() {
    await this.page.waitForURL(this.pageUrl, { timeout: 30000 });
    await expect(this.emailCells.last()).toBeVisible({ timeout: 30000 });
  }

  async verifyInputForm(user: UserDataType, isEdit: boolean) {
    const titleForm = isEdit ? "Edit User" : "Add New User";
    const submitBtn = isEdit ? "Edit user" : "Add user";
    const imageValue = await this.imagePath.split("testData/")[1];
    await expect(await this.titleForm.textContent()).toBe(titleForm);
    await expect(await this.submitButton.textContent()).toBe(submitBtn);
    await expect(await this.clearButton.textContent()).toBe(" Clear form ");
    await expect(this.emailInput).toHaveValue(user.email);
    if (!isEdit) {
      await expect(this.passwordInput).toHaveValue(user.password);
    }
    await expect(this.firstNameInput).toHaveValue(user.firstName);
    await expect(this.lastNameInput).toHaveValue(user.lastName);
    await expect(this.phonenumberInput).toHaveValue(user.phonenumber);
    await expect(this.addressInput).toHaveValue(user.address);
    await expect(this.genderInput).toHaveValue(user.gender);
    await expect(this.roleInput).toHaveValue(user.roleId);
    if (!user.image) {
      expect(this.imagePreview).toBeHidden;
    } else if (isEdit) {
      // In the edit user case, verify by imagePreview
      const imageBase64 = convertBufferToBase64(user.image);
      await expect(await this.imagePreview.getAttribute("src")).toContain(
        imageBase64
      );
    } else {
      // In the add user case, verify by imagePath
      await expect(await this.imageInput.inputValue()).toContain(imageValue);
    }
  }

  async fillUserForm(
    userData: UserDataType,
    imagePath: string,
    isAdd?: boolean
  ) {
    if (isAdd) {
      await this.emailInput.fill(userData.email);
      await this.passwordInput.fill(userData.password);
    }
    await this.firstNameInput.fill(userData.firstName);
    await this.lastNameInput.fill(userData.lastName);
    await this.addressInput.fill(userData.address);
    await this.phonenumberInput.fill(userData.phonenumber);
    await this.genderInput.selectOption(userData.gender);
    await this.roleInput.selectOption(userData.roleId);
    await this.positionInput.selectOption(userData.positionId);
    await this.imageInput.setInputFiles(imagePath);
  }

  async inputFormAddUser(userData: UserDataType) {
    await this.fillUserForm(userData, this.imagePath, true);
  }

  async inputFormEditUser(userData: UserDataType) {
    await this.fillUserForm(userData, this.editImagePath);
  }

  async findIndexRow(email: string) {
    const count = await this.rows.count();
    for (let i = 0; i < count; i++) {
      const emailText = await this.emailCells.nth(i).textContent();
      if (emailText === email) {
        return i;
      }
    }
    return null;
  }

  async verifyRowsNumberInTable() {
    const count = await this.rows.count();
    expect(this.users.length).toBe(count);
  }

  async verifyContentInEachRow() {
    const index = randomIndex(this.users);
    expect(await this.emailCells.nth(index).textContent()).toBe(
      this.users[index].email
    );
    expect(await this.firstNameCells.nth(index).textContent()).toBe(
      this.users[index].firstName
    );
    expect(await this.lastNameCells.nth(index).textContent()).toBe(
      this.users[index].lastName
    );
    expect(await this.addressCells.nth(index).textContent()).toBe(
      this.users[index].address
    );
  }

  async verifyDataInDb(userData: UserDataType) {}

  async clickEditIcon(email: string) {
    const editIcon = this.page
      .locator("table tbody tr", { hasText: email })
      .locator(".edit-icon");
    await editIcon.click();
  }

  async clickDeleteIcon(index: number) {
    const deleteIcon = this.deleteIcons.nth(index);
    await deleteIcon.click();
  }

  async verifyEditUser() {
    let index = randomIndex(this.users);
    index = index < 15 ? this.users.length - 1 : index;
    console.log("check index: ", index);
    await this.editIcons.nth(index).click();
    const updatedUser = await randomUserData("Doctor");
    this.inputFormAddUser(updatedUser);
  }

  async verifyAlertMessage(msg: string) {
    this.page.on("dialog", (dialog) => {
      expect(dialog.message()).toEqual(msg);
      dialog.accept();
    });
  }

  private async initializeUsers() {
    this.users = await getAllUserByApi(this.token);
  }
}
