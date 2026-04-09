"use client";

import { useState } from "react";
import { Edit2, Trash2, Power, PowerOff, Plus, Clock, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { TimeSlotForm } from "./TimeSlotForm";

interface TimeSlot {
  startTime: string;
  endTime: string;
  isEnabled: boolean;
}

interface DayScheduleGridProps {
  dayOfWeek: string;
  timeSlots: TimeSlot[];
  onAddSlot: (timeSlot: Omit<TimeSlot, 'isEnabled'> & { isEnabled: boolean }) => Promise<void>;
  onUpdateSlot: (index: number, timeSlot: TimeSlot) => Promise<void>;
  onRemoveSlot: (index: number) => Promise<void>;
  onToggleSlot: (index: number, isEnabled: boolean) => Promise<void>;
  isLoading: boolean;
}

export function DayScheduleGrid({
  dayOfWeek,
  timeSlots,
  onAddSlot,
  onUpdateSlot,
  onRemoveSlot,
  onToggleSlot,
  isLoading,
}: DayScheduleGridProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingSlot, setEditingSlot] = useState<{ index: number; slot: TimeSlot } | null>(null);
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);

  // In DayScheduleGrid.tsx, update the handleAddSlot function
const handleAddSlot = async (data: TimeSlot) => {
  // Ensure all required fields are present
  const slotData = {
    startTime: data.startTime,
    endTime: data.endTime,
    isEnabled: data.isEnabled !== undefined ? data.isEnabled : true,
  };
  await onAddSlot(slotData);
  setShowAddForm(false);
};

  const handleUpdateSlot = async (data: TimeSlot) => {
    if (editingSlot) {
      await onUpdateSlot(editingSlot.index, data);
      setEditingSlot(null);
    }
  };

  const handleDelete = async () => {
    if (deleteIndex !== null) {
      await onRemoveSlot(deleteIndex);
      setDeleteIndex(null);
    }
  };

  const formatTimeRange = (start: string, end: string) => {
    return `${start} ${end}`;
  };

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-xl font-bold">{dayOfWeek}</CardTitle>
        <Button
          size="sm"
          onClick={() => setShowAddForm(true)}
          disabled={isLoading}
          variant="outline"
        >
          <Plus className="h-4 w-4 mr-1" />
          Add Slot
        </Button>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col">
        
          {timeSlots.length === 0 ? (
            <div className="flex flex-1 flex-col items-center justify-center text-center text-muted-foreground">
              <Clock className="h-12 w-12 mb-2 opacity-50" />
              <p className="text-sm">No time slots added</p>
              <p className="text-xs">Click "Add Slot" to set your availability</p>
            </div>
          ) : (
            <div className="space-y-2">
              {timeSlots.map((slot, index) => (
                <div
                  key={index}
                  className={`flex items-center justify-between p-3 rounded-lg border ${
                    !slot.isEnabled ? "bg-muted/50" : ""
                  }`}
                >
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className={`font-medium ${!slot.isEnabled ? "line-through text-muted-foreground" : ""}`}>
                        {formatTimeRange(slot.startTime, slot.endTime)}
                      </span>
                      {slot.isEnabled ? (
                        <Badge variant="default" className="bg-green-500">
                          Active
                        </Badge>
                      ) : (
                        <Badge variant="secondary">Disabled</Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onToggleSlot(index, !slot.isEnabled)}
                      disabled={isLoading}
                      title={slot.isEnabled ? "Disable" : "Enable"}
                    >
                      {slot.isEnabled ? (
                        <PowerOff className="h-4 w-4" />
                      ) : (
                        <Power className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditingSlot({ index, slot })}
                      disabled={isLoading}
                      title="Edit"
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setDeleteIndex(index)}
                      disabled={isLoading}
                      title="Remove"
                      className="text-red-500 hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        
      </CardContent>

      {/* Add Time Slot Dialog */}
      {showAddForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md mx-4">
            <div className="bg-background rounded-lg shadow-lg">
              <div className="flex justify-between items-center p-4 border-b">
                <h3 className="text-lg font-semibold">Add Time Slot - {dayOfWeek}</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAddForm(false)}
                  disabled={isLoading}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="p-4">
                <TimeSlotForm
                  onSubmit={handleAddSlot}
                  onCancel={() => setShowAddForm(false)}
                  isLoading={isLoading}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Time Slot Dialog */}
      {editingSlot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md mx-4">
            <div className="bg-background rounded-lg shadow-lg">
              <div className="flex justify-between items-center p-4 border-b">
                <h3 className="text-lg font-semibold">Edit Time Slot - {dayOfWeek}</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setEditingSlot(null)}
                  disabled={isLoading}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="p-4">
                <TimeSlotForm
                  initialData={editingSlot.slot}
                  onSubmit={handleUpdateSlot}
                  onCancel={() => setEditingSlot(null)}
                  isLoading={isLoading}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteIndex !== null} onOpenChange={() => setDeleteIndex(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Time Slot</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove this time slot? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-500">
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}