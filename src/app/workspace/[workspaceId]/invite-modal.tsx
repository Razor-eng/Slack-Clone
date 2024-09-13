import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useNewJoinCode } from "@/features/workspaces/api/use-new-join-code";
import useConfirm from "@/hooks/use-confirm";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { CopyIcon, RefreshCcw } from "lucide-react";
import { toast } from "sonner";

interface InviteModalProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    name: string;
    joinCode: string;
};

const InviteModal = ({ open, setOpen, joinCode, name }: InviteModalProps) => {
    const workspaceId = useWorkspaceId();
    const [ConfirmDialog, confirm] = useConfirm(
        "Are you sure?",
        "This will deactivate the current invite code and generate a new one"
    );

    const { mutate, isPending } = useNewJoinCode();

    const inviteLink = `${window.location.origin}/join/${workspaceId}`;

    const handleCopy = () => {
        navigator.clipboard
            .writeText(inviteLink)
            .then(() => toast.success('Invite link copied'));
    }

    const handleCodeCopy = () => {
        navigator.clipboard
            .writeText(joinCode)
            .then(() => toast.success('Join code copied'));
    }

    const handleNewCode = async () => {
        const ok = await confirm();

        if (!ok) return;

        mutate({ workspaceId }, {
            onSuccess: () => {
                toast.success("Invite code regenerated");
            },
            onError: () => {
                toast.error("Failed to generate invite code");
            }
        })
    }

    return (
        <>
            <ConfirmDialog />
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Invite people to {name}</DialogTitle>
                        <DialogDescription>
                            Use the code below to invite people to your workspace
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex flex-col gap-y-4 items-center justify-center py-10">
                        <div className="flex">
                            <p className="text-4xl font-bold tracking-widest uppercase">
                                {joinCode}
                            </p>
                            <Button
                                onClick={handleCodeCopy}
                                variant={"ghost"}
                                size={"sm"}
                                disabled={isPending}
                            >
                                <CopyIcon className="size-3" />
                            </Button>
                        </div>
                        <div className="flex flex-col w-full items-center">
                            <div className="w-[80%] bg-zinc-100 h-10">
                                <input
                                    className="w-full h-full bg-transparent outline-none border-2 border-zinc-300 rounded-md text-sm px-2"
                                    value={inviteLink}
                                    disabled
                                />
                            </div>
                            <Button
                                onClick={handleCopy}
                                variant={"ghost"}
                                size={"sm"}
                                disabled={isPending}
                            >
                                Copy link
                                <CopyIcon className="size-4 ml-2" />
                            </Button>
                        </div>
                    </div>
                    <div className="flex items-center justify-between w-full">
                        <Button
                            onClick={handleNewCode}
                            variant={"outline"}
                            disabled={isPending}
                        >
                            New code
                            <RefreshCcw className="size-4 ml-2" />
                        </Button>
                        <DialogClose asChild>
                            <Button className="bg-red-600 hover:bg-red-500">Close</Button>
                        </DialogClose>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
}

export default InviteModal