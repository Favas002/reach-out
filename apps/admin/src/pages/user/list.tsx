import { Avatar } from "@mui/material";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import {
  DateField,
  DeleteButton,
  EditButton,
  List,
  ShowButton,
  useDataGrid,
} from "@refinedev/mui";
import React from "react";

export const UserPostList = () => {
  const { dataGridProps } = useDataGrid({});

  const columns = React.useMemo<GridColDef[]>(
    () => [
      {
        field: "_id",
        headerName: "ID",
        type: "number",
        minWidth: 120,
        display: "flex",
        align: "left",
        headerAlign: "left",
      },
      {
        field: "createdAt",
        headerName: "Created at",
        minWidth: 120,
        display: "flex",
        renderCell: function render({ value }) {
          return <DateField value={value} />;
        },
      },
      {
        field: "profileImage",
        headerName: "Image",
        minWidth: 120,
        sortable: false,
        display: "flex",
        renderCell: function render({ row }) {
          return (
            <>
              <Avatar src={row.pic} />
            </>
          );
        },
      },
      {
        field: "name",
        headerName: "Name",
        minWidth: 200,
        display: "flex",
      },
      {
        field: "email",
        headerName: "Email",
        minWidth: 200,
        display: "flex",
      },

      {
        field: "actions",
        headerName: "Actions",
        align: "right",
        headerAlign: "right",
        minWidth: 120,
        sortable: false,
        display: "flex",
        renderCell: function render({ row }) {
          return (
            <>
              <EditButton hideText recordItemId={row.id} />
              <ShowButton hideText recordItemId={row.id} />
              <DeleteButton hideText recordItemId={row.id} />
            </>
          );
        },
      },
    ],
    []
  );

  return (
    <List>
      <DataGrid
        getRowId={(row) => row._id}
        {...dataGridProps}
        columns={columns}
      />
    </List>
  );
};
