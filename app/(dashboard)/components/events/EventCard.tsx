"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Clock,
  Edit,
  Trash2,
  AlertCircle,
  DollarSign,
} from "lucide-react";
import Link from "next/link";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface EventCardProps {
  event: {
    _id: string;
    name: string;
    description?: string;
    price: number;
    durationMinutes: number;
    bufferMinutes?: number;
    minimumNoticeMinutes?: number;
    isActive: boolean;
  };
  onDelete: (id: string) => Promise<void>;
  isDeleting: boolean;
}

export function EventCard({ event, onDelete, isDeleting }: EventCardProps) {
  const handleDelete = async () => {
    await onDelete(event._id);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  return (
    <Card
      className={`${event.isActive ? "hover:shadow-md transition-shadow" : "opacity-60"}`}
    >
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <CardTitle className="text-xl">{event.name}</CardTitle>
            {event.description && (
              <p className="text-sm text-muted-foreground line-clamp-2">
                {event.description}
              </p>
            )}
          </div>
          <Badge
            className={event.isActive ? "bg-green-600/70" : "bg-gray-600/70"}
          >
            {event.isActive ? "Active" : "Inactive"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pb-3">
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-muted-foreground" />
            <span className="font-semibold">{formatPrice(event.price)}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="font-semibold">
              Duration: {event.durationMinutes} minutes
            </span>
          </div>
          {event.bufferMinutes ? (
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="font-semibold">
                Buffer: {event.bufferMinutes} minutes
              </span>
            </div>
          ) : null}
          {event.minimumNoticeMinutes ? (
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
              <span className="font-semibold">
                Notice: {event.minimumNoticeMinutes} minutes
              </span>
            </div>
          ) : null}
        </div>
      </CardContent>
      <CardFooter className="flex gap-2 pt-3 border-t">
        <Link href={`/admin/events/${event._id}/edit`} className="flex-1">
          <Button variant="outline" className="w-full">
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
        </Link>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="destructive"
              className="flex-1"
              disabled={isDeleting}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the
                service "{event.name}".
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction className="bg-red-600" onClick={handleDelete}>
                {isDeleting ? "Deleting..." : "Delete"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardFooter>
    </Card>
  );
}
