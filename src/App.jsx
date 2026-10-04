import { useState } from "react";

function App() {
  // Sử dụng chuỗi rỗng ("") giúp ô nhập liệu hoàn toàn trống trải
  const [khoiLuong, setKhoiLuong] = useState("");
  const [gia, setGia] = useState("");
  const [tongTien, setTongTien] = useState(0);

  // Hàm xử lý tính toán khi bấm nút
  const handleThanhTien = () => {
    // Ép kiểu thành số ngay lúc tính. Ký hiệu || 0 để đảm bảo nếu ô bị bỏ trống thì máy tự hiểu là 0 kg.
    const soKg = parseFloat(khoiLuong) || 0;
    const soGia = parseFloat(gia) || 0;

    setTongTien(soKg * soGia);
  };

  // Hàm dọn dẹp để bắt đầu tính mẻ lúa mới
  const handleReset = () => {
    setKhoiLuong("");
    setGia("");
    setTongTien(0);
  };

  return (
    <div>
      <h1>Ứng dụng tính tiền lúa</h1>
      <p>
        Khối lượng:
        <input
          type="number"
          value={khoiLuong}
          // Lưu trực tiếp chuỗi văn bản được gõ vào
          onChange={(e) => setKhoiLuong(e.target.value)}
        />
        kg
      </p>
      <p>
        Giá:
        <input
          type="number"
          value={gia}
          onChange={(e) => setGia(e.target.value)}
        />
        đồng/kg
      </p>
      <button onClick={handleThanhTien}>Tính tiền</button>
      <button onClick={handleReset}>Xoá thông tin</button>

      {/* toLocaleString() giúp hiển thị dấu chấm phân cách hàng nghìn (VD: 50.000) */}
      <p>Tổng tiền: {tongTien.toLocaleString("vi-VN")} đồng</p>
    </div>
  );
}

export default App;
