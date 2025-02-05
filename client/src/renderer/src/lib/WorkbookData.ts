import { read, type WorkBook, type WorkSheet, utils } from "xlsx";
import type { Mappings } from "$lib/mappings";
import { CalendarDate, type DateValue } from "@internationalized/date";

interface Column {
  name: string;
  col: string;
}

export interface Row {
  date: CalendarDate;
  customer: string;
  description: string;
  rate: number;
  amount: number;
}

export class SheetData {
  columns: Column[] = [];

  constructor(private sheet: WorkSheet) {
    this.addColumns();
  }

  get range() {
    return utils.decode_range(this.sheet["!ref"] || "A1:A1");
  }

  addColumns() {
    const range = this.range;

    for (let x = range.s.c; x <= range.e.c; x++) {
      const cell = this.sheet[utils.encode_cell({ r: range.s.r, c: x })];

      this.columns.push({
        name: cell?.v
          ? `${cell?.v} (${utils.encode_col(x)})`
          : `Column ${utils.encode_col(x)}`,
        col: utils.encode_col(x),
      });
    }
  }

  getColumnCells(col: string) {
    const range = this.range;
    const cells: any[] = [];

    for (let y = range.s.r + 1; y <= range.e.r; y++) {
      const cell =
        this.sheet[utils.encode_cell({ r: y, c: utils.decode_col(col) })];

      cells.push(cell);
    }

    return cells;
  }

  getColumnValues(col: string) {
    return this.getColumnCells(col).map(
      (cell) => (cell?.w || cell?.v || "") as string,
    );
  }

  getColumnDates(col: string) {
    return this.getColumnCells(col).map(
      (cell) =>
        new CalendarDate(
          cell.v.getFullYear(),
          cell.v.getMonth() + 1,
          cell.v.getDate(),
        ),
    );
  }

  getRelevantValues(mappings: Mappings, start?: DateValue, end?: DateValue) {
    const dateColumn = mappings.find(
      (mapping) => mapping.id === "DATE",
    )?.column;
    const customerColumn = mappings.find(
      (mapping) => mapping.id === "CUSTOMER",
    )?.column;
    const descriptionColumn = mappings.find(
      (mapping) => mapping.id === "DESCRIPTION",
    )?.column;
    const rateColumn = mappings.find(
      (mapping) => mapping.id === "RATE",
    )?.column;
    const amountColumn = mappings.find(
      (mapping) => mapping.id === "AMOUNT",
    )?.column;

    if (
      !dateColumn ||
      !customerColumn ||
      !descriptionColumn ||
      !rateColumn ||
      !amountColumn ||
      !start ||
      !end
    ) {
      return null;
    }

    const dateValues = this.getColumnDates(dateColumn);
    const customerValues = this.getColumnValues(customerColumn);
    const descriptionValues = this.getColumnValues(descriptionColumn);
    const rateValues = this.getColumnValues(rateColumn).map((value) =>
      parseFloat(value.replaceAll(/[^0-9.-]+/g, "")),
    );
    const amountValues = this.getColumnValues(amountColumn).map((value) =>
      parseFloat(value),
    );

    const relatedDates = dateValues
      .map((date, index) => ({
        date,
        index,
      }))
      .filter(({ date }) => {
        return date.compare(start) >= 0 && date.compare(end) <= 0;
      });

    const rowValues = relatedDates.map(
      ({ index }) =>
        ({
          date: dateValues[index],
          customer: customerValues[index],
          description: descriptionValues[index],
          rate: rateValues[index],
          amount: amountValues[index],
        }) as Row,
    );

    return rowValues.reduce(
      (acc, row) => {
        if (acc[row.customer]) acc[row.customer].push(row);
        else acc[row.customer] = [row];

        return acc;
      },
      {} as Record<string, Row[]>,
    );
  }
}

interface Sheet {
  name: string;
  sheet: SheetData;
}

export default class WorkbookData {
  sheets: Sheet[] = [];

  constructor(workbook: WorkBook) {
    this.sheets = Object.entries(workbook.Sheets).map(([name, sheet]) => ({
      name,
      sheet: new SheetData(sheet),
    }));

    console.log(this.sheets);
  }

  static async fromSheet(file: string) {
    const data = await window.api.fileRead(file);
    const workbook = read(data, {
      type: "buffer",
      cellDates: true,
      cellStyles: true,
    });

    return new WorkbookData(workbook);
  }
}
