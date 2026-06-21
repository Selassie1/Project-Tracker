"use client";

export function DeleteButton({ label = "Delete" }: { label?: string }) {
  return (
    <button
      type="submit"
      className="btn-danger"
      onClick={(e) => {
        if (!confirm("Delete this item? This can't be undone.")) {
          e.preventDefault();
        }
      }}
    >
      {label}
    </button>
  );
}
