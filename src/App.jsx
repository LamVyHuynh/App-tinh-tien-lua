import { useState } from "react";

function App() {
  const [khoiLuong, setKhoiLuong] = useState("");
  const [gia, setGia] = useState("");
  const [tongTien, setTongTien] = useState(0);

  // Khởi tạo bằng chuỗi rỗng ("") để ô nhập liệu trống trơn
  const [truHao, setTruHao] = useState("");
  const [tienCoc, setTienCoc] = useState("");

  const handleThanhTien = () => {
    // Thêm parseFloat cho tất cả để đảm bảo an toàn toán học
    const soKg = parseFloat(khoiLuong) || 0;
    const soGia = parseFloat(gia) || 0;
    const tyLeTruHao = parseFloat(truHao) || 0;
    const soTienCoc = parseFloat(tienCoc) || 0;

    const truHaoKg = (soKg * tyLeTruHao) / 100; // Tính số kg bị trừ hao
    const soKgSauTruHao = soKg - truHaoKg; // Số kg sau khi trừ hao
    const tongTienSauTruHao = soKgSauTruHao * soGia; // Tính tổng tiền sau khi trừ hao
    const tongTienFinal = tongTienSauTruHao - soTienCoc; // Trừ tiền cọc nếu có

    // Nếu tiền bị âm (do cọc lố), hiển thị 0
    setTongTien(tongTienFinal > 0 ? tongTienFinal : 0);
  };

  const handleReset = () => {
    setKhoiLuong("");
    setGia("");
    setTongTien(0);
    setTruHao("");
    setTienCoc("");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md p-6 rounded-2xl shadow-xl border border-gray-200">
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

        {/* Ô nhập Trừ hao mới thêm */}
        <div className="mb-5">
          <label className="block text-gray-700 font-bold mb-2 text-lg">
            Trừ hao tạp chất (%):
          </label>
          <input
            type="number"
            value={truHao}
            onChange={(e) => setTruHao(e.target.value)}
            placeholder="Ví dụ: 2 (tương đương 2%)"
            className="w-full p-4 border-2 border-gray-300 rounded-xl text-xl focus:outline-none focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all"
          />
        </div>

        {/* Ô nhập Giá */}
        <div className="mb-5">
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

        {/* Ô nhập Tiền cọc thiết kế riêng màu xanh dương */}
        <div className="mb-8">
          <label className="block text-blue-700 font-bold mb-2 text-lg">
            Tiền đặt cọc trước (VNĐ):
          </label>
          <input
            type="number"
            value={tienCoc}
            onChange={(e) => setTienCoc(e.target.value)}
            placeholder="Ví dụ: 10000000"
            className="w-full p-4 border-2 border-blue-200 bg-blue-50 rounded-xl text-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
          />
        </div>

        {/* Khu vực 2 nút bấm */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={handleReset}
            className="cursor-pointer flex-1 bg-gray-200 text-gray-700 font-bold py-4 rounded-xl text-lg hover:bg-gray-300 active:bg-gray-400 transition-colors"
          >
            Làm lại
          </button>
          <button
            onClick={handleThanhTien}
            className="cursor-pointer flex-[2] bg-green-500 text-white font-bold py-4 rounded-xl text-xl shadow-lg shadow-green-200 hover:bg-green-600 active:bg-green-700 transition-all"
          >
            TÍNH TIỀN
          </button>
        </div>

        {/* Khu vực kết quả */}
        <div className="bg-green-50 border-2 border-green-200 p-6 rounded-xl text-center">
          <p className="text-gray-500 font-bold mb-2">
            Thương lái cần đưa thêm:
          </p>
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
