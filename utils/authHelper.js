// utils/authHelper.js
import { expect } from '@playwright/test'; 

/**
 * @param {import('@playwright/test').Page} page
 */

export async function login(page) {
    // 1. Đi tới trang login
    await page.goto('https://eventhub.rahulshettyacademy.com/login');

    // 2. Sử dụng Locators chuẩn (getByRole, getByPlaceholder) để tăng độ ổn định
    await page.getByPlaceholder('you@email.com').fill('sqa.mis2025@gmail.com');
    await page.getByLabel('Password').fill('Infr@729');

    // 3. Click nút Login
    await page.locator('#login-btn').click();

    // 4. KIỂM TRA QUAN TRỌNG: Đợi cho đến khi đăng nhập thành công
    // Ví dụ: Đợi cho đến khi URL thay đổi hoặc một phần tử trong dashboard xuất hiện

    const browseEventsLink = page.getByRole('link', { name: 'Browse Events →' });
    // Đợi tối đa 10 giây thay vì 5 giây
    await expect(browseEventsLink).toBeVisible({ timeout: 10000 });

}
export function futureDateValue() {
    const date = new Date();
    date.setDate(date.getDate() + 1);
    return date.toISOString().slice(0, 16);
}