import { Page as PlaywrightPage, expect } from "@playwright/test";
import { Page } from "../basePage";

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
  greetingText = this.page.locator("p.nav-link");
  languageDropdown = this.page.locator("#languageDropdown");
  logoutButton = this.page.getByRole("link", { name: "Đăng xuất" });
}
