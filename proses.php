<?php
session_start();
include 'koneksi.php';

// Menangani Tambah dan Edit
if (isset($_POST['aksi'])) {
    $aksi = $_POST['aksi'];
    $nim = $_POST['nim'];
    $nama = $_POST['nama'];
    $jurusan = $_POST['jurusan'];
    
    $foto_nama = $_FILES['foto']['name'];
    $foto_tmp = $_FILES['foto']['tmp_name'];
    $foto_error = $_FILES['foto']['error'];
    
    $nama_file_baru = "";

    if ($aksi == 'tambah' || ($aksi == 'edit' && $foto_error == 0)) {
        // Logika Upload
        $ekstensi_diperbolehkan = ['jpg', 'jpeg', 'png'];
        $x = explode('.', $foto_nama);
        $ekstensi = strtolower(end($x));
        $ukuran = $_FILES['foto']['size'];
        
        if (in_array($ekstensi, $ekstensi_diperbolehkan) === true) {
            if ($ukuran <= 2097152) { // 2MB
                $nama_file_baru = uniqid() . '.' . $ekstensi; // Rename menggunakan uniqid()
                move_uploaded_file($foto_tmp, 'uploads/' . $nama_file_baru);
            } else {
                $_SESSION['pesan'] = "Ukuran file terlalu besar!";
                header("Location: index.php");
                exit;
            }
        } else {
            $_SESSION['pesan'] = "Ekstensi file tidak diperbolehkan!";
            header("Location: index.php");
            exit;
        }
    }

    if ($aksi == 'tambah') {
        $query = "INSERT INTO mahasiswa (nim, nama, jurusan, foto) VALUES ('$nim', '$nama', '$jurusan', '$nama_file_baru')";
        mysqli_query($conn, $query);
        $_SESSION['pesan'] = "Data berhasil ditambahkan!";
    } elseif ($aksi == 'edit') {
        $id = $_POST['id'];
        if ($foto_error == 0) {
            // Hapus foto lama jika upload foto baru
            $foto_lama = $_POST['foto_lama'];
            if(file_exists("uploads/".$foto_lama)) unlink("uploads/".$foto_lama);
            
            $query = "UPDATE mahasiswa SET nim='$nim', nama='$nama', jurusan='$jurusan', foto='$nama_file_baru' WHERE id='$id'";
        } else {
            // Update tanpa mengganti foto
            $query = "UPDATE mahasiswa SET nim='$nim', nama='$nama', jurusan='$jurusan' WHERE id='$id'";
        }
        mysqli_query($conn, $query);
        $_SESSION['pesan'] = "Data berhasil diubah!";
    }
    header("Location: index.php");
    exit;
}

// Menangani Hapus
if (isset($_GET['aksi']) && $_GET['aksi'] == 'hapus') {
    $id = $_GET['id'];
    $get_foto = mysqli_query($conn, "SELECT foto FROM mahasiswa WHERE id='$id'");
    $data_foto = mysqli_fetch_assoc($get_foto);
    
    // Hapus file fisik
    if (file_exists("uploads/" . $data_foto['foto'])) {
        unlink("uploads/" . $data_foto['foto']);
    }
    
    mysqli_query($conn, "DELETE FROM mahasiswa WHERE id='$id'");
    $_SESSION['pesan'] = "Data berhasil dihapus!";
    header("Location: index.php");
    exit;
}
?>