import { Locator, Page as PlaywrightPage, expect } from "@playwright/test";

export abstract class Page {
  readonly page: PlaywrightPage;

  constructor(page: PlaywrightPage) {
    this.page = page;
  }
}
