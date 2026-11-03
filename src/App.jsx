import { useState, useRef } from "react";

function App() {
  // Quản lý danh sách các ghe (Mỗi phần tử là 1 ghe độc lập có đơn giá, tiền cọc và bảng 5x5 riêng)
  const [danhSachGhe, setDanhSachGhe] = useState([
    {
      id: 1,
      tenGhe: "Ghe số 1",
      donGia: "",
      tienCoc: "",
      bangKg: Array(5)
        .fill()
        .map(() => Array(5).fill("")),
    },
  ]);

  // Hệ thống tham chiếu để điều khiển trỏ chuột phím Enter cho từng ô trong từng ghe
  // inputRefs.current[gheIndex][hangIndex][cotIndex]
  const inputRefs = useRef({});

  // 1. HÀM CẬP NHẬT GIÁ TRỊ Ô TRONG GHE TƯƠNG ỨNG
  const handleInputChange = (gheId, hangIndex, cotIndex, e) => {
    const giaTri = e.target.value;
    const danhSachMoi = danhSachGhe.map((ghe) => {
      if (ghe.id === gheId) {
        const bangMoi = ghe.bangKg.map((hang, hIdx) =>
          hang.map((col, cIdx) => {
            if (hIdx === hangIndex && cIdx === cotIndex) return giaTri;
            return col;
          }),
        );
        return { ...ghe, bangKg: bangMoi };
      }
      return ghe;
    });
    setDanhSachGhe(danhSachMoi);
  };

  // 2. CẬP NHẬT ĐƠN GIÁ HOẶC TIỀN CỌC CHO TỪNG GHE
  const handleThongTinGhe = (trường) => (gheId, e) => {
    const giaTri = e.target.value;
    const danhSachMoi = danhSachGhe.map((ghe) => {
      if (ghe.id === gheId) {
        return { ...ghe, [trường]: giaTri };
      }
      return ghe;
    });
    setDanhSachGhe(danhSachMoi);
  };

  // 3. HÀM XỬ LÝ PHÍM ENTER TỰ ĐỘNG CHUYỂN Ô TRONG PHẠM VI GHE ĐÓ
  const handleKeyDown = (gheId, gheIndex, hangIndex, cotIndex, e) => {
    let hangMoi = hangIndex;
    let cotMoi = cotIndex;

    if (e.key === "Enter" || e.key === "ArrowDown") {
      e.preventDefault();
      hangMoi = hangIndex + 1;
      if (hangMoi >= 5) {
        hangMoi = 0;
        cotMoi = cotIndex + 1;
        if (cotMoi >= 5) cotMoi = 0;
      }
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      hangMoi = hangIndex - 1;
      if (hangMoi < 0) {
        hangMoi = 4;
        cotMoi = cotIndex - 1;
        if (cotMoi < 0) cotMoi = 4;
      }
    }

    if (
      inputRefs.current[gheIndex] &&
      inputRefs.current[gheIndex][hangMoi] &&
      inputRefs.current[gheIndex][hangMoi][cotMoi]
    ) {
      inputRefs.current[gheIndex][hangMoi][cotMoi].focus();
    }
  };

  // 4. HÀM THÊM GHE MỚI
  const handleThemGhe = () => {
    const gheMoiId =
      danhSachGhe.length > 0 ? danhSachGhe[danhSachGhe.length - 1].id + 1 : 1;
    setDanhSachGhe([
      ...danhSachGhe,
      {
        id: gheMoiId,
        tenGhe: `Ghe số ${gheMoiId}`,
        donGia: "",
        tienCoc: "",
        bangKg: Array(5)
          .fill()
          .map(() => Array(5).fill("")),
      },
    ]);
  };

  // 5. HÀM XÓA 1 GHE
  const handleXoaGhe = (gheId) => {
    if (danhSachGhe.length === 1) {
      alert("Cần giữ lại ít nhất một ghe cân!");
      return;
    }
    setDanhSachGhe(danhSachGhe.filter((ghe) => ghe.id !== gheId));
  };

  // 6. TÍNH TOÁN TỔNG KẾT CHO TỪNG GHE VÀ TOÀN BỘ
  const ketQuaTungGhe = danhSachGhe.map((ghe) => {
    const tongKg = ghe.bangKg.reduce((tongSo, hang) => {
      const tongHang = hang.reduce(
        (sum, val) => sum + (parseFloat(val) || 0),
        0,
      );
      return tongSo + tongHang;
    }, 0);

    // Đếm chính xác số bao đã nhập cho ghe này
    const soBaoThucTe = ghe.bangKg.reduce((acc, hang) => {
      return acc + hang.filter((val) => val !== "" && !isNaN(val)).length;
    }, 0);

    const gia = parseFloat(ghe.donGia) || 0;
    const coc = parseFloat(ghe.tienCoc) || 0;
    const thanhTien = Math.max(0, tongKg * gia - coc);

    return {
      ...ghe,
      tongKg,
      soBaoThucTe,
      thanhTien,
    };
  });

  // Tổng tiền tất cả các ghe cộng lại
  const tongTienTatCa = ketQuaTungGhe.reduce((sum, g) => sum + g.thanhTien, 0);

  // Hàm làm lại từ đầu
  const handleReset = () => {
    setDanhSachGhe([
      {
        id: 1,
        tenGhe: "Ghe số 1",
        donGia: "",
        tienCoc: "",
        bangKg: Array(5)
          .fill()
          .map(() => Array(5).fill("")),
      },
    ]);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-3 md:p-6 font-sans">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* HEADER */}
        <div className="bg-green-600 p-4 text-center rounded-2xl shadow-md">
          <h1 className="text-2xl md:text-3xl font-black text-white uppercase tracking-wide">
            🌾 QUẢN LÝ TÍNH TIỀN LÚA THEO GHE 🌾
          </h1>
        </div>

        {/* DANH SÁCH CÁC GHE */}
        {ketQuaTungGhe.map((ghe, gheIndex) => (
          <div
            key={ghe.id}
            className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden p-4 md:p-6 space-y-4 relative"
          >
            {/* Tiêu đề Ghe và Nút xóa ghe */}
            <div className="flex justify-between items-center border-b pb-3">
              <h2 className="text-xl font-black text-green-700 uppercase">
                🚢 {ghe.tenGhe}
              </h2>
              {danhSachGhe.length > 1 && (
                <button
                  onClick={() => handleXoaGhe(ghe.id)}
                  className="bg-red-100 text-red-600 hover:bg-red-200 px-3 py-1 rounded-lg font-bold text-sm transition-colors"
                >
                  ✕ Xóa ghe này
                </button>
              )}
            </div>

            {/* Cấu hình đơn giá và tiền cọc của ghe này */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl border border-gray-200">
              <div>
                <label className="block text-gray-700 font-bold mb-1">
                  Đơn giá (đồng/kg):
                </label>
                <input
                  type="text"
                  inputMode="decimal"
                  value={ghe.donGia}
                  onChange={(e) => handleThongTinGhe("donGia")(ghe.id, e)}
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
                  value={ghe.tienCoc}
                  onChange={(e) => handleThongTinGhe("tienCoc")(ghe.id, e)}
                  placeholder="VD: 5000000"
                  className="w-full p-3 border-2 border-blue-200 bg-blue-50 rounded-lg text-xl font-bold focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Lưới 5x5 nhập số kg của ghe */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold text-gray-700">
                  Nhập số Kg (5x5):
                </span>
                <span className="text-xs font-semibold bg-green-100 text-green-800 px-2.5 py-1 rounded-full">
                  Đã nhập: {ghe.soBaoThucTe} / 25 bao
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-green-100 text-green-900 text-sm">
                      <th className="p-2 border border-green-200">Cột 1</th>
                      <th className="p-2 border border-green-200">Cột 2</th>
                      <th className="p-2 border border-green-200">Cột 3</th>
                      <th className="p-2 border border-green-200">Cột 4</th>
                      <th className="p-2 border border-green-200">Cột 5</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ghe.bangKg.map((hang, hangIndex) => (
                      <tr key={hangIndex}>
                        {hang.map((colVal, cotIndex) => (
                          <td
                            key={cotIndex}
                            className="p-1.5 border border-gray-200 bg-white"
                          >
                            <input
                              type="text"
                              inputMode="decimal"
                              ref={(el) => {
                                if (!inputRefs.current[gheIndex]) {
                                  inputRefs.current[gheIndex] = [];
                                }
                                if (!inputRefs.current[gheIndex][hangIndex]) {
                                  inputRefs.current[gheIndex][hangIndex] = [];
                                }
                                inputRefs.current[gheIndex][hangIndex][
                                  cotIndex
                                ] = el;
                              }}
                              value={colVal}
                              onChange={(e) =>
                                handleInputChange(
                                  ghe.id,
                                  hangIndex,
                                  cotIndex,
                                  e,
                                )
                              }
                              onKeyDown={(e) =>
                                handleKeyDown(
                                  ghe.id,
                                  gheIndex,
                                  hangIndex,
                                  cotIndex,
                                  e,
                                )
                              }
                              placeholder="0"
                              className="w-full p-2.5 text-center text-xl font-black border-2 border-gray-200 rounded-lg focus:border-green-500 focus:bg-green-50 focus:outline-none shadow-inner"
                            />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Tổng kết riêng của ghe này */}
            <div className="bg-green-50 border border-green-200 p-4 rounded-xl flex flex-col md:flex-row justify-between items-center gap-2">
              <p className="text-gray-700 font-bold">
                Tổng khối lượng:{" "}
                <span className="text-green-800">{ghe.tongKg} kg</span>
              </p>
              <p className="text-lg md:text-xl font-black text-green-700">
                Thành tiền: {ghe.thanhTien.toLocaleString("vi-VN")} đ
              </p>
            </div>
          </div>
        ))}

        {/* NÚT THÊM GHE MỚI */}
        <button
          onClick={handleThemGhe}
          className="w-full py-4 bg-blue-600 text-white font-bold rounded-2xl shadow-lg hover:bg-blue-700 transition-all text-lg flex items-center justify-center gap-2 cursor-pointer"
        >
          ➕ Thêm Ghe Cân Mới
        </button>

        {/* TỔNG KẾT TẤT CẢ CÁC GHE */}
        <div className="bg-gray-900 text-white p-6 rounded-2xl shadow-2xl flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <p className="text-gray-400 font-bold uppercase tracking-wider text-sm">
              Tổng kết toàn bộ các ghe:
            </p>
            <p className="text-3xl md:text-4xl font-black text-green-400 mt-1">
              {tongTienTatCa.toLocaleString("vi-VN")} đ
            </p>
          </div>
          <button
            onClick={handleReset}
            className="px-5 py-3 bg-gray-700 hover:bg-gray-600 text-white font-bold rounded-xl transition-colors text-sm cursor-pointer"
          >
            🔄 Xóa tất cả & Làm lại từ đầu
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
