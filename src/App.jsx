import { useState, useRef } from "react";

function App() {
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

  const [thuongLaiDangChonId, setThuongLaiDangChonId] = useState(1);
  const inputRefs = useRef({});

  const thuongLaiHienTai =
    danhSachThuongLai.find((tl) => tl.id === thuongLaiDangChonId) ||
    danhSachThuongLai[0];

  // 1. Cập nhật đơn giá hoặc tiền cọc
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

  // 2. Cập nhật số kg trong bảng 5x5
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

  // 3. Tự động chuyển ô và tự sinh ghe mới khi gõ hết bảng
  const handleKeyDown = (gheIndex, hangIndex, cotIndex, e) => {
    if (e.key === "Enter" || e.key === "ArrowDown") {
      e.preventDefault();
      let hangMoi = hangIndex + 1;
      let cotMoi = cotIndex;
      let gheIdxMoi = gheIndex;

      if (hangMoi >= 5) {
        hangMoi = 0;
        cotMoi = cotIndex + 1;
        if (cotMoi >= 5) {
          cotMoi = 0;
          gheIdxMoi = gheIndex + 1;

          // Nếu hết ghe hiện tại -> Tự động sinh Ghe mới
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

  // 4. Thêm thương lái mới
  const handleThemThuongLai = () => {
    const idMoi =
      danhSachThuongLai.length > 0
        ? danhSachThuongLai[danhSachThuongLai.length - 1].id + 1
        : 1;
    const tlMoi = {
      id: idMoi,
      tenThuongLai: `Thương lái ${idMoi}`,
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

  // 5. Xóa thương lái
  const handleXoaThuongLai = (id) => {
    if (danhSachThuongLai.length === 1) {
      alert("Cần giữ lại ít nhất một thương lái!");
      return;
    }
    const danhSachMoi = danhSachThuongLai.filter((tl) => tl.id !== id);
    setDanhSachThuongLai(danhSachMoi);
    setThuongLaiDangChonId(danhSachMoi[0].id);
  };

  // 6. Đặt lại (Xóa trắng dữ liệu thương lái hiện tại)
  const handleResetThuongLai = () => {
    const danhSachMoi = danhSachThuongLai.map((tl) => {
      if (tl.id === thuongLaiDangChonId) {
        return {
          ...tl,
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
      }
      return tl;
    });
    setDanhSachThuongLai(danhSachMoi);
  };

  // 7. Thêm ghe thủ công
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

  // 8. Xóa ghe
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

  // Tính toán số liệu
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

  const tongTienTatCaThuongLai = ketQuaThuongLai.reduce(
    (sum, tl) => sum + tl.thanhTien,
    0,
  );

  return (
    <div className="min-h-screen bg-gray-100 p-3 md:p-6 font-sans">
      <div className="max-w-3xl mx-auto space-y-5">
        {/* TIÊU ĐỀ */}
        <div className="bg-green-600 p-4 text-center rounded-2xl shadow-lg">
          <h1 className="text-2xl md:text-3xl font-black text-white uppercase tracking-wide">
            TÍNH TIỀN LÚA NHANH
          </h1>
        </div>

        {/* PHẦN 1: CHỌN THƯƠNG LÁI (DẠNG NÚT BẤM NGANG TO RÕ) */}
        <div className="bg-white p-4 rounded-2xl shadow-md border border-gray-200 space-y-3">
          <p className="text-sm font-bold text-gray-500 uppercase">
            Chọn Thương Lái:
          </p>
          <div className="flex flex-wrap gap-2">
            {ketQuaThuongLai.map((tl) => {
              const dangChon = tl.id === thuongLaiDangChonId;
              return (
                <button
                  key={tl.id}
                  onClick={() => setThuongLaiDangChonId(tl.id)}
                  className={`px-4 py-3 rounded-xl font-bold text-base transition-all cursor-pointer flex items-center gap-2 ${
                    dangChon
                      ? "bg-green-600 text-white shadow-lg scale-105"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <span>{tl.tenThuongLai}</span>
                </button>
              );
            })}
            <button
              onClick={handleThemThuongLai}
              className="px-4 py-3 rounded-xl font-bold text-base bg-blue-600 text-white hover:bg-blue-700 transition-all shadow-md cursor-pointer"
            >
              ➕ Thêm Thương Lái
            </button>
          </div>
        </div>

        {/* PHẦN 2: CẤU HÌNH THƯƠNG LÁI ĐANG CHỌN */}
        <div className="bg-white p-5 rounded-2xl shadow-md border border-gray-200 space-y-4">
          <div className="flex justify-between items-center border-b pb-3 flex-wrap gap-2">
            <h2 className="text-xl font-black text-green-700 uppercase">
              👤 Đang xem: {tlKetQuaHienTai.tenThuongLai}
            </h2>
            <div className="flex gap-2">
              <button
                onClick={handleResetThuongLai}
                className="bg-gray-100 text-gray-700 hover:bg-gray-200 px-3 py-1.5 rounded-lg font-bold text-sm cursor-pointer"
              >
                🔄 Đặt lại từ đầu
              </button>
              {danhSachThuongLai.length > 1 && (
                <button
                  onClick={() => handleXoaThuongLai(tlKetQuaHienTai.id)}
                  className="bg-red-100 text-red-600 hover:bg-red-200 px-3 py-1.5 rounded-lg font-bold text-sm cursor-pointer"
                >
                  ✕ Xóa
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-bold mb-1 text-sm">
                Đơn giá (đồng/kg):
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
              <label className="block text-blue-700 font-bold mb-1 text-sm">
                Tiền cọc trước (VNĐ):
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

        {/* PHẦN 3: DANH SÁCH CÁC GHE & BẢNG NHẬP LIỆU */}
        {tlKetQuaHienTai.danhSachGhe.map((ghe, gheIndex) => (
          <div
            key={ghe.id}
            className="bg-white rounded-2xl shadow-md border border-gray-200 p-4 md:p-5 space-y-3"
          >
            <div className="flex justify-between items-center border-b pb-2">
              <h3 className="text-lg font-black text-gray-800 uppercase">
                🚢 {ghe.tenGhe}
              </h3>
              {tlKetQuaHienTai.danhSachGhe.length > 1 && (
                <button
                  onClick={() => handleXoaGhe(ghe.id)}
                  className="text-red-500 hover:bg-red-50 px-2.5 py-1 rounded-lg font-bold text-xs cursor-pointer"
                >
                  Xóa ghe này
                </button>
              )}
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold text-gray-600 text-sm">
                  Nhập số Kg lúa:
                </span>
                <span className="text-xs font-semibold bg-green-100 text-green-800 px-2.5 py-1 rounded-full">
                  Đã nhập: {ghe.soBaoGhe} / 25 bao
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-green-100 text-green-900 text-xs">
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
                            className="p-1 border border-gray-200 bg-white"
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
                                handleKeyDown(gheIndex, hangIndex, cotIndex, e)
                              }
                              placeholder="0"
                              className="w-full p-2.5 text-center text-xl font-black border-2 border-gray-200 rounded-lg focus:border-green-500 focus:bg-green-50 focus:outline-none"
                            />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-gray-50 border border-gray-200 p-3 rounded-xl flex justify-between items-center font-bold text-gray-700 text-sm">
              <span>Khối lượng ghe này:</span>
              <span className="text-green-800 text-lg font-black">
                {ghe.tongKgGhe} kg
              </span>
            </div>
          </div>
        ))}

        {/* NÚT THÊM GHE THỦ CÔNG */}
        <button
          onClick={handleThemGheThuCong}
          className="w-full py-3.5 bg-blue-50 text-blue-700 font-bold border-2 border-dashed border-blue-300 rounded-2xl hover:bg-blue-100 transition-all flex items-center justify-center gap-2 cursor-pointer text-base"
        >
          ➕ Thêm Ghe Mới Cho Thương Lái Này
        </button>

        {/* TỔNG KẾT TIỀN CỦA THƯƠNG LÁI NÀY */}
        <div className="bg-green-50 border-2 border-green-300 p-5 rounded-2xl flex flex-col sm:flex-row justify-between items-center gap-3">
          <div>
            <p className="text-gray-600 font-bold text-sm">Tổng khối lượng:</p>
            <p className="text-2xl font-black text-green-800">
              {tlKetQuaHienTai.tongKgTatCaGhe} kg
            </p>
          </div>
          <div className="text-center sm:text-right">
            <p className="text-gray-600 font-bold text-sm">
              Thương lái cần trả:
            </p>
            <p className="text-3xl font-black text-green-700">
              {tlKetQuaHienTai.thanhTien.toLocaleString("vi-VN")} đ
            </p>
          </div>
        </div>

        {/* TỔNG DOANH THU TẤT CẢ THƯƠNG LÁI */}
        <div className="bg-gray-900 text-white p-5 rounded-2xl shadow-xl flex justify-between items-center">
          <div>
            <p className="text-gray-400 font-bold text-xs uppercase tracking-wider">
              Tổng tiền tất cả thương lái:
            </p>
            <p className="text-3xl font-black text-green-400 mt-1">
              {tongTienTatCaThuongLai.toLocaleString("vi-VN")} đ
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
