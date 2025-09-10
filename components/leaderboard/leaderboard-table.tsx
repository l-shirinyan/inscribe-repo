"use client";

import { useEffect } from "react";
import {
  ColumnDef,
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";
import moment from "moment";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { LeaderboardUser } from "@/api/leaderboard";
import { useLeaderboardStore } from "@/lib/store/leaderboard";
import Link from "next/link";
import Image from "next/image";
import { Button } from "../ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Text } from "../ui/text";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

export default function LeaderboardTable() {
  const { data, page, loading, hasMore, setPage, loadUsers } =
    useLeaderboardStore();

  const columns: ColumnDef<LeaderboardUser>[] = [
    {
      header: "Signer",
      cell: (info) => page * 15 + info.row.index + 1,
      size: 20,
      minSize: 80,
    },
    {
      accessorKey: "name",
      header: "Name",
      cell: (info) => {
        const username = info.getValue() as string | null;
        const profilePic = info.row.original.twitterProfilePic;
        return (
          <div className="flex items-center gap-2">
            {profilePic ? (
              <Image
                src={profilePic}
                alt={username ?? "User profile"}
                width={32}
                height={32}
                className="rounded-full object-cover"
              />
            ) : (
              <Image
                src="/assets/images/user.svg"
                width={32}
                height={32}
                alt="user"
              />
            )}
            {username}
          </div>
        );
      },
      minSize: 250,
    },
    {
      header: "Email",
      accessorKey: "email",
      cell: (info) => info.getValue(),
      minSize: 300,
    },
    {
      accessorKey: "twitterUsername",
      header: () => (
        <div className="flex items-center gap-2">
          Twitter
          <Image
            src="/assets/images/twitter.png"
            alt="twitter"
            width={20}
            height={20}
          />
        </div>
      ),
      cell: (info) => {
        const username = info.getValue() as string | null;
        return username ? (
          <Link
            href={`https://twitter.com/${username}`}
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            @{username}
          </Link>
        ) : (
          "-"
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: "Signed",
      cell: (info) => {
        const date = info.getValue() as string;
        
        return (
          <div>
            <Tooltip>
              <TooltipTrigger asChild>
                <button type="button" className="cursor-pointer">
                  {moment(date).fromNow()}
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="font-geist-sans">{date}</p>
              </TooltipContent>
            </Tooltip>
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    enableColumnResizing: true,
    columnResizeMode: "onChange",
  });

  useEffect(() => {
    loadUsers(0);
  }, []);

  const nextPage = async () => {
    const newPage = page + 1;
    setPage(newPage);
    await loadUsers(newPage);
  };

  const prevPage = async () => {
    if (page === 0) return;
    const newPage = page - 1;
    setPage(newPage);
    await loadUsers(newPage);
  };

  return (
    <>
      <Table className="table-fixed w-full">
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead
                  key={header.id}
                  style={{ width: `${header.getSize()}px` }}
                >
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <div className="flex justify-center mt-10 gap-4 items-center">
        <Button
          onClick={prevPage}
          disabled={page === 0 || loading}
          className="px-4 py-2 bg-gray-500 text-white disabled:opacity-50 max-w-[120px] w-full"
        >
          <ChevronLeft />
          Prev
        </Button>
        <Button
          onClick={nextPage}
          disabled={!hasMore || loading}
          className="px-4 py-2 bg-orange text-white disabled:opacity-50 max-w-[120px] w-full"
        >
          {loading ? "Loading..." : "Next"}
          <ChevronRight />
        </Button>
      </div>
    </>
  );
}
