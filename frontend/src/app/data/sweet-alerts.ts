import Swal from 'sweetalert2';


export async function successSweetAlert(title: string): Promise<void> {
  await Swal.fire({
    position: "top-right",
    icon: "success",
    title: title,
    showConfirmButton: false,
    timer: 1500
  });
}


export async function errorSweetAlert(title: string, timer?: number): Promise<void> {
  await Swal.fire({
    position: "top-right",
    icon: "error",
    title: title,
    showConfirmButton: false,
    timer: timer ?? 1500
  });
}
