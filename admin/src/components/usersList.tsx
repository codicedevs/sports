import { Button, Input, Segmented, Select, Space, Table } from "antd";
import { useState } from "react";
import { Location, Match, User, UserList } from "../interfaces/interfaces";
import { useNavigate } from "react-router-dom";
import {
  useDeleteUserMutation,
  useGetUsersQuery,
} from "../store/features/user/userApi";
import { ColumnType } from "antd/es/table";
import Delete from "./Delete";
const { Search } = Input;

const getColumns = (
  handleDeleteUser: (id: string) => void,
  navigate: any
): ColumnType<UserList>[] => {
  return [
    {
      title: "Nombre",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Telefono",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Rol",
      dataIndex: "roles",
      key: "roles",
      render: (roles: string[]) => {
        return roles.map((r) => (r === "user" ? "Jugador" : "Usuario"));
      },
    },
    {
      title: "Calificacion",
      dataIndex: "calificacion",
      key: "calificacion",
      render: () => "5 estrellas",
    },
    {
      title: "Acción",
      key: "action",
      width: "25%",
      align: "right" as const,
      render: (record: User) => (
        <Space
          size="middle"
          style={{
            display: "flex",

            justifyContent: "right",
          }}
        >
          {record.phone ? (
            <a href={`https://wa.me/${record.phone}`} target="_blank">
              Enviar mensaje
            </a>
          ) : (
            <p>No hay telefono</p>
          )}

          <Button onClick={() => navigate(`../users/${record._id}`)}>
            Editar
          </Button>

          <Delete handleDelete={handleDeleteUser} id={record._id} />
        </Space>
      ),
    },
  ];
};

const likeInputs = ["name", "location", "user"];
const UsersList = () => {
  const navigate = useNavigate();
  const [deleteUser] = useDeleteUserMutation();
  const [filter, setFilter] = useState<{}>();
  const { data } = useGetUsersQuery(filter);
  const handleDeleteUser = (id: string) => {
    deleteUser(id);
  };

  const handleSearch = (filterName: string, value: string | boolean) => {
    if (likeInputs.includes(filterName)) {
      setFilter((prevFilter) => ({
        ...prevFilter,
        [filterName]: { LIKE: value },
      }));
    } else {
      setFilter((prevFilter) => ({
        ...prevFilter,
        [filterName]: value,
      }));
    }
  };

  const columns = getColumns(handleDeleteUser, navigate);

  return (
    <div>
      <h2>Usuarios</h2>

      <div
        id="searchHeader"
        style={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          marginBottom: 20,
          gap: 10,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <label>Buscar</label>
          <Search
            placeholder="ingrese algun dato de interes"
            onChange={(e) => handleSearch("name", e.target.value)}
            size="middle"
            name="like-name"
          />
          <Button
            type="primary"
            onClick={() => {
              navigate("../../home/users/newUser");
            }}
          >
            Nuevo
          </Button>
        </div>
      </div>
      <Table dataSource={data?.results || []} columns={columns} />
    </div>
  );
};

export default UsersList;
