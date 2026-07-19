"use client";

import { Product } from "@/app/items/manage/page";
import { fetchWithAuth } from "@/lib/api-helper";
import { AlertDialog, Button } from "@heroui/react";
import { FiTrash2 } from "react-icons/fi";
import { toast } from "react-toastify";

interface DeleteModalProps {
  item: Product;
  onDeleted: () => void;
}

export function DeleteModal({ item, onDeleted }: DeleteModalProps) {
  const handleDelete = async (id: string, name: string) => {
    try {
      const backendUrl =
        process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";
      const res = await fetchWithAuth(`${backendUrl}/api/products/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        toast.success(`"${name}" deleted successfully.`);
        // Reload list
        onDeleted();
      } else {
        const errData = await res.json();
        toast.error(errData.error || "Failed to remove item.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Network communication error during deletion.");
    }
  };

  return (
    <AlertDialog>
      <AlertDialog.Trigger
        slot="trigger"
        className="p-2 border border-white/10 hover:border-red-500/40 hover:bg-red-950/10 text-slate-400 hover:text-red-400 rounded-lg transition-all cursor-pointer"
        title="Delete Item"
      >
        <FiTrash2 size={15} />
      </AlertDialog.Trigger>
      <AlertDialog.Backdrop>
        <AlertDialog.Container>
          <AlertDialog.Dialog className="sm:max-w-100 bg-[#090d16]">
            <AlertDialog.CloseTrigger />
            <AlertDialog.Header>
              <AlertDialog.Icon status="danger" />
              <AlertDialog.Heading>
                Delete item permanently?
              </AlertDialog.Heading>
            </AlertDialog.Header>
            <AlertDialog.Body>
              <p>
                This will permanently delete <strong>{item.title}</strong> and
                all of its data. This action cannot be undone.
              </p>
            </AlertDialog.Body>
            <AlertDialog.Footer>
              <Button className="text-black" slot="close" variant="tertiary">
                Cancel
              </Button>
              <Button
                onClick={() => handleDelete(item._id, item.title)}
                slot="close"
                variant="danger"
              >
                Delete Item
              </Button>
            </AlertDialog.Footer>
          </AlertDialog.Dialog>
        </AlertDialog.Container>
      </AlertDialog.Backdrop>
    </AlertDialog>
  );
}
