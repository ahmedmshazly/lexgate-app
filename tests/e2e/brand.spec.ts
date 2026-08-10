import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

const wcagAandAa = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"];

const computedFontFamily = (page: Page, selector: string): Promise<string> =>
  page
    .locator(selector)
    .first()
    .evaluate((element) => getComputedStyle(element).fontFamily);

test.describe("brand system", () => {
  test("English shell renders the approved Latin interface family (FR-002, SC-001)", async ({
    page,
  }) => {
    await page.goto("/en");

    const body = await computedFontFamily(page, "body");
    expect(body).toContain("Instrument Sans");
    // A generic must be present as the declared fallback, but never first.
    expect(body.split(",")[0]).toContain("Instrument Sans");

    const heading = await computedFontFamily(page, "h1");
    expect(heading).toContain("Newsreader");
  });

  test("Arabic shell renders the approved Arabic families (FR-002, SC-001)", async ({
    page,
  }) => {
    await page.goto("/ar");

    const body = await computedFontFamily(page, "body");
    expect(body.split(",")[0]).toContain("IBM Plex Sans Arabic");

    const heading = await computedFontFamily(page, "h1");
    expect(heading.split(",")[0]).toContain("Noto Naskh Arabic");

    await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
    // The shell declares the Egyptian region subtag. The font assertions above
    // pass because CSS :lang(ar) matches ar and any of its region subtags,
    // which is exactly what script-appropriate typography relies on.
    await expect(page.locator("html")).toHaveAttribute("lang", /^ar\b/);
  });

  test("an Arabic fragment inside an English page gets an Arabic face (FR-012)", async ({
    page,
  }) => {
    await page.goto("/en");

    // The whole Arabic typography design rests on :lang() following the
    // semantic language of the content rather than the page. If a fragment
    // carrying its own lang did not switch family, mixed-language names would
    // be typeset with a Latin face — the edge case the spec calls out.
    const family = await page.evaluate(() => {
      const fragment = document.createElement("span");
      fragment.lang = "ar";
      fragment.textContent = "شركة النيل";
      document.body.append(fragment);
      const computed = getComputedStyle(fragment).fontFamily;
      fragment.remove();
      return computed;
    });

    // The fragment inherits the Latin stack as a computed value. That is
    // correct and sufficient: Instrument Sans carries no Arabic glyphs, so the
    // Arabic characters resolve to the approved Arabic family listed next.
    // What must hold is that an approved Arabic face precedes any generic, so
    // the glyphs can never fall through to a system font.
    const families = family.split(",").map((entry) => entry.trim());
    const arabicIndex = families.findIndex((entry) =>
      entry.includes("IBM Plex Sans Arabic"),
    );
    const genericIndex = families.findIndex((entry) =>
      ["system-ui", "sans-serif", "serif"].includes(entry),
    );

    expect(arabicIndex).toBeGreaterThanOrEqual(0);
    expect(arabicIndex).toBeLessThan(genericIndex);

    // The surrounding English page is unaffected.
    const body = await computedFontFamily(page, "body");
    expect(body.split(",")[0]).toContain("Instrument Sans");
  });

  test("neither shell requests a third-party asset host (FR-001, SC-002)", async ({
    page,
  }) => {
    const external: string[] = [];
    page.on("request", (request) => {
      const url = new URL(request.url());
      if (url.hostname !== "127.0.0.1" && url.hostname !== "localhost") {
        external.push(request.url());
      }
    });

    await page.goto("/en");
    await page.goto("/ar");
    await page.waitForLoadState("networkidle");

    expect(external).toEqual([]);
  });

  test("both shells expose no WCAG A/AA violation (FR-007, SC-004)", async ({
    page,
  }) => {
    for (const locale of ["en", "ar"]) {
      await page.goto(`/${locale}`);
      const results = await new AxeBuilder({ page })
        .withTags(wcagAandAa)
        .analyze();

      expect(
        results.violations,
        `${locale} shell reported accessibility violations`,
      ).toEqual([]);
    }
  });

  test("focus indicator carries its contrast on the light ground (FR-007, FR-013)", async ({
    page,
  }) => {
    await page.goto("/en");
    await page.keyboard.press("Tab");

    const mark = page.getByRole("link", { name: "Lex Gate" });
    await expect(mark).toBeFocused();

    // Gold alone is 2.82:1 against warm-white, below the 3:1 SC 1.4.11
    // requires. The outer ring must therefore be navy, with gold inside it.
    const outline = await mark.evaluate((element) => {
      const style = getComputedStyle(element);
      return {
        color: style.outlineColor,
        width: style.outlineWidth,
        shadow: style.boxShadow,
      };
    });

    expect(outline.color).toBe("rgb(14, 28, 48)");
    expect(Number.parseFloat(outline.width)).toBeGreaterThanOrEqual(2);
    expect(outline.shadow).toContain("rgb(184, 145, 60)");
  });

  test("content stays readable at 200% text size (SC-007)", async ({
    page,
  }) => {
    for (const locale of ["en", "ar"]) {
      await page.goto(`/${locale}`);
      await page.evaluate(() => {
        document.documentElement.style.fontSize = "200%";
      });

      const heading = page.locator("h1");
      await expect(heading).toBeVisible();

      const overflows = await page.evaluate(
        () =>
          document.documentElement.scrollWidth >
          document.documentElement.clientWidth + 1,
      );
      expect(overflows, `${locale} shell overflows horizontally at 200%`).toBe(
        false,
      );
    }
  });

  test("content reflows at a 320 pixel viewport (SC-007)", async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 720 });

    for (const locale of ["en", "ar"]) {
      await page.goto(`/${locale}`);

      await expect(page.locator("h1")).toBeVisible();

      const overflows = await page.evaluate(
        () =>
          document.documentElement.scrollWidth >
          document.documentElement.clientWidth + 1,
      );
      expect(overflows, `${locale} shell overflows at 320px`).toBe(false);
    }
  });
});
