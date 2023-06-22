function getElement(selector) {
  return document.querySelector(selector);
}

function getLocalStorage() {
  var data = localStorage.getItem("DSNV");
  if (data) {
    var parseData = JSON.parse(data);
    console.log(parseData);
    var arr = [];
    for (var i = 0; i < parseData.length; i++) {
      var nv = parseData[i];
      var nhanVien = new NhanVien(
        nv.taiKhoan,
        nv.tenNV,
        nv.email,
        nv.matKhau,
        nv.ngayLam,
        nv.luongCB,
        nv.chucVu,
        nv.gioLam
      );
      arr.push(nhanVien);
    }
    return arr;
  }
  return [];
}

function setLocalStorage(dsnv) {
  var data = JSON.stringify(dsnv.arrNV);
  localStorage.setItem("DSNV", data);
}

var dsnv = new DSNV();

dsnv.arrNV = getLocalStorage();

function renderDSNV(dsnv) {
  var content = "";
  for (var i = 0; i < dsnv.arrNV.length; i++) {
    var nv = dsnv.arrNV[i];
    content += `
      <tr>
        <td>${nv.taiKhoan}</td>
        <td>${nv.tenNV}</td>
        <td>${nv.email}</td>
        <td>${nv.ngayLam}</td>
        <td>${nv.chucVu}</td>
        <td>${tinhLuong(nv)}</td>
        <td>${xepLoaiNV(nv.gioLam)}</td>
        <td>
          <button class="btn btn-danger" onclick="xoaNV('${nv.taiKhoan}')">Xóa</button>
        </td>
      </tr>
    `;
  }
  getElement("#tableDanhSach").innerHTML = content;
}


function getThongTinNV(isEdit) {
  // Lấy thông tin từ user
  var taiKhoan = getElement("#tknv").value;
  var tenNV = getElement("#name").value;
  var email = getElement("#email").value;
  var password = getElement("#password").value;
  var ngayLam = getElement("#datepicker").value;
  var luongCB = getElement("#luongCB").value;
  var chucVu = getElement("#chucvu").value;
  var gioLam = getElement("#gioLam").value;

  var nhanVien = new NhanVien(
    taiKhoan,
    tenNV,
    email,
    password,
    ngayLam,
    parseFloat(luongCB),
    chucVu,
    parseFloat(gioLam)
  );
  console.log('nhanVien: ', nhanVien)

  var isValid = true

  // Kiểm tra tài khoản NV
  isValid &=
      kiemTraChuoi(
          nhanVien.taiKhoan,
          1,
          undefined,
          '#tbTKNV',
          'Tài khoản không được để trống'
      ) &&
      kiemTraChuoi(nhanVien.taiKhoan, 4, 6, '#tbTKNV', 'Tài khoản tối đa 4 - 6 ký số') &&
      kiemTraTKNV(nhanVien.taiKhoan, dsnv.arrNV, isEdit, '#tbTKNV', 'Tài khoản nhân viên đã tồn tại')

  // Kiểm tra tên sinh viên
  isValid &= kiemTraChuoi(
      nhanVien.tenNV,
      1,
      undefined,
      '#tbTen',
      'Tên nhan viên không được để trống'
  )
  //Kiểm tra email
  isValid &= kiemTraChuoi(
    nhanVien.email,
    1,
    undefined,
    '#tbEmail',
    'Email không được để trống'
  )&&
  kiemTraPattern(
    nhanVien.email,
    '#tbEmail',
    /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
    'Email không đúng định dạng'
    )
  // Kiểm tra mật khẩu
  isValid &=
      kiemTraChuoi(
          nhanVien.matKhau,
          1,
          undefined,
          '#tbMatKhau',
          'Mật khẩu không được để trống'
      ) &&
      kiemTraPattern (nhanVien.matKhau, '#tbMatKhau',/^(?=.*\d)(?=.*[A-Z])(?=.*\W)[a-zA-Z0-9\W]{6,10}$/, 'Mật Khẩu từ 6-10 ký tự (chứa ít nhất 1 ký tự số, 1 ký tự in hoa, 1 ký tự đặc biệt') &&
      kiemTraTKNV(nhanVien.matKhau, dsnv.arrNV, isEdit, '#tbMatKhau', 'Mật khẩu đã tồn tại')

      //Kiểm tra ngày
  isValid &= kiemTraChuoi(
    nhanVien.ngayLam,
    1,
    undefined,
    '#tbNgay',
    'Ngày làm không để trống'
     )&&
     kiemTraPattern(nhanVien.ngayLam, '#tbNgay', /^(0[1-9]|1[0-2])[-/](0[1-9]|[1-2][0-9]|3[0-1])[-/](19|20)\d{2}$/, 'Ngày làm không hợp lợi, được định dạng mm/dd/yyyy')

//Kiểm tra lương
   isValid &= kiemTraPattern
     (nhanVien.luongCB, '#tbLuongCB', /^(1[.]?\d{6}|[2-9][.]?\d{5}|20[.]?0{5})( VNĐ)?$/,'Lương cơ bản phải từ 1 000 000 - 20 000 000, không được để trống')

    //  //Kiểm tra chức vụ
   if (chucVu === "Sếp" || chucVu === "Trưởng phòng" || chucVu === "Nhân viên") {
    getElement("#tbChucVu").style.display="none"

  }else if (chucVu !== "Sếp" || chucVu !== "Trưởng phòng" || chucVu !== "Nhân viên" ) {
      getElement("#tbChucVu").innerHTML = 'Chức vụ phải chọn chức vụ hợp lệ (Giám đốc, Trưởng Phòng, Nhân Viên)'
      getElement("#tbChucVu").style.display="block"
  }

     //Kiểm tra giờ làm
     isValid &= kiemTraChuoi(
      nhanVien.ngayLam,
      1,
      undefined,
      '#tbGiolam',
      'Giờ làm không để trống'
       )&&
       kiemTraPattern(nhanVien.gioLam, '#tbGiolam', /^(8\d|9\d|1\d{2}|200)$/, ' Số giờ làm trong tháng phải từ 80 - 200 giờ,')



  return isValid ? nhanVien : undefined
}

//Thêm nhân viên mới vào danh sách
getElement("#btnThemNV").onclick = function () {

  var nhanVien = getThongTinNV(false)

  // Thêm nhân viên mới vào danh sách
  if (nhanVien) {
    dsnv.themNV(nhanVien);
    // Lưu danh sách nhân viên vào localStorage
    setLocalStorage(dsnv);
  }
  // Render danh sách nhân viên
  renderDSNV(dsnv);
}


function xoaNV(taiKhoan) {
  dsnv.xoaNV(taiKhoan);
  setLocalStorage(dsnv);
  renderDSNV(dsnv);
}

function tinhLuong(nhanVien) {
  var chucVu = nhanVien.chucVu;
  var luongCB = nhanVien.luongCB;
  var heSoChucVu = 0;
  switch (chucVu) {
    case "Sếp":
      heSoChucVu = 3;
      break;
    case "Trưởng phòng":
      heSoChucVu = 2;
      break;
    case "Nhân viên":
      heSoChucVu = 1;
      break;
  }
  var luong = luongCB * heSoChucVu;
  return luong;
}

function xepLoaiNV(gioLam) {
  var xepLoai = "";
  if (gioLam >= 192) {
    xepLoai = "Xuất sắc";
  } else if (gioLam >= 176) {
    xepLoai = "Giỏi";
  } else if (gioLam >= 160) {
    xepLoai = "Khá";
  } else {
    xepLoai = "Trung bình";
  }
  return xepLoai;
}

renderDSNV(dsnv);


getElement('#searchName').addEventListener('keyup', function(){

  var valueSearch =  getElement('#searchName').value.toLowerCase()
  var arrNVSearch = []
  for(var i = 0; i < dsnv.arrNV.length; i++){
      var tenNV = dsnv.arrNV[i].tenNV.toLowerCase()
      if(tenNV.indexOf(valueSearch) !== -1){
          arrNVSearch.push(dsnv.arrNV[i])
      }
  }
  renderDSNV(arrNVSearch)
})

