// ========== Form Validation ==========
function validasiForm() {
    let nim = document.getElementById("nim").value;
    let nama = document.getElementById("nama").value;
    let jurusan = document.getElementById("jurusan").value;
    let foto = document.getElementById("foto");
    let aksi = document.getElementById("aksi").value;

    if (nim.trim() === "" || nama.trim() === "" || jurusan.trim() === "") {
        showInlineError("Semua field teks harus diisi!");
        return false;
    }

    // Jika mode tambah, foto wajib diisi
    if (aksi === 'tambah' && foto.files.length === 0) {
        showInlineError("Foto profil wajib diunggah!");
        return false;
    }

    // Validasi file jika ada yang diunggah
    if (foto.files.length > 0) {
        let file = foto.files[0];
        let tipe = file.type;
        let ukuran = file.size;

        if (tipe !== 'image/jpeg' && tipe !== 'image/png' && tipe !== 'image/jpg') {
            showInlineError("Format foto harus JPG, JPEG, atau PNG!");
            return false;
        }

        if (ukuran > 2 * 1024 * 1024) {
            showInlineError("Ukuran foto tidak boleh lebih dari 2 MB!");
            return false;
        }
    }

    // Add loading state to button
    const btn = document.getElementById("btn-simpan");
    if (btn) {
        btn.textContent = "⏳ Menyimpan...";
        btn.style.opacity = "0.7";
        btn.style.pointerEvents = "none";
    }

    return true;
}

// Show inline error (uses alert as fallback since we don't have inline error UI)
function showInlineError(message) {
    // Remove existing error
    const existing = document.querySelector('.form-error-toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = 'form-error-toast';
    toast.innerHTML = `<span>⚠️</span> ${message}`;
    toast.style.cssText = `
        position: fixed;
        top: 24px;
        right: 24px;
        z-index: 1000;
        padding: 16px 24px;
        background: rgba(229, 49, 112, 0.15);
        backdrop-filter: blur(20px);
        -webkit-backdrop-filter: blur(20px);
        border: 1px solid rgba(229, 49, 112, 0.25);
        border-radius: 12px;
        color: #e53170;
        font-family: 'Inter', sans-serif;
        font-size: 0.9rem;
        font-weight: 500;
        display: flex;
        align-items: center;
        gap: 10px;
        box-shadow: 0 8px 40px rgba(0, 0, 0, 0.4);
        animation: toastIn 0.5s cubic-bezier(0.4, 0, 0.2, 1) both;
    `;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.animation = 'toastOut 0.4s cubic-bezier(0.4, 0, 0.2, 1) both';
        setTimeout(() => toast.remove(), 400);
    }, 3500);
}

// ========== Delete Confirmation Modal ==========
function openDeleteModal(deleteUrl) {
    const modal = document.getElementById('deleteModal');
    const deleteLink = document.getElementById('deleteLink');
    if (modal && deleteLink) {
        deleteLink.href = deleteUrl;
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
}

function closeDeleteModal() {
    const modal = document.getElementById('deleteModal');
    if (modal) {
        modal.classList.add('closing');
        setTimeout(() => {
            modal.style.display = 'none';
            modal.classList.remove('closing');
            document.body.style.overflow = '';
        }, 200);
    }
}

// Close modal on outside click
document.addEventListener('click', function(e) {
    const modal = document.getElementById('deleteModal');
    if (modal && e.target === modal) {
        closeDeleteModal();
    }
});

// Close modal on Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeDeleteModal();
    }
});

// Legacy function - kept for backward compatibility
function konfirmasiHapus() {
    return confirm("Apakah Anda yakin ingin menghapus data ini?");
}

// ========== Toast Auto-dismiss ==========
document.addEventListener('DOMContentLoaded', function() {
    const toast = document.getElementById('toast-notification');
    if (toast) {
        setTimeout(() => {
            toast.classList.add('toast-out');
            setTimeout(() => toast.remove(), 400);
        }, 4000);
    }

    // ========== File Upload Preview ==========
    const fileInput = document.getElementById('foto');
    const uploadArea = document.getElementById('uploadArea');
    const uploadPreview = document.getElementById('uploadPreview');
    const previewImage = document.getElementById('previewImage');
    const fileName = document.getElementById('fileName');

    if (fileInput && uploadArea) {
        fileInput.addEventListener('change', function() {
            if (this.files && this.files[0]) {
                const file = this.files[0];
                const reader = new FileReader();
                
                reader.onload = function(e) {
                    if (previewImage) previewImage.src = e.target.result;
                    if (fileName) fileName.textContent = file.name;
                    if (uploadPreview) uploadPreview.style.display = 'block';
                    
                    // Hide the upload text
                    const uploadIcon = uploadArea.querySelector('.upload-icon');
                    const uploadText = uploadArea.querySelector('.upload-text');
                    const uploadHint = uploadArea.querySelector('.upload-hint');
                    if (uploadIcon) uploadIcon.style.display = 'none';
                    if (uploadText) uploadText.style.display = 'none';
                    if (uploadHint) uploadHint.style.display = 'none';
                };
                
                reader.readAsDataURL(file);
            }
        });

        // Drag and drop visual feedback
        ['dragenter', 'dragover'].forEach(eventName => {
            uploadArea.addEventListener(eventName, function(e) {
                e.preventDefault();
                this.classList.add('drag-over');
            });
        });

        ['dragleave', 'drop'].forEach(eventName => {
            uploadArea.addEventListener(eventName, function(e) {
                e.preventDefault();
                this.classList.remove('drag-over');
            });
        });
    }

    // ========== Table Search ==========
    // (initialized on DOMContentLoaded)
});

// ========== Search Table ==========
function searchTable() {
    const input = document.getElementById('searchInput');
    if (!input) return;
    
    const filter = input.value.toLowerCase();
    const table = document.getElementById('dataTable');
    if (!table) return;
    
    const rows = table.getElementsByTagName('tbody')[0].getElementsByTagName('tr');
    
    for (let i = 0; i < rows.length; i++) {
        const cells = rows[i].getElementsByTagName('td');
        let match = false;
        
        for (let j = 0; j < cells.length; j++) {
            if (cells[j].textContent.toLowerCase().includes(filter)) {
                match = true;
                break;
            }
        }
        
        rows[i].style.display = match ? '' : 'none';
    }
}