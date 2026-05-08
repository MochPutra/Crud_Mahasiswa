<?php
include 'koneksi.php';

$id = ''; $nim = ''; $nama = ''; $jurusan = ''; $foto = '';
$mode = 'tambah';

if (isset($_GET['id'])) {
    $id = $_GET['id'];
    $query = mysqli_query($conn, "SELECT * FROM mahasiswa WHERE id = '$id'");
    if (mysqli_num_rows($query) > 0) {
        $data = mysqli_fetch_assoc($query);
        $nim = $data['nim'];
        $nama = $data['nama'];
        $jurusan = $data['jurusan'];
        $foto = $data['foto'];
        $mode = 'edit';
    }
}
?>
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?= $mode == 'edit' ? 'Edit' : 'Tambah'; ?> Data Mahasiswa</title>
    <meta name="description" content="<?= $mode == 'edit' ? 'Edit' : 'Tambah'; ?> data mahasiswa ke dalam sistem">
    <link rel="stylesheet" href="style.css">
    <script src="script.js" defer></script>
</head>
<body>

<div class="form-container">
    <div class="card">
        <!-- Form Header -->
        <div class="form-header">
            <a href="index.php" class="back-link" id="btn-back" title="Kembali">←</a>
            <div class="form-title">
                <h1><?= $mode == 'edit' ? '✏️ Edit' : '➕ Tambah'; ?> Data</h1>
                <p><?= $mode == 'edit' ? 'Perbarui informasi mahasiswa' : 'Masukkan informasi mahasiswa baru'; ?></p>
            </div>
        </div>

        <form action="proses.php" method="POST" enctype="multipart/form-data" onsubmit="return validasiForm();" id="formMahasiswa">
            <input type="hidden" name="aksi" id="aksi" value="<?= $mode; ?>">
            <input type="hidden" name="id" value="<?= $id; ?>">
            <input type="hidden" name="foto_lama" value="<?= $foto; ?>">

            <div class="form-group">
                <label for="nim">NIM</label>
                <input type="text" name="nim" id="nim" value="<?= htmlspecialchars($nim); ?>" placeholder="Masukkan Nomor Induk Mahasiswa">
            </div>

            <div class="form-group">
                <label for="nama">Nama Lengkap</label>
                <input type="text" name="nama" id="nama" value="<?= htmlspecialchars($nama); ?>" placeholder="Masukkan nama lengkap mahasiswa">
            </div>

            <div class="form-group">
                <label for="jurusan">Jurusan</label>
                <input type="text" name="jurusan" id="jurusan" value="<?= htmlspecialchars($jurusan); ?>" placeholder="Masukkan jurusan mahasiswa">
            </div>

            <div class="form-group">
                <label>Foto Profil</label>
                
                <?php if($mode == 'edit' && !empty($foto)): ?>
                <div class="current-photo">
                    <img src="uploads/<?= htmlspecialchars($foto); ?>" alt="Foto saat ini"
                         onerror="this.parentElement.style.display='none'">
                    <div class="photo-info">
                        <strong>Foto Saat Ini</strong>
                        Biarkan kosong jika tidak ingin mengubah foto
                    </div>
                </div>
                <?php endif; ?>

                <div class="file-upload-area" id="uploadArea">
                    <div class="upload-icon">📸</div>
                    <div class="upload-text">
                        Drag & drop atau <span>pilih file</span>
                    </div>
                    <div class="upload-hint">JPG, JPEG, atau PNG • Maks 2MB</div>
                    <input type="file" name="foto" id="foto" accept=".jpg,.jpeg,.png">
                    <div class="file-upload-preview" id="uploadPreview">
                        <img src="" alt="Preview" id="previewImage">
                        <div class="file-name" id="fileName"></div>
                    </div>
                </div>
            </div>

            <button type="submit" class="btn btn-simpan" id="btn-simpan">
                <?= $mode == 'edit' ? '💾 Simpan Perubahan' : '✨ Simpan Data'; ?>
            </button>
            <a href="index.php" class="btn btn-secondary" id="btn-batal">Batal</a>
        </form>
    </div>
</div>

</body>
</html>