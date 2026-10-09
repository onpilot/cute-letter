import * as AlertDialog from "@radix-ui/react-alert-dialog";

/** "close letter" button that asks for confirmation first. */
export default function ConfirmClose({ onConfirm }: { onConfirm: () => void }) {
  return (
    <AlertDialog.Root>
      <AlertDialog.Trigger className="rounded-full bg-blue-deep px-5 py-2.5 text-white shadow-[0_3px_0_#4f8fd6] transition active:translate-y-0.5 active:shadow-none">
        close letter
      </AlertDialog.Trigger>
      <AlertDialog.Portal>
        <AlertDialog.Overlay className="dialog-overlay fixed inset-0 z-[60] bg-cocoa/40 backdrop-blur-sm" />
        <AlertDialog.Content className="dialog-content fixed top-1/2 left-1/2 z-[60] w-[min(90vw,24rem)] -translate-x-1/2 -translate-y-1/2 rounded-3xl border-2 border-pink-deep bg-cream p-6 text-center shadow-[0_8px_0_#ff9ec7]">
          <AlertDialog.Title className="font-hand text-3xl font-bold text-berry">
            close the letter? 💝
          </AlertDialog.Title>
          <AlertDialog.Description className="mt-2 font-hand text-2xl leading-8">
            you'll need the password to open it again.
          </AlertDialog.Description>
          <div className="mt-6 grid grid-cols-2 gap-3 text-lg font-bold">
            <AlertDialog.Cancel className="rounded-full border-2 border-pink-deep bg-cream px-4 py-2.5 shadow-[0_3px_0_#ff9ec7] transition active:translate-y-0.5 active:shadow-none">
              keep reading
            </AlertDialog.Cancel>
            <AlertDialog.Action
              onClick={onConfirm}
              className="rounded-full bg-berry px-4 py-2.5 text-white shadow-[0_3px_0_#b23a70] transition active:translate-y-0.5 active:shadow-none"
            >
              yes, close it
            </AlertDialog.Action>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
}
