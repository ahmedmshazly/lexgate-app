import { expect, test, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const wcagAandAa = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"];

const expectNoAutomaticAccessibilityViolations = async (
  page: Page,
): Promise<void> => {
  const results = await new AxeBuilder({ page }).withTags(wcagAandAa).analyze();
  expect(results.violations).toEqual([]);
};

test("English foundation shell is branded and explicitly internal", async ({
  page,
}) => {
  await page.goto("/en");
  await expect(page.locator("main")).toContainText("Milestone M0");
  // The mark is supplied by @lexgate/brand and emitted by the bundler, so its
  // path is fingerprinted rather than a hand-written public path. Asserting
  // the literal public path would re-admit the duplicate supply point.
  await expect(page.locator("img.portal-mark")).toHaveAttribute(
    "src",
    /portal-gold\.[^/]*svg/,
  );
  await expect(page.locator("[data-classification=internal]")).toContainText(
    "Internal",
  );
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page.locator("html")).toHaveAttribute("dir", "ltr");
  await expectNoAutomaticAccessibilityViolations(page);
});

test("Arabic foundation shell declares RTL direction", async ({ page }) => {
  await page.goto("/ar");
  await expect(page.locator("html")).toHaveAttribute("lang", "ar-EG");
  await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
  await expect(page.locator("h1")).toContainText("أساس منضبط");
  await expect(page.locator("main")).toContainText("M0");
  await expectNoAutomaticAccessibilityViolations(page);
});

test("the foundation mark receives a visible keyboard focus treatment", async ({
  page,
}) => {
  await page.goto("/en");

  await page.keyboard.press("Tab");

  const brandLink = page.getByRole("link", { name: "Lex Gate" });
  await expect(brandLink).toBeFocused();
  await expect(brandLink).toHaveCSS("outline-style", "solid");
});

test("unsupported locales are safely rejected", async ({ page }) => {
  const response = await page.goto("/fr");

  expect(response?.status()).toBe(404);
});
