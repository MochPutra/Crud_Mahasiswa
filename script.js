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

// ========== Jurusan Quick-Select ==========
function pilihJurusan(btn, jurusan) {
    const input = document.getElementById('jurusan');
    if (!input) return;

    // Toggle: if already selected, deselect
    if (btn.classList.contains('active')) {
        btn.classList.remove('active');
        input.value = '';
        input.focus();
        return;
    }

    // Remove active from all chips
    document.querySelectorAll('.jurusan-chip').forEach(c => c.classList.remove('active'));

    // Set value and highlight chip
    input.value = jurusan;
    btn.classList.add('active');

    // Brief visual feedback on input
    input.style.borderColor = 'rgba(44, 182, 125, 0.5)';
    input.style.boxShadow = '0 0 0 3px rgba(44, 182, 125, 0.15)';
    setTimeout(() => {
        input.style.borderColor = '';
        input.style.boxShadow = '';
    }, 600);
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

    // ========== Auto-highlight jurusan chip on edit ==========
    const jurusanInput = document.getElementById('jurusan');
    if (jurusanInput && jurusanInput.value) {
        document.querySelectorAll('.jurusan-chip').forEach(chip => {
            // Extract jurusan text (skip emoji)
            const chipText = chip.textContent.replace(/^[\s\S]?\s/, '').trim();
            if (chipText === jurusanInput.value.trim()) {
                chip.classList.add('active');
            }
        });
    }
});

// ========== Filter & Sort State ==========
let currentSort = { field: null, direction: null }; // field: 'nim'|'nama', direction: 'asc'|'desc'|null

// Column indices in the table
const COL_NO = 0;
const COL_FOTO = 1;
const COL_NIM = 2;
const COL_NAMA = 3;
const COL_JURUSAN = 4;
const COL_AKSI = 5;

// ========== Toggle Sort ==========
function toggleSort(field) {
    if (currentSort.field === field) {
        // Cycle: asc -> desc -> none
        if (currentSort.direction === 'asc') {
            currentSort.direction = 'desc';
        } else if (currentSort.direction === 'desc') {
            currentSort.field = null;
            currentSort.direction = null;
        }
    } else {
        currentSort.field = field;
        currentSort.direction = 'asc';
    }
    updateSortUI();
    applyFilters();
}

// ========== Update Sort Button UI ==========
function updateSortUI() {
    const nimArrow = document.getElementById('sortNimArrow');
    const namaArrow = document.getElementById('sortNamaArrow');
    const nimBtn = document.getElementById('sortNim');
    const namaBtn = document.getElementById('sortNama');

    // Reset all
    if (nimArrow) nimArrow.textContent = '';
    if (namaArrow) namaArrow.textContent = '';
    if (nimBtn) nimBtn.classList.remove('active');
    if (namaBtn) namaBtn.classList.remove('active');

    // Set active
    if (currentSort.field === 'nim' && currentSort.direction) {
        if (nimArrow) nimArrow.textContent = currentSort.direction === 'asc' ? '↑' : '↓';
        if (nimBtn) nimBtn.classList.add('active');
    } else if (currentSort.field === 'nama' && currentSort.direction) {
        if (namaArrow) namaArrow.textContent = currentSort.direction === 'asc' ? '↑' : '↓';
        if (namaBtn) namaBtn.classList.add('active');
    }
}

// ========== Apply All Filters ==========
function applyFilters() {
    const table = document.getElementById('dataTable');
    if (!table) return;

    const tbody = table.getElementsByTagName('tbody')[0];
    const rows = Array.from(tbody.getElementsByTagName('tr'));

    // Skip if only empty-state row
    if (rows.length === 1 && rows[0].querySelector('.empty-state')) return;

    // Get filter values
    const searchInput = document.getElementById('searchInput');
    const jurusanSelect = document.getElementById('filterJurusan');
    const searchText = searchInput ? searchInput.value.toLowerCase() : '';
    const jurusanFilter = jurusanSelect ? jurusanSelect.value : '';

    // 1. Sort rows if needed
    if (currentSort.field && currentSort.direction) {
        const colIndex = currentSort.field === 'nim' ? COL_NIM : COL_NAMA;
        rows.sort((a, b) => {
            const aText = a.getElementsByTagName('td')[colIndex]?.textContent.trim().toLowerCase() || '';
            const bText = b.getElementsByTagName('td')[colIndex]?.textContent.trim().toLowerCase() || '';
            
            let comparison;
            if (currentSort.field === 'nim') {
                // Try numeric comparison for NIM
                const aNum = parseInt(aText, 10);
                const bNum = parseInt(bText, 10);
                if (!isNaN(aNum) && !isNaN(bNum)) {
                    comparison = aNum - bNum;
                } else {
                    comparison = aText.localeCompare(bText);
                }
            } else {
                comparison = aText.localeCompare(bText, 'id');
            }
            
            return currentSort.direction === 'desc' ? -comparison : comparison;
        });

        // Re-append sorted rows
        rows.forEach(row => tbody.appendChild(row));
    }

    // 2. Apply search + jurusan filter (visibility)
    let visibleNo = 1;
    rows.forEach(row => {
        const cells = row.getElementsByTagName('td');
        if (cells.length === 0) return;

        // Jurusan filter
        const rowJurusan = cells[COL_JURUSAN]?.textContent.trim() || '';
        const matchJurusan = !jurusanFilter || rowJurusan === jurusanFilter;

        // Search filter (search across NIM, Nama, Jurusan)
        let matchSearch = true;
        if (searchText) {
            matchSearch = false;
            for (let j = 0; j < cells.length; j++) {
                if (cells[j].textContent.toLowerCase().includes(searchText)) {
                    matchSearch = true;
                    break;
                }
            }
        }

        const isVisible = matchJurusan && matchSearch;
        row.style.display = isVisible ? '' : 'none';

        // Re-number visible rows
        if (isVisible && cells[COL_NO]) {
            cells[COL_NO].textContent = visibleNo++;
        }
    });
}

// ========== Reset All Filters ==========
function resetFilters() {
    // Reset search
    const searchInput = document.getElementById('searchInput');
    if (searchInput) searchInput.value = '';

    // Reset jurusan
    const jurusanSelect = document.getElementById('filterJurusan');
    if (jurusanSelect) jurusanSelect.value = '';

    // Reset sort
    currentSort = { field: null, direction: null };
    updateSortUI();

    // Re-apply (shows all rows, original order)
    // Reload page to get original order since DOM sort is destructive
    window.location.reload();
}