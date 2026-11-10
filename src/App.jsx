import { useState, useRef, useEffect } from "react";

// Hàm định dạng số tiền có dấu chấm phân cách hàng nghìn (VD: 8500 -> 8.500)
function formatTien(soStr) {
  if (soStr === undefined || soStr === null || soStr === "") return "0";
  const raw = String(soStr).replace(/\D/g, "");
  if (!raw) return "0";
  const clean = raw.replace(/^0+(?=\d)/, ""); // Bỏ các số 0 dư thừa ở đầu
  return clean.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

// Chuyển chuỗi tiền có dấu chấm thành số thực tế để tính toán (VD: "8.500" -> 8500)
function parseSoTien(val) {
  if (!val) return 0;
  const clean = String(val).replace(/\./g, "").replace(/,/g, ".");
  return parseFloat(clean) || 0;
}

function App() {
  // 1. Khởi tạo dữ liệu từ LocalStorage để không bao giờ bị mất khi tải lại trang / tắt app
  const [danhSachThuongLai, setDanhSachThuongLai] = useState(() => {
    try {
      const saved = localStorage.getItem("tinh_lua_danh_sach");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((tl) => ({
            ...tl,
            donGia: formatTien(tl.donGia ?? "0"),
            tienCoc: formatTien(tl.tienCoc ?? "0"),
            truBi:
              tl.truBi !== undefined && tl.truBi !== ""
                ? String(tl.truBi)
                : "0",
          }));
        }
      }
    } catch (e) {
      console.error("Lỗi đọc dữ liệu từ localStorage:", e);
    }
    return [
      {
        id: 1,
        tenThuongLai: "Thương lái 1",
        donGia: "0",
        tienCoc: "0",
        truBi: "0", // Trừ bì (kg/bao)
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
    ];
  });

  const [thuongLaiDangChonId, setThuongLaiDangChonId] = useState(() => {
    try {
      const savedId = localStorage.getItem("tinh_lua_id_chon");
      if (savedId) {
        return JSON.parse(savedId);
      }
    } catch {
      // Bỏ qua nếu chưa có dữ liệu lưu
    }
    return 1;
  });

  const [thongBaoSaoChep, setThongBaoSaoChep] = useState(false);
  const inputRefs = useRef({});

  // Tự động lưu vào LocalStorage mỗi khi danh sách thương lái thay đổi
  useEffect(() => {
    try {
      localStorage.setItem(
        "tinh_lua_danh_sach",
        JSON.stringify(danhSachThuongLai),
      );
    } catch (e) {
      console.error("Lỗi lưu localStorage:", e);
    }
  }, [danhSachThuongLai]);

  // Tự động lưu thương lái đang chọn
  useEffect(() => {
    try {
      localStorage.setItem(
        "tinh_lua_id_chon",
        JSON.stringify(thuongLaiDangChonId),
      );
    } catch {
      // Bỏ qua nếu chưa có dữ liệu lưu
    }
  }, [thuongLaiDangChonId]);

  const thuongLaiHienTai =
    danhSachThuongLai.find((tl) => tl.id === thuongLaiDangChonId) ||
    danhSachThuongLai[0];

  // Cập nhật thông tin thông thường (tên thương lái, trừ bì)
  const handleThongTinThuongLai = (truong) => (e) => {
    let giaTri = e.target.value;
    if (truong === "truBi") {
      giaTri = giaTri.replace(",", "."); // Hỗ trợ gõ dấu phẩy thành dấu chấm
    }
    const danhSachMoi = danhSachThuongLai.map((tl) => {
      if (tl.id === thuongLaiDangChonId) {
        return { ...tl, [truong]: giaTri };
      }
      return tl;
    });
    setDanhSachThuongLai(danhSachMoi);
  };

  // Cập nhật tiền tệ tự động format dấu chấm (VD: 8500 -> 8.500)
  const handleTienChange = (truong) => (e) => {
    const raw = e.target.value.replace(/\D/g, "");
    let formatted = "";
    if (raw) {
      const clean = raw.replace(/^0+(?=\d)/, ""); // Bỏ số 0 ở đầu nếu sau đó có số khác
      formatted = clean.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }
    const danhSachMoi = danhSachThuongLai.map((tl) => {
      if (tl.id === thuongLaiDangChonId) {
        return { ...tl, [truong]: formatted };
      }
      return tl;
    });
    setDanhSachThuongLai(danhSachMoi);
  };

  // Khi người dùng bấm ra ngoài ô tiền nếu trống thì tự về "0"
  const handleTienBlur = (truong) => (e) => {
    if (!e.target.value.trim()) {
      const danhSachMoi = danhSachThuongLai.map((tl) => {
        if (tl.id === thuongLaiDangChonId) {
          return { ...tl, [truong]: "0" };
        }
        return tl;
      });
      setDanhSachThuongLai(danhSachMoi);
    }
  };

  // Cập nhật tên ghe
  const handleDoiTenGhe = (gheId, tenMoi) => {
    const danhSachMoi = danhSachThuongLai.map((tl) => {
      if (tl.id === thuongLaiDangChonId) {
        const danhSachGheMoi = tl.danhSachGhe.map((ghe) => {
          if (ghe.id === gheId) {
            return { ...ghe, tenGhe: tenMoi };
          }
          return ghe;
        });
        return { ...tl, danhSachGhe: danhSachGheMoi };
      }
      return tl;
    });
    setDanhSachThuongLai(danhSachMoi);
  };

  // Hàm chuyển ô tiếp theo tự động và sinh ghe nếu hết bảng 25 bao
  const chuyenOtiepTheo = (gheIndex, hangIndex, cotIndex) => {
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
            const el =
              inputRefs.current[gheIdxMoi] &&
              inputRefs.current[gheIdxMoi][0] &&
              inputRefs.current[gheIdxMoi][0][0];
            if (el) {
              el.focus();
              el.scrollIntoView({ behavior: "smooth", block: "center" });
            }
          }, 80);
          return;
        }
      }
    }

    const targetInput =
      inputRefs.current[gheIdxMoi] &&
      inputRefs.current[gheIdxMoi][hangMoi] &&
      inputRefs.current[gheIdxMoi][hangMoi][cotMoi];

    if (targetInput) {
      targetInput.focus();
      targetInput.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  // Hàm lùi về ô trước đó (khi bấm phím Backspace tại ô trống hoặc mũi tên lên)
  const luiVeOtruocDo = (gheIndex, hangIndex, cotIndex) => {
    let hangTruoc = hangIndex - 1;
    let cotTruoc = cotIndex;
    let gheIdxTruoc = gheIndex;

    if (hangTruoc < 0) {
      hangTruoc = 4;
      cotTruoc = cotIndex - 1;
      if (cotTruoc < 0) {
        cotTruoc = 4;
        gheIdxTruoc = Math.max(0, gheIndex - 1);
      }
    }

    const targetInput =
      inputRefs.current[gheIdxTruoc] &&
      inputRefs.current[gheIdxTruoc][hangTruoc] &&
      inputRefs.current[gheIdxTruoc][hangTruoc][cotTruoc];

    if (targetInput) {
      targetInput.focus();
      targetInput.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  // Nhập số kg: Gõ 3 số (vd: 524 -> 52.4) hoặc nhập đúng chuẩn XX.X tự động nhảy ô
  const handleInputChange = (gheId, gheIndex, hangIndex, cotIndex, e) => {
    let giaTri = e.target.value;
    giaTri = giaTri.replace(",", "."); // Hỗ trợ đổi dấu phẩy thành dấu chấm

    let giaTriCanLuu = giaTri;
    let coTheChuyenO = false;

    // Trường hợp 1: Nhập 3 chữ số liền mạch (VD: "524") -> Tự động thành "52.4"
    if (/^\d{3}$/.test(giaTri)) {
      giaTriCanLuu = giaTri.slice(0, 2) + "." + giaTri.slice(2);
      coTheChuyenO = true;
    }
    // Trường hợp 2: Người dùng chủ động nhập đúng chuẩn dạng XX.X (VD: "45.6")
    else if (/^\d{2}\.\d$/.test(giaTri)) {
      coTheChuyenO = true;
    }

    const danhSachMoi = danhSachThuongLai.map((tl) => {
      if (tl.id === thuongLaiDangChonId) {
        const danhSachGheMoi = tl.danhSachGhe.map((ghe) => {
          if (ghe.id === gheId) {
            const bangMoi = ghe.bangKg.map((hang, hIdx) =>
              hang.map((col, cIdx) => {
                if (hIdx === hangIndex && cIdx === cotIndex)
                  return giaTriCanLuu;
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

    if (coTheChuyenO) {
      setTimeout(() => {
        chuyenOtiepTheo(gheIndex, hangIndex, cotIndex);
      }, 150);
    }
  };

  // Bắt phím điều hướng và phím xóa lùi Backspace
  const handleKeyDown = (gheIndex, hangIndex, cotIndex, e) => {
    if (e.key === "Enter" || e.keyCode === 13) {
      e.preventDefault();
      chuyenOtiepTheo(gheIndex, hangIndex, cotIndex);
    } else if (e.key === "Backspace" && e.target.value === "") {
      // Khi ô rỗng bấm Backspace -> tự động lùi về ô trước
      e.preventDefault();
      luiVeOtruocDo(gheIndex, hangIndex, cotIndex);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      luiVeOtruocDo(gheIndex, hangIndex, cotIndex);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      chuyenOtiepTheo(gheIndex, hangIndex, cotIndex);
    }
  };

  // Thêm thương lái mới (mặc định các ô tiền và trừ bì bằng "0")
  const handleThemThuongLai = () => {
    const idMoi =
      danhSachThuongLai.length > 0
        ? danhSachThuongLai[danhSachThuongLai.length - 1].id + 1
        : 1;
    const tlMoi = {
      id: idMoi,
      tenThuongLai: `Thương lái ${idMoi}`,
      donGia: "0",
      tienCoc: "0",
      truBi: "0",
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

  // Xóa thương lái (CÓ HỎI XÁC NHẬN)
  const handleXoaThuongLai = (id) => {
    if (danhSachThuongLai.length === 1) {
      alert("Cần giữ lại ít nhất một thương lái!");
      return;
    }
    const tlXoa = danhSachThuongLai.find((tl) => tl.id === id);
    const ten = tlXoa ? tlXoa.tenThuongLai : "thương lái này";
    if (
      !window.confirm(
        `⚠️ CẢNH BÁO: Bạn có chắc chắn muốn xóa "${ten}" không?\nToàn bộ số liệu cân của thương lái này sẽ bị xóa hoàn toàn!`,
      )
    ) {
      return;
    }
    const danhSachMoi = danhSachThuongLai.filter((tl) => tl.id !== id);
    setDanhSachThuongLai(danhSachMoi);
    setThuongLaiDangChonId(danhSachMoi[0].id);
  };

  // Đặt lại dữ liệu thương lái hiện tại (Mặc định đơn giá, cọc, trừ bì về "0")
  const handleResetThuongLai = () => {
    if (
      !window.confirm(
        `⚠️ CẢNH BÁO: Bạn có chắc muốn ĐẶT LẠI từ đầu cho "${thuongLaiHienTai.tenThuongLai}"?\nToàn bộ số kg đã nhập sẽ bị xóa trắng về 0!`,
      )
    ) {
      return;
    }
    const danhSachMoi = danhSachThuongLai.map((tl) => {
      if (tl.id === thuongLaiDangChonId) {
        return {
          ...tl,
          donGia: "0",
          tienCoc: "0",
          truBi: "0",
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

  // Thêm ghe thủ công
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

  // Xóa ghe (CÓ HỎI XÁC NHẬN)
  const handleXoaGhe = (gheId) => {
    if (thuongLaiHienTai.danhSachGhe.length === 1) {
      alert("Mỗi thương lái cần giữ lại ít nhất một ghe cân!");
      return;
    }
    const gheXoa = thuongLaiHienTai.danhSachGhe.find((g) => g.id === gheId);
    const tenGhe = gheXoa ? gheXoa.tenGhe : "ghe này";
    if (
      !window.confirm(
        `⚠️ Bạn có chắc chắn muốn xóa "${tenGhe}" không?\nToàn bộ số kg trong ghe này sẽ bị xóa!`,
      )
    ) {
      return;
    }
    const danhSachMoi = danhSachThuongLai.map((tl) => {
      if (tl.id === thuongLaiDangChonId) {
        return {
          ...tl,
          danhSachGhe: tl.danhSachGhe.filter((g) => g.id !== gheId),
        };
      }
      return tl;
    });
    setDanhSachThuongLai(danhSachMoi);
  };

  // Tính toán số liệu chuẩn xác (bao gồm Trừ bì, Tổng kg thực tính, Tổng tiền)
  const ketQuaThuongLai = danhSachThuongLai.map((tl) => {
    let tongKgTatCaGhe = 0;
    let tongSoBaoTatCaGhe = 0;

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

      // Tính tổng theo từng cột (5 cột)
      const tongTungCot = [0, 1, 2, 3, 4].map((cIdx) => {
        let kgCot = 0;
        let baoCot = 0;
        for (let hIdx = 0; hIdx < 5; hIdx++) {
          const val = ghe.bangKg[hIdx][cIdx];
          if (val !== "" && !isNaN(val)) {
            kgCot += parseFloat(val) || 0;
            baoCot += 1;
          }
        }
        return {
          kg: Math.round(kgCot * 100) / 100,
          soBao: baoCot,
        };
      });

      tongKgTatCaGhe += tongKgGhe;
      tongSoBaoTatCaGhe += soBaoGhe;

      return {
        ...ghe,
        tongKgGhe: Math.round(tongKgGhe * 100) / 100,
        soBaoGhe,
        tongTungCot,
      };
    });

    const gia = parseSoTien(tl.donGia);
    const coc = parseSoTien(tl.tienCoc);
    const truBiMoiBao = parseFloat(String(tl.truBi).replace(",", ".")) || 0;

    // Tính trừ bì
    const tongKgTruBi = Math.round(tongSoBaoTatCaGhe * truBiMoiBao * 100) / 100;
    const tongKgThucTinh = Math.max(
      0,
      Math.round((tongKgTatCaGhe - tongKgTruBi) * 100) / 100,
    );

    const tongTienLua = Math.round(tongKgThucTinh * gia);
    const thanhTien = tongTienLua - coc;

    return {
      ...tl,
      danhSachGhe: danhSachGheTinhToan,
      tongKgTatCaGhe: Math.round(tongKgTatCaGhe * 100) / 100,
      tongSoBaoTatCaGhe,
      tongKgTruBi,
      tongKgThucTinh,
      tongTienLua,
      thanhTien,
    };
  });

  const tlKetQuaHienTai =
    ketQuaThuongLai.find((tl) => tl.id === thuongLaiDangChonId) ||
    ketQuaThuongLai[0];

  const tongTienTatCaThuongLai = ketQuaThuongLai.reduce(
    (sum, tl) => sum + Math.max(0, tl.thanhTien),
    0,
  );

  // Tạo và sao chép phiếu tính tiền lúa gửi Zalo
  const handleSaoChepPhieuZalo = () => {
    const today = new Date().toLocaleDateString("vi-VN");
    let chiTietGhe = "";
    tlKetQuaHienTai.danhSachGhe.forEach((ghe) => {
      chiTietGhe += `• ${ghe.tenGhe}: ${
        ghe.soBaoGhe
      } bao = ${ghe.tongKgGhe.toLocaleString("vi-VN")} kg\n`;
    });

    const donGiaNum = parseSoTien(tlKetQuaHienTai.donGia);
    const tienCocNum = parseSoTien(tlKetQuaHienTai.tienCoc);

    const noiDung = `🌾 PHIẾU TÍNH TIỀN LÚA 🌾
📅 Ngày: ${today}
👤 Thương lái: ${tlKetQuaHienTai.tenThuongLai}
🚢 Số lượng ghe: ${tlKetQuaHienTai.danhSachGhe.length} ghe
📦 Tổng số bao: ${tlKetQuaHienTai.tongSoBaoTatCaGhe} bao
-------------------------------
⚖️ Tổng khối lượng cân: ${tlKetQuaHienTai.tongKgTatCaGhe.toLocaleString(
      "vi-VN",
    )} kg
📦 Trừ bì (${
      parseFloat(String(tlKetQuaHienTai.truBi).replace(",", ".")) || 0
    } kg/bao x ${
      tlKetQuaHienTai.tongSoBaoTatCaGhe
    } bao): -${tlKetQuaHienTai.tongKgTruBi.toLocaleString("vi-VN")} kg
🌾 Khối lượng thực tính: ${tlKetQuaHienTai.tongKgThucTinh.toLocaleString(
      "vi-VN",
    )} kg
💰 Đơn giá: ${donGiaNum.toLocaleString("vi-VN")} đ/kg
💵 Tổng tiền lúa: ${tlKetQuaHienTai.tongTienLua.toLocaleString("vi-VN")} đ
💸 Tiền cọc trước: ${tienCocNum.toLocaleString("vi-VN")} đ
👉 ${
      tlKetQuaHienTai.thanhTien >= 0
        ? `THƯƠNG LÁI CẦN TRẢ: ${tlKetQuaHienTai.thanhTien.toLocaleString(
            "vi-VN",
          )} đ`
        : `DƯ CỌC (CẦN THỐI LẠI): ${Math.abs(
            tlKetQuaHienTai.thanhTien,
          ).toLocaleString("vi-VN")} đ`
    }
-------------------------------
🚢 Chi tiết từng ghe:
${chiTietGhe.trim()}
-------------------------------
(Tạo bởi App Tính Lúa Nhanh)`;

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(noiDung).then(() => {
        setThongBaoSaoChep(true);
        setTimeout(() => setThongBaoSaoChep(false), 3000);
      });
    } else {
      // Dự phòng nếu trình duyệt không hỗ trợ clipboard API
      const textArea = document.createElement("textarea");
      textArea.value = noiDung;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setThongBaoSaoChep(true);
      setTimeout(() => setThongBaoSaoChep(false), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-3 md:p-6 font-sans pb-16">
      <div className="max-w-3xl mx-auto space-y-5">
        {/* TIÊU ĐỀ */}
        <div className="bg-green-600 p-4 text-center rounded-2xl shadow-lg flex items-center justify-between">
          <div className="w-8"></div>
          <h1 className="text-2xl md:text-3xl font-black text-white uppercase tracking-wide">
            🌾 TÍNH TIỀN LÚA NHANH
          </h1>
          <div className="text-white text-xs bg-green-700 px-2.5 py-1 rounded-full font-semibold">
            💾 Đã tự lưu
          </div>
        </div>

        {/* THÔNG BÁO SAO CHÉP THÀNH CÔNG */}
        {thongBaoSaoChep && (
          <div className="bg-emerald-500 text-white p-3 rounded-xl text-center font-bold shadow-lg flex items-center justify-center gap-2 animate-bounce">
            <span>
              ✅ Đã sao chép phiếu tính tiền! Hãy dán vào Zalo để gửi ngay.
            </span>
          </div>
        )}

        {/* PHẦN 1: CHỌN THƯƠNG LÁI */}
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

        {/* PHẦN 2: CẤU HÌNH THƯƠNG LÁI ĐANG CHỌN (ĐỔI TÊN, ĐƠN GIÁ, CỌC, TRỪ BÌ) */}
        <div className="bg-white p-5 rounded-2xl shadow-md border border-gray-200 space-y-4">
          <div className="flex justify-between items-center border-b pb-3 flex-wrap gap-2">
            <div className="flex items-center gap-2 flex-1 min-w-[240px]">
              <span className="text-xl">👤</span>
              <input
                type="text"
                value={tlKetQuaHienTai.tenThuongLai}
                onChange={handleThongTinThuongLai("tenThuongLai")}
                placeholder="Nhập tên thương lái..."
                title="Bấm vào để đổi tên thương lái"
                className="text-xl font-black text-green-700 uppercase bg-green-50/50 hover:bg-green-50 border-b-2 border-dashed border-green-500 focus:border-green-700 focus:bg-white focus:outline-none px-2 py-1 rounded w-full max-w-sm transition-all"
              />
              <span className="text-xs text-gray-400 whitespace-nowrap">
                (Chạm để đổi tên)
              </span>
            </div>
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* ĐƠN GIÁ - TỰ ĐỘNG FORMAT HÀNG NGHÌN */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-gray-700 font-bold text-sm">
                  Đơn giá (đồng/kg):
                </label>
              </div>
              <input
                type="text"
                inputMode="numeric"
                value={tlKetQuaHienTai.donGia}
                onFocus={(e) => e.target.select()}
                onChange={handleTienChange("donGia")}
                onBlur={handleTienBlur("donGia")}
                placeholder="0"
                className="w-full p-3 border-2 border-gray-300 rounded-xl text-xl font-bold focus:border-green-500 focus:outline-none bg-white"
              />
            </div>

            {/* TRỪ BÌ (KG/BAO) */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-amber-700 font-bold text-sm">
                  Trừ bì (kg/bao):
                </label>
                <span className="text-xs font-semibold text-amber-700">
                  {parseFloat(String(tlKetQuaHienTai.truBi).replace(",", ".")) >
                  0
                    ? `Trừ ${tlKetQuaHienTai.truBi} kg/bao`
                    : "Không trừ bì"}
                </span>
              </div>
              <input
                type="text"
                inputMode="decimal"
                value={tlKetQuaHienTai.truBi}
                onFocus={(e) => e.target.select()}
                onChange={handleThongTinThuongLai("truBi")}
                onBlur={(e) => {
                  if (!e.target.value.trim()) {
                    const danhSachMoi = danhSachThuongLai.map((tl) => {
                      if (tl.id === thuongLaiDangChonId) {
                        return { ...tl, truBi: "0" };
                      }
                      return tl;
                    });
                    setDanhSachThuongLai(danhSachMoi);
                  }
                }}
                placeholder="0"
                className="w-full p-3 border-2 border-amber-200 bg-amber-50/50 rounded-xl text-xl font-bold focus:border-amber-500 focus:outline-none"
              />
            </div>

            {/* TIỀN CỌC TRƯỚC - TỰ ĐỘNG FORMAT HÀNG NGHÌN */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-blue-700 font-bold text-sm">
                  Tiền cọc trước (VNĐ):
                </label>
              </div>
              <input
                type="text"
                inputMode="numeric"
                value={tlKetQuaHienTai.tienCoc}
                onFocus={(e) => e.target.select()}
                onChange={handleTienChange("tienCoc")}
                onBlur={handleTienBlur("tienCoc")}
                placeholder="0"
                className="w-full p-3 border-2 border-blue-200 bg-blue-50/50 rounded-xl text-xl font-bold focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* PHẦN 3: DANH SÁCH CÁC GHE & BẢNG NHẬP LIỆU */}
        {tlKetQuaHienTai.danhSachGhe.map((ghe, gheIndex) => (
          <div
            key={ghe.id}
            className="bg-white rounded-2xl shadow-md border border-gray-200 p-3 md:p-5 space-y-3"
          >
            <div className="flex justify-between items-center border-b pb-2 flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <span className="text-lg">🚢</span>
                <input
                  type="text"
                  value={ghe.tenGhe}
                  onChange={(e) => handleDoiTenGhe(ghe.id, e.target.value)}
                  placeholder="Tên ghe..."
                  title="Chạm vào để sửa tên ghe"
                  className="text-lg font-black text-gray-800 uppercase bg-gray-50/60 hover:bg-gray-100 border-b border-dashed border-gray-400 focus:border-green-600 focus:bg-white focus:outline-none px-2 py-0.5 rounded transition-all max-w-[200px]"
                />
                <span className="text-xs text-gray-400">(Chạm đổi tên)</span>
              </div>
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
                  Nhập số Kg lúa (nhập dọc theo cột):
                </span>
                <span className="text-xs font-semibold bg-green-100 text-green-800 px-2.5 py-1 rounded-full">
                  Đã nhập: {ghe.soBaoGhe} / 25 bao
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse table-fixed">
                  <thead>
                    <tr className="bg-green-100 text-green-900 text-xs">
                      <th className="p-1.5 border border-green-200 w-1/5">
                        Cột 1
                      </th>
                      <th className="p-1.5 border border-green-200 w-1/5">
                        Cột 2
                      </th>
                      <th className="p-1.5 border border-green-200 w-1/5">
                        Cột 3
                      </th>
                      <th className="p-1.5 border border-green-200 w-1/5">
                        Cột 4
                      </th>
                      <th className="p-1.5 border border-green-200 w-1/5">
                        Cột 5
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {ghe.bangKg.map((hang, hangIndex) => (
                      <tr key={hangIndex}>
                        {hang.map((colVal, cotIndex) => (
                          <td
                            key={cotIndex}
                            className="p-0.5 border border-gray-200 bg-white"
                          >
                            <input
                              type="text"
                              inputMode="decimal"
                              enterKeyHint="next"
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
                              onFocus={(e) => {
                                e.target.select();
                                setTimeout(() => {
                                  e.target.scrollIntoView({
                                    behavior: "smooth",
                                    block: "center",
                                  });
                                }, 80);
                              }}
                              onChange={(e) =>
                                handleInputChange(
                                  ghe.id,
                                  gheIndex,
                                  hangIndex,
                                  cotIndex,
                                  e,
                                )
                              }
                              onKeyDown={(e) =>
                                handleKeyDown(gheIndex, hangIndex, cotIndex, e)
                              }
                              placeholder="0"
                              className="w-full py-2 px-0.5 text-center text-lg md:text-xl font-black border-2 border-gray-200 rounded-lg focus:border-green-500 focus:bg-green-50 focus:outline-none"
                            />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                  {/* TỔNG KẾT TỪNG CỘT (SUBTOTAL) */}
                  <tfoot>
                    <tr className="bg-green-50 font-bold border-t-2 border-green-300">
                      {ghe.tongTungCot.map((colTotal, cIdx) => (
                        <td
                          key={cIdx}
                          className="p-1 text-center border border-green-200"
                        >
                          <div className="text-green-900 font-extrabold text-sm md:text-base">
                            {colTotal.kg > 0 ? `${colTotal.kg}` : "0"}
                          </div>
                          <div className="text-[10px] text-gray-500 font-semibold">
                            {colTotal.soBao} bao
                          </div>
                        </td>
                      ))}
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            <div className="bg-gray-50 border border-gray-200 p-3 rounded-xl flex justify-between items-center font-bold text-gray-700 text-sm">
              <span>Khối lượng ghe này ({ghe.soBaoGhe} bao):</span>
              <span className="text-green-800 text-lg font-black">
                {ghe.tongKgGhe.toLocaleString("vi-VN")} kg
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

        {/* BẢNG TỔNG KẾT TIỀN CỦA THƯƠNG LÁI NÀY (CÓ TRỪ BÌ) */}
        <div className="bg-white border-2 border-green-400 p-5 rounded-2xl shadow-md space-y-4">
          <div className="border-b pb-2 flex justify-between items-center">
            <h3 className="font-black text-gray-800 uppercase text-base">
              📊 Tổng kết: {tlKetQuaHienTai.tenThuongLai}
            </h3>
            <span className="text-sm font-bold bg-green-100 text-green-800 px-3 py-1 rounded-full">
              {tlKetQuaHienTai.tongSoBaoTatCaGhe} bao lúa
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
            <div className="bg-gray-50 p-3 rounded-xl">
              <p className="text-xs text-gray-500 font-bold uppercase">
                Tổng kg cân
              </p>
              <p className="text-xl font-black text-gray-800 mt-1">
                {tlKetQuaHienTai.tongKgTatCaGhe.toLocaleString("vi-VN")} kg
              </p>
            </div>

            <div className="bg-amber-50 p-3 rounded-xl border border-amber-200">
              <p className="text-xs text-amber-700 font-bold uppercase">
                Trừ bì (
                {parseFloat(String(tlKetQuaHienTai.truBi).replace(",", ".")) ||
                  0}{" "}
                kg/bao)
              </p>
              <p className="text-xl font-black text-amber-800 mt-1">
                -{tlKetQuaHienTai.tongKgTruBi.toLocaleString("vi-VN")} kg
              </p>
            </div>

            <div className="bg-green-50 p-3 rounded-xl border border-green-200">
              <p className="text-xs text-green-700 font-bold uppercase">
                Kg thực tính
              </p>
              <p className="text-xl font-black text-green-800 mt-1">
                {tlKetQuaHienTai.tongKgThucTinh.toLocaleString("vi-VN")} kg
              </p>
            </div>

            <div className="bg-blue-50 p-3 rounded-xl border border-blue-200">
              <p className="text-xs text-blue-700 font-bold uppercase">
                Tổng tiền lúa
              </p>
              <p className="text-xl font-black text-blue-800 mt-1">
                {tlKetQuaHienTai.tongTienLua.toLocaleString("vi-VN")} đ
              </p>
            </div>
          </div>

          <div className="bg-green-50 border-2 border-green-500 p-4 rounded-xl flex flex-col sm:flex-row justify-between items-center gap-2">
            <div>
              <p className="text-gray-600 font-bold text-sm">
                Đã đặt cọc trước:
              </p>
              <p className="text-lg font-bold text-gray-700">
                {parseSoTien(tlKetQuaHienTai.tienCoc).toLocaleString("vi-VN")} đ
              </p>
            </div>
            <div className="text-center sm:text-right">
              <p className="text-gray-600 font-bold text-sm">
                {tlKetQuaHienTai.thanhTien >= 0
                  ? "👉 Thương lái cần thanh toán:"
                  : "👉 Dư tiền cọc (Cần thối lại):"}
              </p>
              <p
                className={`text-3xl font-black ${
                  tlKetQuaHienTai.thanhTien >= 0
                    ? "text-green-700"
                    : "text-amber-600"
                }`}
              >
                {Math.abs(tlKetQuaHienTai.thanhTien).toLocaleString("vi-VN")} đ
              </p>
            </div>
          </div>

          {/* NÚT SAO CHÉP PHIẾU GỬI ZALO */}
          <button
            onClick={handleSaoChepPhieuZalo}
            className="w-full py-3.5 bg-green-600 hover:bg-green-700 text-white font-extrabold text-base rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
          >
            📋 Sao chép phiếu tính tiền (Gửi Zalo)
          </button>
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
          <div className="text-right">
            <span className="text-xs bg-gray-800 text-gray-300 px-3 py-1.5 rounded-lg font-bold border border-gray-700">
              {ketQuaThuongLai.length} Thương lái
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
