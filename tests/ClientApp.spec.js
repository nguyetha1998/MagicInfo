const { test, expect } = require('@playwright/test');

test('testTitlePage', async ({ page }) => {
    // 1. Tạo một trang mới (giống như mở một Tab)
    // const page = await context.newPage();

    // 3. Thực hiện test
    await page.goto('https://sqa1-stg.samsungcms.com');
    await expect(page).toHaveTitle(/MagicInfo Server/);
    const loginId = page.locator("#loginId");
    const loginPass = page.locator("#loginPass");
    const loginBtn = page.locator("#loginBtn");


    await loginId.fill("admin");
    await loginPass.fill("samsung1010");
    await loginBtn.click();


    const menu = page.locator("#menuDivId");
    await expect(menu).toBeVisible({ timeout: 2000 }); // Đợi menu hiển thị trong tối đa 10s

    // Lấy nội dung menu
    const menuTexts = await menu.allTextContents();
    console.log(menuTexts);
});