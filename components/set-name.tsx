import React from "react";
import { Button } from "./ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "./ui/input";
import { AlertTriangle } from "lucide-react";
import { setUserName } from "@/lib/actions";

export function SetName({}) {
  const [name, setName] = React.useState<string>("");
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const handleNameChange = () => {
    setIsLoading(true);
    setUserName(name);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="destructive">
          <span className="flex items-center gap-2 text-sm">
            <AlertTriangle />
            Set Name
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <div className="flex flex-col gap-4 w-64">
          <Input
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Button disabled={isLoading} onClick={() => handleNameChange()}>
            Save
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
