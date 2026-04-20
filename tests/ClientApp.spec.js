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
    await expect(menu).toBeVisible({ timeout: 15000 });

    // 4. QUAN TRỌNG: Đợi ít nhất 1 item bên trong menu có text
    // Giả sử menu có các thẻ <li> hoặc <a> bên trong
    const firstMenuItem = menu.locator('li').first();
    await expect(firstMenuItem).not.toBeEmpty();

    // 5. Lấy nội dung
    const menuTexts = await menu.allTextContents();
    console.log("Danh sách menu:", menuTexts);
});
const { test, expect } = require('@playwright/test');
 
 
 
 
test.only('@Webst Client App login', async ({ page }) => {
   //js file- Login js, DashboardPage
   const email = "anshika@gmail.com";
   const productName = 'ZARA COAT 3';
   const products = page.locator(".card-body");
   await page.goto("https://rahulshettyacademy.com/client");
   await page.locator("#userEmail").fill(email);
   await page.locator("#userPassword").fill("Iamking@000");
   await page.locator("[value='Login']").click();
   await page.waitForLoadState('networkidle');
   await page.locator(".card-body b").first().waitFor();
   const titles = await page.locator(".card-body b").allTextContents();
   console.log(titles); 
   const count = await products.count();
   for (let i = 0; i < count; ++i) {
      if (await products.nth(i).locator("b").textContent() === productName) {
         //add to cart
         await products.nth(i).locator("text= Add To Cart").click();
         break;
      }
   }
 
   await page.locator("[routerlink*='cart']").click();
   //await page.pause();
 
   await page.locator("div li").first().waitFor();
   const bool = await page.locator("h3:has-text('ZARA COAT 3')").isVisible();
   expect(bool).toBeTruthy();
   await page.locator("text=Checkout").click();
 
  await page.getByPlaceholder('Select Country').pressSequentially("ind", { delay: 150 }) 
   const dropdown = page.locator(".ta-results");
   await dropdown.waitFor();
   const optionsCount = await dropdown.locator("button").count();
   for (let i = 0; i < optionsCount; ++i) {
      const text = await dropdown.locator("button").nth(i).textContent();
      if (text === " India") {
         await dropdown.locator("button").nth(i).click();
         break;
      }
   }
 
   expect(page.locator(".user__name [type='text']").first()).toHaveText(email);
   await page.locator(".action__submit").click();
   await expect(page.locator(".hero-primary")).toHaveText(" Thankyou for the order. ");
   const orderId = await page.locator(".em-spacer-1 .ng-star-inserted").textContent();
   console.log(orderId);
 
   await page.locator("button[routerlink*='myorders']").click();
   await page.locator("tbody").waitFor();
   const rows = await page.locator("tbody tr");
 
 
   for (let i = 0; i < await rows.count(); ++i) {
      const rowOrderId = await rows.nth(i).locator("th").textContent();
      if (orderId.includes(rowOrderId)) {
         await rows.nth(i).locator("button").first().click();
         break;
      }
   }
   const orderIdDetails = await page.locator(".col-text").textContent();
   expect(orderId.includes(orderIdDetails)).toBeTruthy();
 
});
 