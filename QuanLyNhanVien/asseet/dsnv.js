function DSNV() {
    this.arrNV = [];
  
    this.themNV = function (nhanVien) {
      this.arrNV.push(nhanVien);
    };
  
    this.xoaNV = function (taiKhoan) {
      this.arrNV = this.arrNV.filter(function (nv) {
        return nv.taiKhoan !== taiKhoan;
      });
    };
  
    this.timNV = function (maNhanVien) {
        for (var i = 0; i < this.arrNV.length; i++) {
            var maSV = this.arrNV[i].tenNV
            if (maSV === maNhanVien) {
                return i
            }
        }

        return -1
    }
  
    this.capNhatNV = function (nhanVien) {
        var index = this.timNV(nhanVien.taiKhoan)
        if (index !== -1) {
            this.arrNV[index] = nhanVien
        }
    }
  }

