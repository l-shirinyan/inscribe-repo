import '@tanstack/table-core';
import type { RowData } from '@tanstack/table-core';

declare module '@tanstack/table-core' {
  interface ColumnMeta<TData extends RowData, TValue> {
    /** Общий класс для заголовка и ячеек */
    className?: string;
    /** Класс только для заголовка */
    headerClassName?: string;
    /** Класс только для ячеек */
    cellClassName?: string;
  }
}
