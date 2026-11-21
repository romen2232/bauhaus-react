"use client";
import type { ReactNode, Ref } from "react";
import { Cell, Column, Row, Table, TableBody, TableHeader } from "react-aria-components";
import { cn } from "../../../lib/cn.js";
import type { TableBaseClasses, TableColumn } from "./tableTypes.js";

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
  classes: TableBaseClasses;
};

export type TableLabelProps =
  | { "aria-label": string; "aria-labelledby"?: string }
  | { "aria-labelledby": string; "aria-label"?: string };

export type TableBaseProps<T> = TableBaseOwnProps<T> & TableLabelProps;

/** The shape every skin aliases (`Omit` would collapse the label union). */
export type TableSkinProps<T> = Omit<TableBaseOwnProps<T>, "classes"> & TableLabelProps;

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
  className,
  ref,
  classes,
  ...labelProps
}: TableBaseProps<T>) {
  const rowHeaderId = (columns.find((column) => column.isRowHeader) ?? columns[0])?.id;

  return (
    <div className={cn(classes.wrapper, className)} ref={ref}>
      <Table {...labelProps} className={classes.table}>
        <TableHeader columns={columns} dependencies={[columns]} className={classes.header}>
          {(column) => (
            <Column
              id={column.id}
              textValue={column.label}
              isRowHeader={column.id === rowHeaderId}
              allowsSorting={column.allowsSorting}
              className={cn(classes.column, column.align === "end" && classes.alignEnd)}
            >
              {column.label}
            </Column>
          )}
        </TableHeader>
        <TableBody
          items={rows}
          className={classes.body}
          renderEmptyState={
            emptyState ? () => <div className={classes.empty}>{emptyState}</div> : undefined
          }
        >
          {(row) => (
            <Row id={getRowId(row)} columns={columns} dependencies={[columns]} className={classes.row}>
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
