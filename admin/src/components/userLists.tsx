import { useState, useEffect } from "react";
import { Table, Button, Space, message } from "antd";
import axios from "axios";
import User from "../interfaces/interfaces";

const UserList = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const result = await axios("../assets/users.json"); // Ajusta la URL según sea necesario
      setUsers(result.data);
    };

    fetchData();
  }, []);

  const handleDelete = () => {
    if (selectedRowKeys.length > 0) {
      const newUsers = users.filter(
        (user: User) => !selectedRowKeys.includes(user.id)
      );
      setUsers(newUsers);
      setSelectedRowKeys([]);
      message.success("Usuarios eliminados con éxito.");
    } else {
      message.info("Seleccione al menos un usuario para eliminar.");
    }
  };

  const columns = [
    { title: "Nombre", dataIndex: "name", key: "name" },
    { title: "Correo Electrónico", dataIndex: "email", key: "email" },
    {
      title: "Acción",
      key: "action",
      render: (_: any, record: any) => (
        <Space size="middle">
          <Button onClick={() => console.log("Edit", record.id)}>Editar</Button>
        </Space>
      ),
    },
  ];

  const rowSelection = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys: any) => {
      setSelectedRowKeys(newSelectedRowKeys);
    },
  };

  return (
    <div>
      <Button
        type="primary"
        onClick={() => console.log("Agregar nuevo usuario")}
      >
        Agregar Usuario
      </Button>
      <Button
        onClick={handleDelete}
        disabled={selectedRowKeys.length === 0}
        style={{ margin: "0 8px" }}
      >
        Eliminar Usuario
      </Button>
      <Table
        rowKey="id"
        columns={columns}
        dataSource={users}
        rowSelection={rowSelection}
      />
    </div>
  );
};

export default UserList;
