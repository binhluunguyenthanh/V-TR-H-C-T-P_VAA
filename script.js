// ==========================================
// 1. CẤU HÌNH ADAFRUIT IO
// ==========================================
// Điền Username và Active Key của bạn trên Adafruit IO vào đây
const AIO_USERNAME = "TEN_USER_CUA_BAN"; 
const AIO_KEY = "KEY_BÍ_MẬT_CUA_BAN";
const BASE_URL = `https://io.adafruit.com/api/v2/${AIO_USERNAME}/feeds`;

// ==========================================
// 2. HÀM ĐỌC DỮ LIỆU TỪ CLOUD (CẢM BIẾN & RFID)
// ==========================================
async function getLatestData(feedName, elementId) {
    try {
        const response = await fetch(`${BASE_URL}/${feedName}/data/last`, {
            method: 'GET',
            headers: { 'X-AIO-Key': AIO_KEY }
        });
        
        if (response.ok) {
            const data = await response.json();
            // Cập nhật giá trị ra giao diện HTML
            let el = document.getElementById(elementId);
            if(el) el.innerText = data.value;
            return data.value;
        }
    } catch (error) {
        console.error(`Lỗi khi lấy dữ liệu từ feed [${feedName}]:`, error);
    }
}

// Hàm này sẽ quét toàn bộ dữ liệu mới nhất
function updateDashboard() {
    // Lưu ý: Sửa lại các tham số "temp_id", "humi_id"... cho TRÙNG KHỚP 
    // với các ID thẻ <span> hoặc <div> trong file index.html của bạn.
    getLatestData("kho-nhiet-do", "temp_id"); 
    getLatestData("kho-do-am", "humi_id");
    getLatestData("kho-rfid", "rfid_id");
}

// Chạy vòng lặp lấy dữ liệu mỗi 3 giây (Tránh gọi liên tục bị block API)
setInterval(updateDashboard, 3000);
updateDashboard(); // Gọi ngay lần đầu tiên khi load web

// ==========================================
// 3. HÀM GỬI LỆNH XUỐNG MẠCH (ĐỔI CHẾ ĐỘ)
// ==========================================
async function setSystemMode(modeValue) {
    try {
        const response = await fetch(`${BASE_URL}/kho-mode/data`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-AIO-Key': AIO_KEY
            },
            // Đóng gói giá trị để gửi lên Adafruit
            body: JSON.stringify({ datum: { value: modeValue } }) 
        });

        if (response.ok) {
            console.log("Đã đổi Mode thành công: " + modeValue);
            // Bạn có thể viết code đổi màu nút bấm ở đây để UI đẹp hơn
        } else {
            alert("Lỗi kết nối đến máy chủ!");
        }
    } catch (error) {
        console.error("Lỗi khi gửi lệnh:", error);
    }
}

// Gắn sự kiện cho các nút bấm chuyển Mode (Check=0, Import=1, Export=2)
// Lưu ý: Nhớ kiểm tra xem id "btn-check", "btn-import"... có đúng với file HTML không nhé!
let btnCheck = document.getElementById("btn-check");
if(btnCheck) btnCheck.addEventListener("click", () => setSystemMode(0));

let btnImport = document.getElementById("btn-import");
if(btnImport) btnImport.addEventListener("click", () => setSystemMode(1));

let btnExport = document.getElementById("btn-export");
if(btnExport) btnExport.addEventListener("click", () => setSystemMode(2));