import { Page as PlaywrightPage, expect } from "@playwright/test";
import { Page } from "../basePage";

export class NavigationBar extends Page {
  readonly pageUrl: string;

  constructor(page: PlaywrightPage) {
    super(page);
    this.pageUrl = process.env.USERVUEX_URL || "/";
  }

  //Locators
  headerFrame = this.page.locator("header");
  userMenu = this.page.locator("#userDropdown");
  languageMenu = this.page.locator("#languageDropdown");
  userDropdown = this.page
    .locator(".dropdown", { hasText: "Người dùng" })
    .locator(".dropdown-menu");
  languageDropdown = this.page
    .locator(".dropdown", { hasText: "Ngôn ngữ" })
    .locator(".dropdown-menu");
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
  logoutButton = this.page.getByRole("link", { name: "Đăng xuất" });

  async goto() {
    const response = await this.page.goto(this.pageUrl);
    expect(response?.status()).toBeLessThan(400);
  }

  async waitForLoad() {
    await this.page.waitForURL(this.pageUrl, { timeout: 30000 });
    await expect(this.logoutButton).toBeVisible({ timeout: 30000 });
  }

  async verifyUserDropdown() {
    await this.userMenu.click();
    await this.crudUserButton.click();
    await expect(this.page).toHaveTitle("Manage User");

    await this.userMenu.click();
    await this.crudVuexButton.click();
    await expect(this.page).toHaveTitle("User Vuex");

    await this.userMenu.click();
    await this.manageDoctorButton.click();
    await expect(this.page).toHaveTitle("Manage Doctor");

    await this.userMenu.click();
    await this.manageScheduleButton.click();
    await expect(this.page).toHaveTitle("Manage Schedule");

    await this.userMenu.click();
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

  async verifyLanguageButton() {
    this.languageMenu.click();
    expect(this.page.getByRole("link", { name: "English" })).toBeVisible;
    expect(this.page.getByRole("link", { name: "Tiếng Việt" })).toBeVisible;
  }

  async verifyLogoutButton() {
    await this.logoutButton.click();
    await expect(this.page).toHaveTitle("Login");
  }
}
