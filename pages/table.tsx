import axios from 'axios';
import { FlResponse } from 'lib/flobs';
import { utils } from 'lib/utils';
import moment from 'moment';
import React from 'react';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';

function Table({ info }: { info: { info: FlResponse[] } }) {
  const columnHelper = createColumnHelper<FlResponse>();
  const columns = [
    columnHelper.accessor('address', {
      cell: (info) => info.getValue(),
      footer: (info) => info.column.id,
    }),
    columnHelper.accessor((row) => row.name, {
      id: 'name',
      cell: (info) => <i>{info.getValue()}</i>,
      footer: (info) => info.column.id,
    }),
    columnHelper.accessor('symbol', {
      header: () => 'symbol',
      cell: (info) => info.renderValue(),
      footer: (info) => info.column.id,
    }),
    columnHelper.accessor('chainName', {
      header: () => <span>chainName</span>,
      footer: (info) => info.column.id,
    }),
    columnHelper.accessor('chain', {
      header: () => <span>chain</span>,
      footer: (info) => info.column.id,
    }),
    columnHelper.accessor('profit', {
      header: 'profit $',
      cell: (info) => utils.numberWithCommas(info.renderValue()),
      footer: (info) => info.column.id,
    }),
    columnHelper.accessor('txHash', {
      header: 'tx hash',
      cell: (info) => (
        <>
          <a
            href={utils.getTenderlyTxUrl(
              info.row.getValue('chain'),
              info.getValue()
            )}
            target='_blank'>
            {' '}
            {info.renderValue()}
          </a>
        </>
      ),
      footer: (info) => info.column.id,
    }),
  ];
  const [sorting, setSorting] = React.useState<SortingState>([
    {
      desc: true,
      id: 'profit',
    },
  ]);
  const table = useReactTable({
    data: info.info,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });
  console.log(sorting);
  return (
    <table>
      <thead>
        {table.getHeaderGroups().map((headerGroup) => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map((header) => {
              return (
                <th key={header.id} colSpan={header.colSpan}>
                  {header.isPlaceholder ? null : (
                    <div
                      {...{
                        className: header.column.getCanSort()
                          ? 'cursor-pointer select-none'
                          : '',
                        onClick: header.column.getToggleSortingHandler(),
                      }}>
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                      {{
                        asc: ' 🔼',
                        desc: ' 🔽',
                      }[header.column.getIsSorted() as string] ?? null}
                    </div>
                  )}
                </th>
              );
            })}
          </tr>
        ))}
      </thead>
      <tbody>
        {table.getRowModel().rows.map((row) => (
          <tr key={row.id}>
            {row.getAllCells().map((cell) => (
              <td key={cell.id}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
      <tfoot>
        {table.getFooterGroups().map((footerGroup) => (
          <tr key={footerGroup.id}>
            {footerGroup.headers.map((header) => (
              <th key={header.id}>
                {header.isPlaceholder
                  ? null
                  : flexRender(
                      header.column.columnDef.footer,
                      header.getContext()
                    )}
              </th>
            ))}
          </tr>
        ))}
      </tfoot>
    </table>
  );
}

export async function getStaticProps() {
  const { data } = await axios.get(utils.api_url + '/fl');
  const { info: inf, date } = data;
  const info = inf as FlResponse[];
  return {
    props: {
      info: { info: info },
    },
    revalidate: 360,
  };
}

export default Table;
