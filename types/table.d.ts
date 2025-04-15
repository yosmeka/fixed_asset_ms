declare module '@tanstack/react-table' {
  export interface ColumnDef<TData> {
    id?: string;
    accessorKey?: string;
    header?: string;
    cell?: (props: { row: { getValue: (key: string) => any; original: TData } }) => React.ReactNode;
  }
} 