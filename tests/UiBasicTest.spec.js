const { test, expect } = require('@playwright/test');

test('testTitlePage', async ({ browser }) => {
    // 1. Tạo một ngữ cảnh mới (giống như mở cửa sổ ẩn danh)
    const context = await browser.newContext();

    // 2. Tạo một trang mới (giống như mở một Tab)
    const page = await context.newPage();

    // 3. Thực hiện test
    await page.goto('https://sqa1-stg.samsungcms.com');
    await expect(page).toHaveTitle(/MagicInfo Server/);
});
test.only('testLogin', async ({ browser }) => {
    // 1. Tạo một ngữ cảnh mới (giống như mở cửa sổ ẩn danh)
    const context = await browser.newContext();

    // 2. Tạo một trang mới (giống như mở một Tab)
    const page = await context.newPage();

    //3. Khai bao bien
    const loginId = page.locator("#loginId");
    const loginPass = page.locator("#loginPass");
    const loginBtn = page.locator("#loginBtn");
    const errorMessgae = page.locator("#loginErrorWrap");

    // 3. Thực hiện test
    await page.goto('https://sqa1-stg.samsungcms.com');
    await expect(page).toHaveTitle(/MagicInfo Server/);
    await loginId.fill("admin");
    await loginPass.fill("samsung1010");
    await loginBtn.click();
    await expect(errorMessgae).toContainText("An unexpected error has occurred");

   /*  await loginId.clear();
    await loginId.fill("admin");
    await loginPass.clear();
    await loginPass.fill("samsung1010");
    await loginBtn.click(); */

    const dashBoard = page.locator("#menuDivId");
    await dashBoard.isVisible();

});