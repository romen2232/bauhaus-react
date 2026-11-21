"use client";
import { useMemo, useState, type ReactNode, type Ref } from "react";
import { Cell, Column, Row, Table, TableBody, TableHeader } from "react-aria-components";
import { cn } from "../../../lib/cn.js";
import { sortRows } from "./sortRows.js";
import type { TableBaseClasses, TableColumn, TableSortDescriptor } from "./tableTypes.js";

export type TableBaseOwnProps<T> = {
  columns: TableColumn<T>[];
  rows: T[];
  /** Stable, unique id per row. */
  getRowId: (row: T) => string;
  /** Shown inside the body when there are no rows. */
  emptyState?: ReactNode;
  className?: string;
  /** The scroll wrapper element. */
  ref?: Ref<HTMLDivElement>;
  /** Controlled sort. The base does not reorder `rows`: the consumer owns the order. */
  sortDescriptor?: TableSortDescriptor;
  /** Initial sort when uncontrolled. The base then sorts `rows` itself. */
  defaultSortDescriptor?: TableSortDescriptor;
  onSortChange?: (descriptor: TableSortDescriptor) => void;
  classes: TableBaseClasses;
};

export type TableLabelProps =
  | { "aria-label": string; "aria-labelledby"?: string }
  | { "aria-labelledby": string; "aria-label"?: string };

/** A table has row links or a row action, never both. No selection in 0.6. */
export type TableRowActions<T> =
  | { getRowHref?: (row: T) => string; onRowAction?: never }
  | { onRowAction?: (row: T) => void; getRowHref?: never };

export type TableBaseProps<T> = TableBaseOwnProps<T> & TableLabelProps & TableRowActions<T>;

/** The shape every skin aliases (`Omit` would collapse the label union). */
export type TableSkinProps<T> = Omit<TableBaseOwnProps<T>, "classes"> & TableLabelProps & TableRowActions<T>;

function defaultText(value: unknown): string {
  if (value === null || value === undefined) return "";
  if (value instanceof Date) return value.toLocaleDateString();
  return String(value);
}

/** Internal: data-driven table on React Aria's `Table` dynamic collections. */
export function TableBase<T>({
  columns,
  rows,
  getRowId,
  emptyState,
  sortDescriptor,
  defaultSortDescriptor,
  onSortChange,
  getRowHref,
  onRowAction,
  className,
  ref,
  classes,
  ...labelProps
}: TableBaseProps<T>) {
  const isControlled = sortDescriptor !== undefined;
  const [localSort, setLocalSort] = useState(defaultSortDescriptor);
  const requested = isControlled ? sortDescriptor : localSort;
  // A descriptor for a column that no longer exists degrades to unsorted.
  const sortColumn = requested ? columns.find((column) => column.id === requested.column) : undefined;
  const effective = requested && sortColumn ? requested : undefined;

  const isActionable = Boolean(getRowHref || onRowAction);

  const displayRows = useMemo(
    () => (isControlled || !effective ? rows : sortRows(rows, sortColumn, effective.direction)),
    [isControlled, rows, sortColumn, effective],
  );

  const rowHeaderId = (columns.find((column) => column.isRowHeader) ?? columns[0])?.id;

  return (
    <div className={cn(classes.wrapper, className)} ref={ref}>
      <Table
        {...labelProps}
        className={classes.table}
        onRowAction={
          onRowAction
            ? (key) => {
                const row = rows.find((candidate) => getRowId(candidate) === String(key));
                if (row !== undefined) onRowAction(row);
              }
            : undefined
        }
        sortDescriptor={effective}
        onSortChange={(next) => {
          const descriptor: TableSortDescriptor = { column: String(next.column), direction: next.direction };
          if (!isControlled) setLocalSort(descriptor);
          onSortChange?.(descriptor);
        }}
      >
        <TableHeader columns={columns} dependencies={[columns]} className={classes.header}>
          {(column) => (
            <Column
              id={column.id}
              textValue={column.label}
              isRowHeader={column.id === rowHeaderId}
              allowsSorting={column.allowsSorting}
              className={({ sortDirection }) =>
                cn(
                  classes.column,
                  column.align === "end" && classes.alignEnd,
                  sortDirection && classes.columnSorted,
                )
              }
            >
              {({ allowsSorting, sortDirection }) => (
                <>
                  {column.label}
                  {allowsSorting && (
                    <span aria-hidden="true" className={classes.sortIcon}>
                      {sortDirection === "ascending" ? "↑" : sortDirection === "descending" ? "↓" : "↕"}
                    </span>
                  )}
                </>
              )}
            </Column>
          )}
        </TableHeader>
        <TableBody
          items={displayRows}
          dependencies={[columns, getRowHref, isActionable]}
          className={classes.body}
          renderEmptyState={
            emptyState ? () => <div className={classes.empty}>{emptyState}</div> : undefined
          }
        >
          {(row) => (
            <Row
              id={getRowId(row)}
              href={getRowHref?.(row)}
              columns={columns}
              dependencies={[columns]}
              className={cn(classes.row, isActionable && classes.rowActionable)}
            >
              {(column) => (
                <Cell
                  className={cn(
                    classes.cell,
                    column.id === rowHeaderId && classes.rowHeaderCell,
                    column.align === "end" && classes.alignEnd,
                  )}
                >
                  {column.render ? column.render(row) : defaultText(row[column.id])}
                </Cell>
              )}
            </Row>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
