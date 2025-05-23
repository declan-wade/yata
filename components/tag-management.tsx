"use client";
import { useState } from "react";
import { Edit, Plus, Save, Trash2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Label } from "@/components/ui/label";
import { IconPicker } from "@/components/ui/icon-picker";
import { createTag } from "@/lib/database";
import { Separator } from "./ui/separator";

type Tag = {
  id: number;
  name: string;
  icon?: any;
};

type TagManagementProps = {
  tags: Tag[];
  onCreateTag: any;
  onUpdateTag: (
    id: number,
    data: Partial<Omit<Tag, "id">>,
  ) => Promise<void> | void;
  onDeleteTag: (id: number) => Promise<void> | void;
};

export function TagManagement({
  tags,
  onCreateTag,
  onUpdateTag,
  onDeleteTag,
}: TagManagementProps) {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [newTagName, setNewTagName] = useState("");
  const [newTagIcon, setNewTagIcon] = useState<any | null>(null);
  const [editingTag, setEditingTag] = useState<Tag | null>(null);

  const handleCreateTag = async () => {
    const response = await createTag(newTagName.trim(), newTagIcon);
    if (response) {
      // Append the new tag to the tags array
      onCreateTag(response);
    }
    setNewTagName("");
    setNewTagIcon(null);
    setIsCreateDialogOpen(false);
  };

  const handleEditTag = () => {
    if (!editingTag) return;

    onUpdateTag(editingTag.id, {
      name: editingTag.name,
      icon: editingTag.icon,
    });
    setEditingTag(null);
    setIsEditDialogOpen(false);
  };

  const openEditDialog = (tag: Tag) => {
    setEditingTag({ ...tag });
    setIsEditDialogOpen(true);
  };

  return (
    <>
    <div className="flex items-center justify-between p-4">
        <h2 className="text-2xl font-bold">My Tags</h2>
        <div className="flex items-center">
          <Button
          onClick={() => setIsCreateDialogOpen(true)}
          size="sm"
          className="h-8"
        >
          <Plus className="mr-1 h-4 w-4" />
          New Tag
        </Button>
        </div>
      </div>
      <Separator className="p-0 m-0" />
      
        {tags.length === 0 ? (
          <div className="text-center text-muted-foreground">
            <p>No tags available.</p>
            <p className="text-sm mt-1">
              Create tags to organize your todos better.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2">
            {tags.map((tag) => (
              <TagItem
                key={tag.id}
                tag={tag}
                onEdit={() => openEditDialog(tag)}
                onDelete={() => onDeleteTag(tag.id)}
              />
            ))}
          </div>
        )}
     

      {/* Create Tag Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Tag</DialogTitle>
            <DialogDescription>
              Add a new tag to organize your todos.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="tagName">Tag Name</Label>
              <Input
                id="tagName"
                placeholder="Enter tag name"
                value={newTagName}
                onChange={(e) => setNewTagName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Tag Icon (Optional)</Label>
              <IconPicker value={newTagIcon} onValueChange={setNewTagIcon} />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsCreateDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleCreateTag} disabled={!newTagName.trim()}>
              Create Tag
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Tag Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Tag</DialogTitle>
            <DialogDescription>Update your tag details.</DialogDescription>
          </DialogHeader>

          {editingTag && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="editTagName">Tag Name</Label>
                <Input
                  id="editTagName"
                  placeholder="Enter tag name"
                  value={editingTag.name}
                  onChange={(e) =>
                    setEditingTag({ ...editingTag, name: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>Tag Icon (Optional)</Label>
                <IconPicker
                  value={editingTag.icon || null}
                  onValueChange={(icon) =>
                    setEditingTag({ ...editingTag, icon })
                  }
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleEditTag} disabled={!editingTag?.name.trim()}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

function TagItem({
  tag,
  onEdit,
  onDelete,
}: {
  tag: Tag;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="flex items-center justify-between p-2 border-b border-r bg-card">
      <div className="flex items-center space-x-2 min-w-0">
        {tag.icon && (
          <div className="flex-shrink-0">
            <LucideIcon
              name={tag.icon}
              className="h-4 w-4 text-muted-foreground"
            />
          </div>
        )}
        <Badge
          variant="outline"
          className="px-2 py-1 h-auto text-sm truncate max-w-[180px]"
        >
          {tag.name}
        </Badge>
      </div>

      <div className="flex items-center gap-1">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={onEdit}
              >
                <Edit className="h-4 w-4" />
                <span className="sr-only">Edit</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Edit tag</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 hover:bg-red-100 hover:text-red-500"
                onClick={onDelete}
              >
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Delete</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Delete tag</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
}

// Helper component to render Lucide icons dynamically
// This assumes tag.icon contains the name of a Lucide icon
function LucideIcon({ name, className }: { name: string; className?: string }) {
  // This is a simplified implementation
  // In a real app, you'd need to map the icon name to the actual Lucide component
  // or use a more sophisticated approach to dynamically import icons

  // For demo purposes, we'll just render a placeholder
  return (
    <div className={cn("flex items-center justify-center", className)}>
      {/* This would be replaced with the actual icon in a real implementation */}
      <span className="block h-4 w-4 rounded-full bg-muted" />
    </div>
  );
}
