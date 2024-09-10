"use client";

import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useCreateChannelModal } from '../store/use-create-channel-modal';
import { useCreateChannel } from '../api/use-create-channel';
import { useWorkspaceId } from '@/hooks/use-workspace-id';

const CreateChannelModal = () => {
    const router = useRouter();
    const workspaceId = useWorkspaceId();

    const [open, setOpen] = useCreateChannelModal();
    const [name, setName] = useState('');

    const { mutate, isPending } = useCreateChannel();

    const handleClose = () => {
        setName("");
        setOpen(false);
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        mutate(
            { name, workspaceId },
            {
                onSuccess: (id) => {
                    router.push(`/workspace/${workspaceId}/channel/${id}`);
                    toast.success(`${name} channel Created`);
                    handleClose();
                },
                onError: () => {
                    toast.error("Failed to create the channel");
                }
            })
    };

    const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/\s+/g, "-").toLowerCase();
        setName(value);
    };

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add a channel</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className='space-y-4'>
                    <Input
                        value={name}
                        onChange={handleChange}
                        disabled={isPending}
                        required
                        autoFocus
                        minLength={3}
                        maxLength={80}
                        placeholder="Channel name e.g. plan-budget"
                    />
                    <div className="flex justify-end">
                        <Button
                            disabled={isPending}
                        >
                            Create
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default CreateChannelModal