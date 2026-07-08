import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Plus, HardHat, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface DashboardFabProps {
  isAdmin: boolean;
}

export function DashboardFab({ isAdmin }: DashboardFabProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          size="icon"
          className="fixed bottom-6 right-6 z-50 size-14 rounded-full shadow-lg"
        >
          <Plus className="size-6" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" side="top" className="w-52 mb-2">
        {isAdmin && (
          <>
            <DropdownMenuItem asChild>
              <Link to="/obras">
                <HardHat className="size-4" />
                Adicionar obra
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/admin/usuarios">
                <UserPlus className="size-4" />
                Adicionar usuário
              </Link>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
