import { useState, useRef } from "react";

function App() {
  // Quản lý danh sách Thương lái. Mỗi thương lái có tên, đơn giá, cọc và danh sách các ghe.
  const [danhSachThuongLai, setDanhSachThuongLai] = useState([
    {
      id: 1,
      tenThuongLai: "Thương lái 1",
      donGia: "",
      tienCoc: "",
      danhSachGhe: [
        {
          id: 1,
          tenGhe: "Ghe số 1",
          bangKg: Array(5)
            .fill()
            .map(() => Array(5).fill("")),
        },
      ],
    },
  ]);

  // Đang chọn thương lái nào để hiển thị bảng nhập liệu chính
  const [thuongLaiDangChonId, setThuongLaiDangChonId] = useState(1);

  // Hệ thống tham chiếu để điều khiển trỏ chuột phím Enter
  // inputRefs.current[gheIndex][hangIndex][cotIndex]
  const inputRefs = useRef({});

  // Lấy dữ liệu của thương lái đang được chọn
  const thuongLaiHienTai =
    danhSachThuongLai.find((tl) => tl.id === thuongLaiDangChonId) ||
    danhSachThuongLai[0];

  // 1. CẬP NHẬT ĐƠN GIÁ HOẶC TIỀN CỌC CỦA THƯƠNG LÁI
  const handleThongTinThuongLai = (truong) => (e) => {
    const giaTri = e.target.value;
    const danhSachMoi = danhSachThuongLai.map((tl) => {
      if (tl.id === thuongLaiDangChonId) {
        return { ...tl, [truong]: giaTri };
      }
      return tl;
    });
    setDanhSachThuongLai(danhSachMoi);
  };

  // 2. CẬP NHẬT SỐ KG TRONG Ô CỦA GHE
  const handleInputChange = (gheId, hangIndex, cotIndex, e) => {
    const giaTri = e.target.value;
    const danhSachMoi = danhSachThuongLai.map((tl) => {
      if (tl.id === thuongLaiDangChonId) {
        const danhSachGheMoi = tl.danhSachGhe.map((ghe) => {
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
        return { ...tl, danhSachGhe: danhSachGheMoi };
      }
      return tl;
    });
    setDanhSachThuongLai(danhSachMoi);
  };

  // 3. TỰ ĐỘNG CHUYỂN Ô HOẶC TỰ SINH GHE MỚI KHI HẾT BẢNG
  const handleKeyDown = (gheIndex, hangIndex, cotIndex, e) => {
    if (e.key === "Enter" || e.key === "ArrowDown") {
      e.preventDefault();
      let hangMoi = hangIndex + 1;
      let cotMoi = cotIndex;
      let gheIdxMoi = gheIndex;

      // Nếu hết hàng trong bảng 5x5 hiện tại
      if (hangMoi >= 5) {
        hangMoi = 0;
        cotMoi = cotIndex + 1;
        // Nếu hết cột (hết cả bảng 5x5)
        if (cotMoi >= 5) {
          cotMoi = 0;
          gheIdxMoi = gheIndex + 1;

          // Nếu đã là ghe cuối cùng -> Tự động sinh thêm Ghe mới!
          if (gheIdxMoi >= thuongLaiHienTai.danhSachGhe.length) {
            const gheMoiId =
              thuongLaiHienTai.danhSachGhe.length > 0
                ? thuongLaiHienTai.danhSachGhe[
                    thuongLaiHienTai.danhSachGhe.length - 1
                  ].id + 1
                : 1;

            const gheMoiMoi = {
              id: gheMoiId,
              tenGhe: `Ghe số ${gheMoiId}`,
              bangKg: Array(5)
                .fill()
                .map(() => Array(5).fill("")),
            };

            const danhSachMoi = danhSachThuongLai.map((tl) => {
              if (tl.id === thuongLaiDangChonId) {
                return {
                  ...tl,
                  danhSachGhe: [...tl.danhSachGhe, gheMoiMoi],
                };
              }
              return tl;
            });

            setDanhSachThuongLai(danhSachMoi);
            // Sau khi state cập nhật, dịch chuyển con trỏ vào ô đầu tiên của ghe mới
            setTimeout(() => {
              if (
                inputRefs.current[gheIdxMoi] &&
                inputRefs.current[gheIdxMoi][0] &&
                inputRefs.current[gheIdxMoi][0][0]
              ) {
                inputRefs.current[gheIdxMoi][0][0].focus();
              }
            }, 50);
            return;
          }
        }
      }

      // Di chuyển bình thường trong các ô hiện có
      if (
        inputRefs.current[gheIdxMoi] &&
        inputRefs.current[gheIdxMoi][hangMoi] &&
        inputRefs.current[gheIdxMoi][hangMoi][cotMoi]
      ) {
        inputRefs.current[gheIdxMoi][hangMoi][cotMoi].focus();
      }
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      let hangMoi = hangIndex - 1;
      let cotMoi = cotIndex;
      let gheIdxMoi = gheIndex;

      if (hangMoi < 0) {
        hangMoi = 4;
        cotMoi = cotIndex - 1;
        if (cotMoi < 0) {
          cotMoi = 4;
          gheIdxMoi = Math.max(0, gheIndex - 1);
        }
      }

      if (
        inputRefs.current[gheIdxMoi] &&
        inputRefs.current[gheIdxMoi][hangMoi] &&
        inputRefs.current[gheIdxMoi][hangMoi][cotMoi]
      ) {
        inputRefs.current[gheIdxMoi][hangMoi][cotMoi].focus();
      }
    }
  };

  // 4. THÊM THƯƠNG LÁI MỚI
  const handleThemThuongLai = () => {
    const idMoi =
      danhSachThuongLai.length > 0
        ? danhSachThuongLai[danhSachThuongLai.length - 1].id + 1
        : 1;
    const tenMoi = `Thương lái ${idMoi}`;
    const tlMoi = {
      id: idMoi,
      tenThuongLai: tenMoi,
      donGia: "",
      tienCoc: "",
      danhSachGhe: [
        {
          id: 1,
          tenGhe: "Ghe số 1",
          bangKg: Array(5)
            .fill()
            .map(() => Array(5).fill("")),
        },
      ],
    };
    setDanhSachThuongLai([...danhSachThuongLai, tlMoi]);
    setThuongLaiDangChonId(idMoi);
  };

  // 5. XÓA THƯƠNG LÁI
  const handleXoaThuongLai = (id) => {
    if (danhSachThuongLai.length === 1) {
      alert("Cần giữ lại ít nhất một thương lái!");
      return;
    }
    const danhSachMoi = danhSachThuongLai.filter((tl) => tl.id !== id);
    setDanhSachThuongLai(danhSachMoi);
    setThuongLaiDangChonId(danhSachMoi[0].id);
  };

  // 6. THÊM GHE THỦ CÔNG (NẾU CẦN)
  const handleThemGheThuCong = () => {
    const danhSachMoi = danhSachThuongLai.map((tl) => {
      if (tl.id === thuongLaiDangChonId) {
        const gheMoiId =
          tl.danhSachGhe.length > 0
            ? tl.danhSachGhe[tl.danhSachGhe.length - 1].id + 1
            : 1;
        const gheMoi = {
          id: gheMoiId,
          tenGhe: `Ghe số ${gheMoiId}`,
          bangKg: Array(5)
            .fill()
            .map(() => Array(5).fill("")),
        };
        return { ...tl, danhSachGhe: [...tl.danhSachGhe, gheMoi] };
      }
      return tl;
    });
    setDanhSachThuongLai(danhSachMoi);
  };

  // 7. XÓA 1 GHE TRONG THƯƠNG LÁI HIỆN TẠI
  const handleXoaGhe = (gheId) => {
    const danhSachMoi = danhSachThuongLai.map((tl) => {
      if (tl.id === thuongLaiDangChonId) {
        if (tl.danhSachGhe.length === 1) {
          alert("Mỗi thương lái cần giữ lại ít nhất một ghe cân!");
          return tl;
        }
        return {
          ...tl,
          danhSachGhe: tl.danhSachGhe.filter((g) => g.id !== gheId),
        };
      }
      return tl;
    });
    setDanhSachThuongLai(danhSachMoi);
  };

  // 8. TÍNH TOÁN KẾT QUẢ CHO TỪNG THƯƠNG LÁI
  const ketQuaThuongLai = danhSachThuongLai.map((tl) => {
    let tongKgTatCaGhe = 0;
    const danhSachGheTinhToan = tl.danhSachGhe.map((ghe) => {
      const tongKgGhe = ghe.bangKg.reduce((tongSo, hang) => {
        const tongHang = hang.reduce(
          (sum, val) => sum + (parseFloat(val) || 0),
          0,
        );
        return tongSo + tongHang;
      }, 0);

      const soBaoGhe = ghe.bangKg.reduce((acc, hang) => {
        return acc + hang.filter((val) => val !== "" && !isNaN(val)).length;
      }, 0);

      tongKgTatCaGhe += tongKgGhe;
      return { ...ghe, tongKgGhe, soBaoGhe };
    });

    const gia = parseFloat(tl.donGia) || 0;
    const coc = parseFloat(tl.tienCoc) || 0;
    const thanhTien = Math.max(0, tongKgTatCaGhe * gia - coc);

    return {
      ...tl,
      danhSachGhe: danhSachGheTinhToan,
      tongKgTatCaGhe,
      thanhTien,
    };
  });

  const tlKetQuaHienTai =
    ketQuaThuongLai.find((tl) => tl.id === thuongLaiDangChonId) ||
    ketQuaThuongLai[0];

  // Tổng tiền tất cả các thương lái cộng lại
  const tongTienTatCaThuongLai = ketQuaThuongLai.reduce(
    (sum, tl) => sum + tl.thanhTien,
    0,
  );

  return (
    <div className="min-h-screen bg-gray-100 p-3 md:p-6 font-sans">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* HEADER */}
        <div className="bg-green-600 p-4 text-center rounded-2xl shadow-md">
          <h1 className="text-2xl md:text-3xl font-black text-white uppercase tracking-wide">
            🌾 HỆ THỐNG QUẢN LÝ THƯƠNG LÁI & GHE LÚA 🌾
          </h1>
        </div>

        {/* BỐ CỤC CHÍNH: CỘT TRÁI (NỘI DUNG GHE & TÍNH TIỀN) - CỘT PHẢI (DANH SÁCH THƯƠNG LÁI NHƯ SESSION) */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* CỘT TRÁI: KHU VỰC NHẬP LIỆU CỦA THƯƠNG LÁI ĐANG CHỌN (CHIẾM 3 CỘT) */}
          <div className="lg:col-span-3 space-y-6">
            {/* THÔNG TIN CẤU HÌNH ĐƠN GIÁ VÀ CỌC CỦA THƯƠNG LÁI HIỆN TẠI */}
            <div className="bg-white p-5 rounded-2xl shadow-xl border border-gray-200 space-y-4">
              <div className="flex justify-between items-center border-b pb-3">
                <h2 className="text-xl font-black text-green-700 uppercase">
                  👤 Đang quản lý: {tlKetQuaHienTai.tenThuongLai}
                </h2>
                {danhSachThuongLai.length > 1 && (
                  <button
                    onClick={() => handleXoaThuongLai(tlKetQuaHienTai.id)}
                    className="bg-red-100 text-red-600 hover:bg-red-200 px-3 py-1.5 rounded-lg font-bold text-sm transition-colors cursor-pointer"
                  >
                    ✕ Xóa thương lái này
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-bold mb-1">
                    Đơn giá mua (đồng/kg):
                  </label>
                  <input
                    type="text"
                    inputMode="decimal"
                    value={tlKetQuaHienTai.donGia}
                    onChange={handleThongTinThuongLai("donGia")}
                    placeholder="VD: 8500"
                    className="w-full p-3 border-2 border-gray-300 rounded-xl text-xl font-bold focus:border-green-500 focus:outline-none bg-white"
                  />
                </div>

                <div>
                  <label className="block text-blue-700 font-bold mb-1">
                    Tiền đặt cọc trước (VNĐ):
                  </label>
                  <input
                    type="text"
                    inputMode="decimal"
                    value={tlKetQuaHienTai.tienCoc}
                    onChange={handleThongTinThuongLai("tienCoc")}
                    placeholder="VD: 5000000"
                    className="w-full p-3 border-2 border-blue-200 bg-blue-50 rounded-xl text-xl font-bold focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* DANH SÁCH CÁC GHE CỦA THƯƠNG LÁI NÀY */}
            {tlKetQuaHienTai.danhSachGhe.map((ghe, gheIndex) => (
              <div
                key={ghe.id}
                className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden p-4 md:p-6 space-y-4"
              >
                <div className="flex justify-between items-center border-b pb-3">
                  <h3 className="text-lg font-bold text-gray-800 uppercase">
                    🚢 {ghe.tenGhe}
                  </h3>
                  {tlKetQuaHienTai.danhSachGhe.length > 1 && (
                    <button
                      onClick={() => handleXoaGhe(ghe.id)}
                      className="text-red-500 hover:bg-red-50 px-2.5 py-1 rounded-lg font-bold text-xs transition-colors cursor-pointer"
                    >
                      Xóa ghe
                    </button>
                  )}
                </div>

                {/* BẢNG LƯỚI 5x5 CHO GHE NÀY */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold text-gray-700 text-sm">
                      Nhập số Kg (Lưới 5x5):
                    </span>
                    <span className="text-xs font-semibold bg-green-100 text-green-800 px-2.5 py-1 rounded-full">
                      Đã nhập: {ghe.soBaoGhe} / 25 bao
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
                                    if (
                                      !inputRefs.current[gheIndex][hangIndex]
                                    ) {
                                      inputRefs.current[gheIndex][hangIndex] =
                                        [];
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
                                      gheIndex,
                                      hangIndex,
                                      cotIndex,
                                      e,
                                    )
                                  }
                                  placeholder="0"
                                  className="w-full p-2 text-center text-xl font-black border-2 border-gray-200 rounded-lg focus:border-green-500 focus:bg-green-50 focus:outline-none shadow-inner"
                                />
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* TỔNG KẾT RIÊNG GHE NÀY */}
                <div className="bg-gray-50 border border-gray-200 p-3 rounded-xl flex justify-between items-center text-sm font-bold text-gray-700">
                  <span>Khối lượng ghe này:</span>
                  <span className="text-green-800 text-lg">
                    {ghe.tongKgGhe} kg
                  </span>
                </div>
              </div>
            ))}

            {/* NÚT THÊM GHE THỦ CÔNG */}
            <button
              onClick={handleThemGheThuCong}
              className="w-full py-3 bg-blue-50 text-blue-700 font-bold border-2 border-dashed border-blue-300 rounded-2xl hover:bg-blue-100 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              ➕ Thêm Ghe Cân Cho Thương Lái Này
            </button>

            {/* TỔNG KẾT THANH TOÁN CHO THƯƠNG LÁI NÀY */}
            <div className="bg-green-50 border-2 border-green-200 p-5 rounded-2xl flex flex-col md:flex-row justify-between items-center gap-4">
              <div>
                <p className="text-gray-600 font-bold">
                  Tổng khối lượng tất cả các ghe:
                </p>
                <p className="text-2xl font-black text-green-800 mt-1">
                  {tlKetQuaHienTai.tongKgTatCaGhe} kg
                </p>
              </div>
              <div className="text-center md:text-right">
                <p className="text-gray-600 font-bold">Thương lái cần trả:</p>
                <p className="text-3xl md:text-4xl font-black text-green-700">
                  {tlKetQuaHienTai.thanhTien.toLocaleString("vi-VN")}{" "}
                  <span className="text-2xl">đ</span>
                </p>
              </div>
            </div>
          </div>

          {/* CỘT PHẢI: KHU VỰC QUẢN LÝ CÁC THƯƠNG LÁI (GIỐNG SESSION / TAB) */}
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-2xl shadow-xl border border-gray-200 space-y-3 sticky top-4">
              <h3 className="font-black text-gray-800 uppercase text-base border-b pb-2 flex items-center justify-between">
                <span>Danh sách Thương lái</span>
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                  {ketQuaThuongLai.length}
                </span>
              </h3>

              {/* DANH SÁCH TAB THƯƠNG LÁI */}
              <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
                {ketQuaThuongLai.map((tl) => {
                  const dangChon = tl.id === thuongLaiDangChonId;
                  return (
                    <div
                      key={tl.id}
                      onClick={() => setThuongLaiDangChonId(tl.id)}
                      className={`p-3 rounded-xl border-2 transition-all cursor-pointer flex flex-col gap-1 ${
                        dangChon
                          ? "border-green-500 bg-green-50 shadow-md"
                          : "border-gray-200 bg-white hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-gray-900 text-base">
                          {tl.tenThuongLai}
                        </span>
                        <span className="text-xs font-bold text-green-700 bg-green-100 px-2 py-0.5 rounded">
                          {tl.danhSachGhe.length} ghe
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 flex justify-between">
                        <span>{tl.tongKgTatCaGhe} kg</span>
                        <span className="font-bold text-green-600">
                          {tl.thanhTien.toLocaleString("vi-VN")} đ
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* NÚT THÊM THƯƠNG LÁI MỚI */}
              <button
                onClick={handleThemThuongLai}
                className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl transition-all shadow-md text-sm flex items-center justify-center gap-1 cursor-pointer"
              >
                ➕ Thêm Thương Lái
              </button>
            </div>

            {/* TỔNG KẾT TẤT CẢ TỪNG THƯƠNG LÁI CỘNG LẠI */}
            <div className="bg-gray-900 text-white p-4 rounded-2xl shadow-xl space-y-2">
              <p className="text-gray-400 font-bold text-xs uppercase tracking-wider">
                Tổng doanh thu tất cả thương lái:
              </p>
              <p className="text-2xl font-black text-green-400">
                {tongTienTatCaThuongLai.toLocaleString("vi-VN")} đ
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
