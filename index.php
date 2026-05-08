<?php
session_start();
include 'koneksi.php';

// Count total students
$count_query = mysqli_query($conn, "SELECT COUNT(*) as total FROM mahasiswa");
$total_data = mysqli_fetch_assoc($count_query)['total'];

// Count unique jurusan
$jurusan_query = mysqli_query($conn, "SELECT COUNT(DISTINCT jurusan) as total FROM mahasiswa");
$total_jurusan = mysqli_fetch_assoc($jurusan_query)['total'];

// Get distinct jurusan list for filter
$jurusan_list_query = mysqli_query($conn, "SELECT DISTINCT jurusan FROM mahasiswa ORDER BY jurusan ASC");
$jurusan_list = [];
while ($j = mysqli_fetch_assoc($jurusan_list_query)) {
    $jurusan_list[] = $j['jurusan'];
}
?>
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CRUD Data Mahasiswa</title>
    <meta name="description" content="Sistem manajemen data mahasiswa - tambah, edit, dan hapus data mahasiswa dengan mudah">
    <link rel="stylesheet" href="style.css">
    <script src="script.js" defer></script>
</head>
<body>

<!-- Toast Notification -->
<?php if (isset($_SESSION['pesan'])): ?>
    <div class="toast" id="toast-notification">
        <span class="toast-icon">✅</span>
        <?= htmlspecialchars($_SESSION['pesan']); ?>
    </div>
    <?php unset($_SESSION['pesan']); ?>
<?php endif; ?>

<!-- Delete Confirmation Modal (hidden by default) -->
<div class="modal-overlay" id="deleteModal" style="display:none;">
    <div class="modal">
        <div class="modal-icon">⚠️</div>
        <h3>Hapus Data Mahasiswa?</h3>
        <p>Data yang sudah dihapus tidak dapat dikembalikan. Apakah Anda yakin ingin melanjutkan?</p>
        <div class="modal-buttons">
            <button class="btn btn-modal-cancel" onclick="closeDeleteModal()">Batal</button>
            <a href="#" class="btn btn-modal-delete" id="deleteLink">Ya, Hapus</a>
        </div>
    </div>
</div>

<div class="container">
    <!-- Page Header -->
    <div class="page-header">
        <h1>📚 Data Mahasiswa</h1>
        <p class="subtitle">Sistem Informasi Manajemen Data Mahasiswa</p>
    </div>

    <!-- Stats Bar -->
    <div class="stats-bar">
        <div class="stat-item">
            <div class="stat-icon purple">👤</div>
            <div class="stat-info">
                <div class="stat-value"><?= $total_data; ?></div>
                <div class="stat-label">Total Mahasiswa</div>
            </div>
        </div>
        <div class="stat-item">
            <div class="stat-icon green">🎓</div>
            <div class="stat-info">
                <div class="stat-value"><?= $total_jurusan; ?></div>
                <div class="stat-label">Jurusan</div>
            </div>
        </div>
        <div class="stat-item">
            <div class="stat-icon blue">📊</div>
            <div class="stat-info">
                <div class="stat-value">Aktif</div>
                <div class="stat-label">Status Sistem</div>
            </div>
        </div>
    </div>

    <!-- Main Card -->
    <div class="card">
        <!-- Toolbar -->
        <div class="toolbar">
            <div class="search-box">
                <span class="search-icon">🔍</span>
                <input type="text" id="searchInput" placeholder="Cari mahasiswa..." onkeyup="applyFilters()">
            </div>
            <a href="form.php" class="btn btn-primary" id="btn-tambah-data">
                <span>＋</span> Tambah Data
            </a>
        </div>

        <!-- Filter Bar -->
        <div class="filter-bar">
            <div class="filter-group">
                <label class="filter-label">Urutkan</label>
                <div class="filter-controls">
                    <button class="filter-chip" id="sortNim" onclick="toggleSort('nim')" title="Urutkan berdasarkan NIM">
                        <span class="filter-chip-icon">🔢</span> NIM <span class="sort-arrow" id="sortNimArrow"></span>
                    </button>
                    <button class="filter-chip" id="sortNama" onclick="toggleSort('nama')" title="Urutkan berdasarkan Nama">
                        <span class="filter-chip-icon">🔤</span> Nama <span class="sort-arrow" id="sortNamaArrow"></span>
                    </button>
                </div>
            </div>
            <div class="filter-group">
                <label class="filter-label">Jurusan</label>
                <div class="filter-controls">
                    <select class="filter-select" id="filterJurusan" onchange="applyFilters()">
                        <option value="">Semua Jurusan</option>
                        <?php foreach ($jurusan_list as $jrs): ?>
                            <option value="<?= htmlspecialchars($jrs); ?>"><?= htmlspecialchars($jrs); ?></option>
                        <?php endforeach; ?>
                    </select>
                </div>
            </div>
            <button class="filter-reset" id="resetFilters" onclick="resetFilters()" title="Reset semua filter">
                ✕ Reset
            </button>
        </div>

        <!-- Table -->
        <div class="table-wrapper">
            <table id="dataTable">
                <thead>
                    <tr>
                        <th>No</th>
                        <th>Foto</th>
                        <th>NIM</th>
                        <th>Nama Lengkap</th>
                        <th>Jurusan</th>
                        <th>Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    <?php
                    $query = mysqli_query($conn, "SELECT * FROM mahasiswa ORDER BY id DESC");
                    $no = 1;
                    if (mysqli_num_rows($query) > 0):
                        while ($row = mysqli_fetch_assoc($query)):
                    ?>
                    <tr>
                        <td><?= $no++; ?></td>
                        <td>
                            <img src="uploads/<?= htmlspecialchars($row['foto']); ?>" 
                                 class="student-photo" 
                                 alt="Foto <?= htmlspecialchars($row['nama']); ?>"
                                 onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2248%22 height=%2248%22 viewBox=%220 0 48 48%22><rect fill=%22%231a1a2e%22 width=%2248%22 height=%2248%22 rx=%228%22/><text x=%2224%22 y=%2230%22 text-anchor=%22middle%22 fill=%22%236b6d7b%22 font-size=%2218%22>👤</text></svg>'">
                        </td>
                        <td><span class="student-nim"><?= htmlspecialchars($row['nim']); ?></span></td>
                        <td><span class="student-name"><?= htmlspecialchars($row['nama']); ?></span></td>
                        <td><span class="badge-jurusan"><?= htmlspecialchars($row['jurusan']); ?></span></td>
                        <td>
                            <div class="action-buttons">
                                <a href="form.php?id=<?= $row['id']; ?>" class="btn btn-edit" id="btn-edit-<?= $row['id']; ?>">✏️ Edit</a>
                                <button class="btn btn-hapus" onclick="openDeleteModal('proses.php?aksi=hapus&id=<?= $row['id']; ?>')" id="btn-hapus-<?= $row['id']; ?>">🗑️ Hapus</button>
                            </div>
                        </td>
                    </tr>
                    <?php 
                        endwhile;
                    else: 
                    ?>
                    <tr>
                        <td colspan="6">
                            <div class="empty-state">
                                <div class="empty-icon">📭</div>
                                <h3>Belum Ada Data</h3>
                                <p>Mulai tambahkan data mahasiswa dengan klik tombol "Tambah Data" di atas.</p>
                            </div>
                        </td>
                    </tr>
                    <?php endif; ?>
                </tbody>
            </table>
        </div>
    </div>
</div>

</body>
</html>