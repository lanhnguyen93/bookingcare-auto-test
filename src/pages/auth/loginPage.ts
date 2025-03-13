import { Page as PlaywrightPage, expect } from "@playwright/test";
import { Page } from "../basePage";

export class LoginPage extends Page {
  readonly pageUrl: string;

  constructor(page: PlaywrightPage) {
    super(page);
    this.pageUrl = process.env.LOGIN_URL || "/";
  }

  //Locators
  email = this.page.getByPlaceholder("Enter your email");
  password = this.page.getByPlaceholder("Enter your password");
  loginButton = this.page.getByRole("button", { name: "Login" });
  errorMessage = this.page.locator(".err-msg");

  async goto() {
    const response = await this.page.goto(this.pageUrl);
    expect(response?.status()).toBeLessThan(400);
    await this.page.waitForLoadState();
  }

  async enterCredential(email: string, password: string) {
    await this.email.fill(email);
    await this.password.fill(password);
    await this.loginButton.click();
  }
}
