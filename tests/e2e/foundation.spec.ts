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
  await expect(page.locator(".portal-mark")).toBeVisible();
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
  await expectNoAutomaticAccessibilityViolations(page);
});
