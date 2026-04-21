const { test, expect, request } = require('@playwright/test');
const loginPageLoad = { password: "samsung1010", username: "admin", osName: "Windows", osVersion: "10", browserName: "Chrome", browserVersion: "147" };
let token;

test.beforeAll(async () => {
    const apiContext = await request.newContext();
    const loginResponse = await apiContext.post("https://api-stg.samsungcms.com/MagicInfo/restapi/v2.0/auth", {
        headers: {
            'accept': '*/*',
            'accept-language': 'en-US,en;q=0.9',
            'origin': 'https://stg.samsungcms.com',
            'referer': 'https://stg.samsungcms.com/',
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36',
            // QUAN TRỌNG NHẤT:
            'x-tenantid': 'sqa1-stg',
            // Các header bảo mật trình duyệt (tùy chọn nhưng nên có)
            'sec-ch-ua': '"Google Chrome";v="147", "Not.A/Brand";v="8", "Chromium";v="147"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"Windows"',
            'sec-fetch-dest': 'empty',
            'sec-fetch-mode': 'cors',
            'sec-fetch-site': 'same-site'
        },

        data: loginPageLoad
    }
    )
    expect(loginResponse.ok()).toBeTruthy();
    const loginResponseJson = await loginResponse.json();
    token = loginResponseJson.token;
    console.log(token);

}
)

test('testTitlePage', async ({ page }) => {
    page.addInitScript(value => {
        window.localStorage.setItem('token', value)
    }, token);

    await page.goto("https://stg.samsungcms.com/sqa1-stg");
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