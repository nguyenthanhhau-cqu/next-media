import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { updatePost } from "@/lib/action";
import {formatInTimeZone, toZonedTime} from 'date-fns-tz';

type EditPostDialogProps = {
    isOpen: boolean;
    onClose: () => void;
    post: {
        id: number;
        title: string | null;
        desc: string;
        eventStartTime: Date | null;
        penaltyAmount: number | null;
    };
};

const EditPostDialog: React.FC<EditPostDialogProps> = ({ isOpen, onClose, post }) => {
    const [title, setTitle] = useState(post.title || '');
    const [desc, setDesc] = useState(post.desc);
    const [eventStartTime, setEventStartTime] = useState(
        post.eventStartTime
            ? formatInTimeZone(new Date(post.eventStartTime), 'Australia/Melbourne', "yyyy-MM-dd HH:mm:ss")
            : ''
    );
    const [penaltyAmount, setPenaltyAmount] = useState(post.penaltyAmount?.toString() || '0.5');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const melbourneDate = new Date(eventStartTime);
            const utcDate = toZonedTime(melbourneDate, 'Australia/Melbourne');

            const result = await updatePost(post.id, {
                title,
                desc,
                eventStartTime: utcDate,
                penaltyAmount: parseFloat(penaltyAmount)
            });
            if (result.success) {
                onClose();
            } else {
                console.error('Failed to update post:', result.error);
            }
        } catch (error) {
            console.error('Failed to update post:', error);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Post</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <label htmlFor="title" className="text-right">
                                Title
                            </label>
                            <Input
                                id="title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <label htmlFor="desc" className="text-right">
                                Description
                            </label>
                            <Textarea
                                id="desc"
                                value={desc}
                                onChange={(e) => setDesc(e.target.value)}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <label htmlFor="eventStartTime" className="text-right">
                                Event Start Time
                            </label>
                            <Input
                                id="eventStartTime"
                                type="datetime-local"
                                value={eventStartTime}
                                onChange={(e) => setEventStartTime(e.target.value)}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <label htmlFor="penaltyAmount" className="text-right">
                                Penalty Amount
                            </label>
                            <Input
                                id="penaltyAmount"
                                type="number"
                                value={penaltyAmount}
                                onChange={(e) => setPenaltyAmount(e.target.value)}
                                className="col-span-3"
                                step="0.1"
                                min="0"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit">Save changes</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default EditPostDialog;