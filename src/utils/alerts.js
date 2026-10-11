import Swal from 'sweetalert2';

const BRAND_COLOR = '#FFCE1B';

const baseConfig = {
  confirmButtonColor: BRAND_COLOR,
  customClass: {
    confirmButton: 'swal-btn-confirm',
  },
};

export function showSuccess(title, text) {
  return Swal.fire({
    ...baseConfig,
    icon: 'success',
    title,
    text,
  });
}

export function showError(title, text) {
  return Swal.fire({
    ...baseConfig,
    icon: 'error',
    title,
    text,
  });
}

export function showInfo(title, text) {
  return Swal.fire({
    ...baseConfig,
    icon: 'info',
    title,
    text,
  });
}

export function showWarning(title, text) {
  return Swal.fire({
    ...baseConfig,
    icon: 'warning',
    title,
    text,
  });
}

export function showConfirm(title, text, confirmText = 'Confirm') {
  return Swal.fire({
    ...baseConfig,
    icon: 'warning',
    title,
    text,
    showCancelButton: true,
    cancelButtonColor: '#6b7280',
    confirmButtonText: confirmText,
    cancelButtonText: 'Cancel',
  });
}

export function showLoading(title, text) {
  return Swal.fire({
    ...baseConfig,
    title,
    text,
    allowOutsideClick: false,
    allowEscapeKey: false,
    showConfirmButton: false,
    didOpen: () => {
      Swal.showLoading();
    },
  });
}

export function closeAlert() {
  Swal.close();
}
