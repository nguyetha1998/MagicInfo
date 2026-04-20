import { test, expect } from '@playwright/test';
import { login, futureDateValue } from '../utils/authHelper'; // Import hàm helper

test('Create new event', async ({ page }) => {
    // Gọi hàm login ngay khi bắt đầu test
    await login(page);

    // Tiếp tục các bước test khác sau khi đã login
    await page.getByRole('button', { name: 'Admin' }).click();
    await page.getByRole('link', { name: 'Manage Events' }).nth(0).click();
    await expect(page).toHaveURL(/.*admin\/events/);


    // 2. Tạo tiêu đề sự kiện duy nhất
    const eventTitle = `Test Event ${Date.now()}`;

    // 3. Điền các trường thông tin
    // Locate by ID
    await page.locator('#event-title-input').fill(eventTitle);

    // Locate using CSS selector (textarea bên trong form)
    await page.locator('#admin-event-form textarea').fill('This is descripttion for new event');

    // Locate by Label (Best practice)
    await page.getByLabel('City').fill('Ho Chi Minh City');
    await page.getByLabel('Venue').fill('Landmark 81');

    // Sử dụng helper futureDateValue() cho Date & Time
    const eventDate = futureDateValue(); // Giả sử hàm này trả về string định dạng đúng
    await page.getByLabel('Event Date & Time').fill(eventDate);

    await page.getByLabel('Price ($)').fill('100');
    await page.getByLabel('Total Seats').fill('50');

    // 4. Click Submit bằng ID
    await page.locator('#add-event-btn').click();

    // 5. Assert: Kiểm tra thông báo toast xuất hiện
    // Dùng getByText để tìm nội dung thông báo
    const toastMessage = page.getByText('Event created!');
    await expect(toastMessage).toBeVisible();

    // 1. Điều hướng tới trang danh sách sự kiện công khai
    await page.getByTestId('nav-events').click();
    expect(page).toHaveURL(/.*\events/);

    // 2. Lấy tất cả các card sự kiện
    const eventCards = page.getByTestId('event-card');

    // 3. Assert card đầu tiên hiển thị để đảm bảo trang đã load xong
    await expect(eventCards.first()).toBeVisible();

    // 4. Lọc đúng card có chứa tiêu đề sự kiện đã tạo ở Step 2
    // Lưu ý: Biến eventTitle phải được định nghĩa ở phạm vi mà Step 3 có thể truy cập
    const myEventCard = eventCards.filter({ hasText: eventTitle });

    // 5. Assert card của mình tìm thấy và hiển thị (timeout 5s)
    await expect(myEventCard).toBeVisible({ timeout: 5000 });

    // 6. Đọc số lượng chỗ ngồi (Seats)
    // Giả sử text hiển thị dạng "50 seats" hoặc "Seats: 50"
    const seatText = await myEventCard.locator('text=/seat/i').innerText();

    // Dùng Regex để trích xuất con số từ chuỗi (ví dụ: "50 seats" -> 50)
    const seatsBeforeBooking = parseInt(seatText.match(/\d+/)[0]);

    console.log(`Số ghế trước khi đặt: ${seatsBeforeBooking}`);

    // 1. Tìm nút "Book Now" nằm BÊN TRONG card sự kiện đã khớp
    const bookNowBtn = myEventCard.getByTestId('book-now-btn');

    // 2. Thực hiện click
    await bookNowBtn.click();

    // 3. (Tùy chọn) Kiểm tra xem sau khi click có hiện ra form đặt chỗ hoặc chuyển trang không
    // Ví dụ: await expect(page).toHaveURL(/.*booking/);
    // 1. Assert: Kiểm tra số lượng vé mặc định là 1
    const ticketCount = page.locator('#ticket-count');
    await expect(ticketCount).toHaveText('1');

    // 2. Điền thông tin cá nhân
    // Locate by Label
    await page.getByLabel('Full Name').fill('Nguyễn Văn A');

    // Locate by ID
    await page.locator('#customer-email').fill('testuser@example.com');

    // Locate by Placeholder
    await page.getByPlaceholder('+91 98765 43210').fill('0901234567');

    // 3. Click nút xác nhận bằng CSS class
    await page.locator('.confirm-booking-btn').click();
    // 1. Định vị phần tử chứa mã đặt chỗ (lấy cái đầu tiên nếu có nhiều hơn một)
    const bookingRefElement = page.locator('.booking-ref').first();

    // 2. Assert: Đảm bảo mã đặt chỗ hiển thị trên màn hình
    await expect(bookingRefElement).toBeVisible();

    // 3. Đọc nội dung, loại bỏ khoảng trắng dư thừa và lưu vào biến
    const bookingRefRaw = await bookingRefElement.innerText();
    const bookingRef = bookingRefRaw.trim();

    console.log(`Mã đặt chỗ của bạn là: ${bookingRef}`);
    // 1. Click vào link View My Bookings
    await page.getByRole('link', { name: 'View My Bookings' }).click();

    // 2. Assert: URL phải chính xác (Giả sử BASE_URL đã được cấu hình trong playwright.config.js)
    await expect(page).toHaveURL(/.*\/bookings/);

    // 3. Lấy tất cả các booking cards và kiểm tra card đầu tiên hiển thị
    const bookingCards = page.locator('#booking-card');
    await expect(bookingCards.first()).toBeVisible();

    // 4. Lọc card chứa mã đặt chỗ (bookingRef) đã lưu ở Step 6
    // Chúng ta dùng filter với locator con có class .booking-ref
    const myBookingCard = bookingCards.filter({
        has: page.locator('.booking-ref'),
        hasText: bookingRef
    });

    // 5. Assert: Card tìm thấy phải hiển thị
    await expect(myBookingCard).toBeVisible();

    // 6. Assert: Kiểm tra xem card đó có chứa tiêu đề sự kiện (eventTitle) đúng không
    await expect(myBookingCard).toContainText(eventTitle);
    // 1. Quay lại trang danh sách sự kiện
    await page.getByTestId('nav-events').click();
    expect(page).toHaveURL(/.*\events/);

    // 2. Đợi trang load bằng cách kiểm tra card đầu tiên
    const eventCardsUpdate = page.getByTestId('event-card');
    await expect(eventCardsUpdate.first()).toBeVisible();

    // 3. Tìm đúng card sự kiện của mình một lần nữa
    const myEventCardUpdate = eventCardsUpdate.filter({ hasText: eventTitle });
    await expect(myEventCardUpdate).toBeVisible();

    // 4. Đọc số lượng chỗ ngồi sau khi đặt vé
    const seatTextAfter = await myEventCardUpdate.locator('text=/seat/i').innerText();
    const seatsAfterBooking = parseInt(seatTextAfter.match(/\d+/));

    // 5. Kiểm tra logic: Số ghế sau phải ít hơn số ghế trước đúng 1 đơn vị
    // Sử dụng expect để nếu sai nó sẽ báo lỗi đỏ rõ ràng trong report
    expect(seatsAfterBooking).toBe(seatsBeforeBooking - 1);

    console.log(`Xác nhận: ${seatsBeforeBooking} -> ${seatsAfterBooking} (Giảm 1 ghế thành công)`);


});
