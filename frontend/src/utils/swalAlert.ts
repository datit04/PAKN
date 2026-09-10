import Swal from 'sweetalert2';

export const showSuccessAlert = (title: string, text?: string) =>
  Swal.fire({
    icon: 'success',
    title,
    text,
    confirmButtonText: 'Đóng',
    confirmButtonColor: '#b91c1c'
  });

export const showErrorAlert = (title: string, text?: string) =>
  Swal.fire({
    icon: 'error',
    title,
    text,
    confirmButtonText: 'Đóng',
    confirmButtonColor: '#b91c1c'
  });

export const showInfoAlert = (title: string, text?: string) =>
  Swal.fire({
    icon: 'info',
    title,
    text,
    confirmButtonText: 'Đóng',
    confirmButtonColor: '#b91c1c'
  });

const showToast = (icon: 'success' | 'error' | 'info', title: string) => {
  const isSuccess = icon === 'success';

  return Swal.fire({
    toast: true,
    position: 'top-end',
    icon,
    title,
    ...(isSuccess && {
      background: '#16a34a',
      color: '#ffffff',
      iconColor: '#ffffff'
    }),
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true
  });
};

export const showSuccessToast = (title: string) => showToast('success', title);

export const showErrorToast = (title: string) => showToast('error', title);

export const showInfoToast = (title: string) => showToast('info', title);

export const showPaknSuccessAlert = () =>
  showSuccessToast('Gửi phản ánh kiến nghị thành công!');
