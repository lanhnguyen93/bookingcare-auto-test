import { Page as PlaywrightPage, expect } from "@playwright/test";
import { Page } from "../basePage";
import user from "../../../.auth/user.json";

export class NavigationBar extends Page {
  constructor(page: PlaywrightPage) {
    super(page);
  }

  //Locators
  userDropdown = this.page.locator("#userDropdown");
  crudUserButton = this.page.getByRole("link", { name: "CRUD User" });
  crudVuexButton = this.page.getByRole("link", { name: "CRUD Vuex" });
  manageDoctorButton = this.page.getByRole("link", { name: "Quản lý bác sĩ" });
  manageAdminButton = this.page.getByRole("link", { name: "Quản lý Admin" });
  manageScheduleButton = this.page.getByRole("link", {
    name: "Quản lý lịch khám bệnh",
  });
  managePatientButton = this.page.getByRole("link", {
    name: "Quản lý lịch hẹn khám bệnh",
  });
  clinicButton = this.page.getByRole("link", { name: "Phòng khám" });
  specialtyButton = this.page.getByRole("link", { name: "Chuyên khoa" });
  handbookButton = this.page.getByRole("link", { name: "Cẩm nang" });
  greetingText = this.page.locator(".greeting-text");
  languageDropdown = this.page.locator("#languageDropdown");
  logoutButton = this.page.getByRole("link", { name: "Đăng xuất" });

  async verifyUserDropdown() {
    await this.userDropdown.click();
    await this.crudUserButton.click();
    await expect(this.page).toHaveTitle("Manage User");

    await this.userDropdown.click();
    await this.crudVuexButton.click();
    await expect(this.page).toHaveTitle("User Vuex");

    await this.userDropdown.click();
    await this.manageDoctorButton.click();
    await expect(this.page).toHaveTitle("Manage Doctor");

    await this.userDropdown.click();
    await this.manageScheduleButton.click();
    await expect(this.page).toHaveTitle("Manage Schedule");

    await this.userDropdown.click();
    await this.managePatientButton.click();
    await expect(this.page).toHaveTitle("Manage Patient");
  }

  async verifyClinicButton() {
    await this.clinicButton.click();
    await expect(this.page).toHaveTitle("Manage Clinic");
  }

  async verifySpecialtyButton() {
    await this.specialtyButton.click();
    await expect(this.page).toHaveTitle("Manage Specialty");
  }

  async verifyGreetingText() {
    let userData = user.userInfor;
    expect(await this.greetingText.textContent()).toBe(
      `Xin chào,  ${userData.firstName} ${userData.lastName}`
    );
  }

  async verifyLanguageButton() {
    this.languageDropdown.click();
    expect(this.page.getByRole("link", { name: "English" })).toBeVisible;
    expect(this.page.getByRole("link", { name: "Tiếng Việt" })).toBeVisible;
  }

  async verifyLogoutButton() {
    await this.logoutButton.click();
    await expect(this.page).toHaveTitle("Login");
  }
}
