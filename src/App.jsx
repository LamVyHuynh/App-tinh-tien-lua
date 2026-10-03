import { useState } from "react";

function App() {
  // Khai báo các biến (state) để lưu dữ liệu người dùng nhập
  const [trongLuong, setTrongLuong] = useState("");
  const [truHao, setTruHao] = useState("");
  const [donGia, setDonGia] = useState("");
  const [tongTien, setTongTien] = useState(0);

  // Hàm thực hiện tính toán khi bấm nút
  const xuLyTinhTien = () => {
    // Chuyển đổi chữ thành số (nếu không nhập gì thì mặc định là 0)
    const soKg = parseFloat(trongLuong) || 0;
    const soKgTruHao = parseFloat(truHao) || 0;
    const gia = parseFloat(donGia) || 0;

    // Công thức tính: (Số Kg - Trừ hao) * Đơn giá
    const kgThucTe = soKg - soKgTruHao;
    const ketQua = kgThucTe * gia;

    // Cập nhật kết quả lên màn hình (nếu kết quả âm thì cho bằng 0)
    setTongTien(ketQua > 0 ? ketQua : 0);
  };

  // Hàm xóa trắng để tính mẻ mới
  const xoaTrang = () => {
    setTrongLuong("");
    setTruHao("");
    setDonGia("");
    setTongTien(0);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 font-sans text-gray-800">
      <div className="max-w-md mx-auto bg-white rounded-2xl shadow-md overflow-hidden">
        {/* Phần tiêu đề ứng dụng */}
        <div className="bg-green-600 p-4 text-center">
          <h1 className="text-2xl font-bold text-white">Tính Tiền Lúa 🌾</h1>
        </div>

        {/* Phần nhập liệu */}
        <div className="p-5 space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">
              Tổng số lúa (Kg)
            </label>
            <input
              type="number"
              className="w-full p-3 border border-gray-300 rounded-xl text-lg focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
              placeholder="VD: 5000"
              value={trongLuong}
              onChange={(e) => setTrongLuong(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">
              Trừ hao (Kg)
            </label>
            <input
              type="number"
              className="w-full p-3 border border-gray-300 rounded-xl text-lg focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
              placeholder="VD: 50"
              value={truHao}
              onChange={(e) => setTruHao(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">
              Đơn giá (VNĐ/Kg)
            </label>
            <input
              type="number"
              className="w-full p-3 border border-gray-300 rounded-xl text-lg focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
              placeholder="VD: 8500"
              value={donGia}
              onChange={(e) => setDonGia(e.target.value)}
            />
          </div>

          {/* Các nút bấm */}
          <div className="pt-4 flex gap-3">
            <button
              onClick={xoaTrang}
              className="w-1/3 py-3 rounded-xl bg-gray-200 text-gray-700 font-bold text-lg hover:bg-gray-300 active:bg-gray-400"
            >
              Xóa
            </button>
            <button
              onClick={xuLyTinhTien}
              className="w-2/3 py-3 rounded-xl bg-green-600 text-white font-bold text-lg hover:bg-green-700 active:bg-green-800 shadow-lg shadow-green-200"
            >
              TÍNH TIỀN
            </button>
          </div>
        </div>

        {/* Phần hiển thị kết quả */}
        <div className="bg-green-50 p-6 text-center border-t border-green-100">
          <p className="text-gray-500 font-semibold mb-1">
            Tổng tiền nhận được:
          </p>
          <p className="text-4xl font-black text-green-700 break-words">
            {/* toLocaleString giúp thêm dấu chấm phân cách hàng nghìn (VD: 10.000.000) */}
            {tongTien.toLocaleString("vi-VN")} đ
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
