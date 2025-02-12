import React from "react";
import UserList from "../components/userList";
import TestList from "../components/testList";
import { Button, Space } from "antd";

const columnsData = [
  {
    title: "Id",
    dataIndex: "id",
    key: "id",
  },
  {
    title: "Nombre y Apellido",
    key: "fullName",
    render: (record: any) => `${record.firstName} ${record.lastName}`,
  },
  {
    title: "Telefono",
    dataIndex: "phone",
    key: "phone",
  },
  {
    title: "Email",
    dataIndex: "mail",
    key: "mail",
  },
  {
    title: "Acción",
    key: "action",
    width: "25%",
    render: (record: any) => (
      <Space
        size="middle"
        style={{
          display: "flex",

          justifyContent: "right",
        }}
      >
        <a>Escribir a {record.firstName}</a>
        <Button>Editar</Button>
        <Button>Borrar</Button>
      </Space>
    ),
  },
];

const Users = () => {
  return (
    <div>
      <h1>Menu Usuario</h1>
      <TestList />
    </div>
  );
};

export default Users;
