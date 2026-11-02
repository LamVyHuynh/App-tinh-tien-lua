import { useState, useRef } from "react";

function App() {
  // 1. THÔNG TIN CẤU HÌNH BAN ĐẦU (Đơn giá và Tiền cọc)
  const [donGia, setDonGia] = useState("");
  const [tienCoc, setTienCoc] = useState("");

  // 2. MẢNG DỮ LIỆU LƯỚI 5 CỘT x 5 HÀNG
  const [bangKg, setBangKg] = useState(
    Array(5)
      .fill()
      .map(() => Array(5).fill("")),
  );

  // Mảng tham chiếu lưu vị trí các ô input (5 hàng x 5 cột)
  const inputRefs = useRef(
    Array(5)
      .fill()
      .map(() => Array(5).fill(null)),
  );

  // 3. HÀM CẬP NHẬT GIÁ TRỊ KHI GÕ SỐ
  const handleInputChange = (hangIndex, cotIndex, e) => {
    const giaTri = e.target.value;
    const danhSachMoi = bangKg.map((hang, hIdx) =>
      hang.map((col, cIdx) => {
        if (hIdx === hangIndex && cIdx === cotIndex) {
          return giaTri;
        }
        return col;
      }),
    );
    setBangKg(danhSachMoi);
  };

  // 4. HÀM XỬ LÝ PHÍM BẤM (TỰ ĐỘNG CHUYỂN Ô XUỐNG DỌC VÀ SANG CỘT)
  const handleKeyDown = (hangIndex, cotIndex, e) => {
    let hangMoi = hangIndex;
    let cotMoi = cotIndex;

    if (e.key === "Enter" || e.key === "ArrowDown") {
      e.preventDefault();
      hangMoi = hangIndex + 1;
      // Nếu hết hàng dọc thì chuyển sang hàng 0 của cột kế tiếp
      if (hangMoi >= 5) {
        hangMoi = 0;
        cotMoi = cotIndex + 1;
        if (cotMoi >= 5) {
          cotMoi = 0; // Quay về ô đầu tiên nếu ở góc phải dưới cùng
        }
      }
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      hangMoi = hangIndex - 1;
      if (hangMoi < 0) {
        hangMoi = 4;
        cotMoi = cotIndex - 1;
        if (cotMoi < 0) {
          cotMoi = 4;
        }
      }
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      cotMoi = cotIndex + 1;
      if (cotMoi >= 5) cotMoi = 0;
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      cotMoi = cotIndex - 1;
      if (cotMoi < 0) cotMoi = 4;
    }

    // Di chuyển con trỏ sang ô mới
    if (inputRefs.current[hangMoi] && inputRefs.current[hangMoi][cotMoi]) {
      inputRefs.current[hangMoi][cotMoi].focus();
    }
  };

  // 5. CÁC PHÉP TÍNH TOÁN TỰ ĐỘNG
  const tongKgThietLap = bangKg.reduce((tongSo, hang) => {
    const tongHang = hang.reduce((sum, val) => sum + (parseFloat(val) || 0), 0);
    return tongSo + tongHang;
  }, 0);

  const tongSoBao = bangKg.reduce((tongBao, hang) => {
    const soBaoHang = hang.filter((val) => val !== "" && !isNaN(val)).length;
    return tongBao + soBaoHang;
  }, 0);

  const kgThucTe = tongKgThietLap;
  const gia = parseFloat(donGia) || 0;
  const coc = parseFloat(tienCoc) || 0;

  const tongTienFinal = Math.max(0, kgThucTe * gia - coc);

  // 6. HÀM XÓA TRẮNG DỮ LIỆU
  const handleReset = () => {
    setDonGia("");
    setTienCoc("");
    setBangKg(
      Array(5)
        .fill()
        .map(() => Array(5).fill("")),
    );
    if (inputRefs.current[0] && inputRefs.current[0][0]) {
      inputRefs.current[0][0].focus();
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-3 md:p-6 font-sans">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
        {/* HEADER */}
        <div className="bg-green-600 p-4 text-center">
          <h1 className="text-2xl md:text-3xl font-black text-white uppercase tracking-wide">
            🌾 BẢNG CÂN LÚA NHANH (5x5) 🌾
          </h1>
        </div>

        <div className="p-4 md:p-6 space-y-6">
          {/* CẤU HÌNH ĐẦU VÀO */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl border border-gray-200">
            <div>
              <label className="block text-gray-700 font-bold mb-1">
                Đơn giá (đồng/kg):
              </label>
              <input
                type="text"
                inputMode="decimal"
                value={donGia}
                onChange={(e) => setDonGia(e.target.value)}
                placeholder="VD: 8500"
                className="w-full p-3 border-2 border-gray-300 rounded-lg text-xl font-bold focus:border-green-500 focus:outline-none bg-white"
              />
            </div>

            <div>
              <label className="block text-blue-700 font-bold mb-1">
                Tiền đặt cọc trước (VNĐ):
              </label>
              <input
                type="text"
                inputMode="decimal"
                value={tienCoc}
                onChange={(e) => setTienCoc(e.target.value)}
                placeholder="VD: 5000000"
                className="w-full p-3 border-2 border-blue-200 bg-blue-50 rounded-lg text-xl font-bold focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>

          {/* LƯỚI NHẬP SỐ KG (5 CỘT x 5 HÀNG) */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-xl font-bold text-gray-800">
                Nhập số Kg (Lưới 5x5):
              </h2>
              <span className="text-sm font-semibold bg-green-100 text-green-800 px-3 py-1 rounded-full">
                Đã nhập: {tongSoBao} / 25 bao
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-green-100 text-green-900 text-lg">
                    <th className="p-3 border border-green-200">Cột 1</th>
                    <th className="p-3 border border-green-200">Cột 2</th>
                    <th className="p-3 border border-green-200">Cột 3</th>
                    <th className="p-3 border border-green-200">Cột 4</th>
                    <th className="p-3 border border-green-200">Cột 5</th>
                  </tr>
                </thead>
                <tbody>
                  {bangKg.map((hang, hangIndex) => (
                    <tr key={hangIndex}>
                      {hang.map((colVal, cotIndex) => (
                        <td
                          key={cotIndex}
                          className="p-2 border border-gray-200 bg-white"
                        >
                          <input
                            type="text"
                            inputMode="decimal"
                            ref={(el) => {
                              if (!inputRefs.current[hangIndex]) {
                                inputRefs.current[hangIndex] = [];
                              }
                              inputRefs.current[hangIndex][cotIndex] = el;
                            }}
                            value={colVal}
                            onChange={(e) =>
                              handleInputChange(hangIndex, cotIndex, e)
                            }
                            onKeyDown={(e) =>
                              handleKeyDown(hangIndex, cotIndex, e)
                            }
                            placeholder="0"
                            className="w-full p-3 text-center text-2xl font-black border-2 border-gray-200 rounded-xl focus:border-green-500 focus:bg-green-50 focus:outline-none shadow-inner"
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-sm text-gray-500 mt-3 text-center">
              💡 Mẹo: Gõ số và nhấn phím <b>Enter</b> để di chuyển xuống dưới và
              tự động sang cột tiếp theo.
            </p>
          </div>

          {/* KHU VỰC TỔNG KẾT KẾT QUẢ */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-green-50 border-2 border-green-200 p-5 rounded-2xl">
            <div className="space-y-2 text-gray-700 text-lg flex flex-col justify-center">
              <p>
                • Tổng khối lượng thực tính:{" "}
                <span className="font-bold text-green-800 text-xl">
                  {kgThucTe} kg
                </span>
              </p>
            </div>

            <div className="text-center md:text-right flex flex-col justify-center">
              <p className="text-gray-600 font-bold mb-1">
                Thương lái cần thanh toán:
              </p>
              <p className="text-3xl md:text-4xl font-black text-green-700">
                {tongTienFinal.toLocaleString("vi-VN")}{" "}
                <span className="text-2xl">đ</span>
              </p>
            </div>
          </div>

          {/* NÚT LÀM LẠI */}
          <div className="text-center pt-2">
            <button
              onClick={handleReset}
              className="px-6 py-3 bg-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-300 transition-colors text-lg"
            >
              🔄 Xóa tất cả & Làm lại từ đầu
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
