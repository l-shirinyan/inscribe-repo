"use client";

import { useEffect, useState, useMemo } from "react";
import {
  ColumnDef,
  useReactTable,
  getCoreRowModel,
  flexRender,
  getPaginationRowModel,
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
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { Input } from "../ui/input";
import { useTranslations } from 'next-intl';

export default function LeaderboardTable({
  numberOfSigners,
}: {
  numberOfSigners: number;
}) {
  const {
    data,
    loading,
    loadUsers,
    search,
    handleSearch,
  } = useLeaderboardStore();
  const t = useTranslations('Leaderboard');

  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 15;
  const [searchTerm, setSearchTerm] = useState("");
  const columns: ColumnDef<LeaderboardUser>[] = [
    {
      header: t('signer'),
      cell: (info) => {
        if (numberOfSigners <= 0) return;
        const globalIndex = currentPage * itemsPerPage + info.row.index;
        const rank = numberOfSigners - globalIndex;
        if (rank <= 0) return;
        return <div className="text-center text-gray-200">{rank}</div>;
      },
      size: 20,
      minSize: 50,
      meta: { className: "text-center" },
    },
    {
      accessorKey: "name",
      header: t('name'),
      cell: (info) => {
        const username = info.getValue() as string | null;
        const profilePic = info.row.original.twitterProfilePic;
        const showNameInLeaderboard = info.row.original.showNameInLeaderboard;
        return (
          <div className="flex items-center gap-2">
            {profilePic ? (
              <Image
                src={profilePic}
                alt={username ?? "User profile"}
                width={34}
                height={34}
                className="rounded-full object-cover"
              />
            ) : (
              <Image
                src="/assets/images/user.svg"
                width={34}
                height={34}
                alt="user"
              />
            )}
            {showNameInLeaderboard ? username : t('anonymous')}
          </div>
        );
      },
      minSize: 250,
    },
    {
      accessorKey: "twitterUsername",
      header: () => (
        <div className="flex items-center gap-2">
          {t('twitter')}
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
      header: t('signed'),
      cell: (info) => {
        const date = info.getValue() as string;
        const inscriptionUrl = info.row.original.inscriptionUrl;


        return (
          <div>
            <Tooltip>
              <TooltipTrigger asChild>
                <button type="button" className="cursor-pointer">
                  {moment(date).fromNow()}
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <div className="font-circular">
                  {inscriptionUrl ? (
                    <div>
                      <p className="text-xs text-gray-300 mb-1">{t('inscriptionUrl')}</p>
                      <a
                        href={inscriptionUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300 underline text-xs break-all"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {inscriptionUrl}
                      </a>
                    </div>
                  ) : (
                    <div>
                      <p className="text-xs text-gray-400">{t('inscriptionUrlNotAvailable')}</p>
                    </div>
                  )}
                </div>
              </TooltipContent>
            </Tooltip>
          </div>
        );
      },
    },
  ];

  // Filter data based on search term
  const filteredData = useMemo(() => {
    if (!searchTerm.trim()) return data;

    return data.filter((user) => {
      const name = user.name?.toLowerCase() || "";
      const twitterUsername = user.twitterUsername?.toLowerCase() || "";
      const searchLower = searchTerm.toLowerCase();

      return name.includes(searchLower) || twitterUsername.includes(searchLower);
    });
  }, [data, searchTerm]);

  // Calculate paginated data
  const paginatedData = useMemo(() => {
    const startIndex = currentPage * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredData.slice(startIndex, endIndex);
  }, [filteredData, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const table = useReactTable({
    data: paginatedData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    enableColumnResizing: true,
    columnResizeMode: "onChange",
    manualPagination: true,
    pageCount: totalPages,
  });

  useEffect(() => {
    loadUsers(0);
  }, []);

  const nextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(0);
  };

  return (
    <>
      <Input
        placeholder={t('search')}
        className="border border-gray-100 rounded-full px-4"
        containerClassName="self-start mb-5 sm:mb-12"
        value={searchTerm}
        onChange={(e) => handleSearchChange(e.target.value)}
      />
      <Table className="table-fixed w-full">
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead
                  key={header.id}
                  style={{ width: `${header.getSize()}px` }}
                  className={header.column.columnDef.meta?.className}
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
                {loading ? t('loading') : t('noResults')}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <div className="flex justify-center mt-10 gap-4 items-center">
        <Button
          onClick={prevPage}
          disabled={currentPage === 0 || loading}
          className="px-4 py-2 bg-gray-500 text-white disabled:opacity-50 max-w-[120px] w-full"
        >
          <ChevronLeft />
          {t('prev')}
        </Button>
        <Button
          onClick={nextPage}
          disabled={currentPage >= totalPages - 1 || loading}
          className="px-4 py-2 bg-orange text-white disabled:opacity-50 max-w-[120px] w-full"
        >
          {loading ? t('loading') : t('next')}
          <ChevronRight />
        </Button>
      </div>
    </>
  );
}
