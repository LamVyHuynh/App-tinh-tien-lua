import { useState } from "react";

function App() {
  const [khoiLuong, setKhoiLuong] = useState("");
  const [gia, setGia] = useState("");
  const [tongTien, setTongTien] = useState(0);

  const handleThanhTien = () => {
    const soKg = parseFloat(khoiLuong) || 0;
    const soGia = parseFloat(gia) || 0;
    setTongTien(soKg * soGia);
  };

  const handleReset = () => {
    setKhoiLuong("");
    setGia("");
    setTongTien(0);
  };

  return (
    // Lớp bọc ngoài cùng: Chiếm toàn màn hình, nền xám nhạt, căn giữa nội dung
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      {/* Khối ứng dụng chính (Giống như màn hình điện thoại) */}
      <div className="bg-white w-full max-w-md p-6 rounded-2xl shadow-xl border border-gray-200">
        {/* Tiêu đề */}
        <h1 className="text-2xl font-black text-green-600 text-center mb-8 uppercase tracking-wide">
          🌾 Tính Tiền Lúa 🌾
        </h1>

        {/* Ô nhập Khối lượng */}
        <div className="mb-5">
          <label className="block text-gray-700 font-bold mb-2 text-lg">
            Khối lượng (kg):
          </label>
          <input
            type="number"
            value={khoiLuong}
            onChange={(e) => setKhoiLuong(e.target.value)}
            placeholder="Ví dụ: 5000"
            className="w-full p-4 border-2 border-gray-300 rounded-xl text-xl focus:outline-none focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all"
          />
        </div>

        {/* Ô nhập Giá */}
        <div className="mb-8">
          <label className="block text-gray-700 font-bold mb-2 text-lg">
            Đơn giá (đồng/kg):
          </label>
          <input
            type="number"
            value={gia}
            onChange={(e) => setGia(e.target.value)}
            placeholder="Ví dụ: 8500"
            className="w-full p-4 border-2 border-gray-300 rounded-xl text-xl focus:outline-none focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all"
          />
        </div>

        {/* Khu vực 2 nút bấm đặt nằm ngang */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={handleReset}
            className="flex-1 bg-gray-200 text-gray-700 font-bold py-4 rounded-xl text-lg hover:bg-gray-300 active:bg-gray-400 transition-colors"
          >
            Làm lại
          </button>
          <button
            onClick={handleThanhTien}
            className="flex-[2] bg-green-500 text-white font-bold py-4 rounded-xl text-xl shadow-lg shadow-green-200 hover:bg-green-600 active:bg-green-700 transition-all"
          >
            TÍNH TIỀN
          </button>
        </div>

        {/* Khu vực hiển thị kết quả tổng tiền */}
        <div className="bg-green-50 border-2 border-green-200 p-6 rounded-xl text-center">
          <p className="text-gray-500 font-bold mb-2">Thương lái cần trả:</p>
          <p className="text-4xl font-black text-green-700 break-words">
            {tongTien.toLocaleString("vi-VN")}{" "}
            <span className="text-2xl">đ</span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
