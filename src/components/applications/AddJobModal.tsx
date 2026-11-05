import { CirclePlus } from "lucide-react";

function toggleModal() {
  const modal = document.getElementById("AddJobModal");

  if (modal instanceof HTMLDialogElement) {
    modal.showModal();
  }
}

export default function AddJobModal() {
  return (
    <>
      {/* Open the modal using document.getElementById('ID').showModal() method */}
      <button
        className="btn btn-soft btn-primary"
        onClick={() => toggleModal()}
      >
        <CirclePlus size={24} />
        Add Application
      </button>
      <dialog id="AddJobModal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Hello!</h3>
          <p className="py-4">
            Press ESC key or click the button below to close
          </p>
          <div className="modal-action">
            <form method="dialog">
              {/* if there is a button in form, it will close the modal */}
              <button className="btn">Close</button>
            </form>
          </div>
        </div>
      </dialog>
    </>
  );
}
