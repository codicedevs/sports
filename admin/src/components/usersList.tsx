import { Button, Input, Segmented, Select, Space, Table } from "antd";
import { useState } from "react";
import { CheckCircleTwoTone, CloseCircleTwoTone } from "@ant-design/icons";
import { Location, Match, User } from "../interfaces/interfaces";
import { useNavigate } from "react-router-dom";
import { useGetUsersQuery } from "../store/features/user/userApi";
const { Search } = Input;

const likeInputs = ["name", "location", "user"];
const UsersList = () => {
  const navigate = useNavigate();

  const columns = [
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

          <Button>Editar</Button>
          <Button>Borrar</Button>
        </Space>
      ),
    },
  ];
  const [filter, setFilter] = useState<{}>();
  const { data } = useGetUsersQuery(filter);
  console.log("data", data);

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
  const handleOpenChange = (value: string) => {
    console.log(value);

    handleSearch("open", value);
  };

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
            flexDirection: "column",
            alignItems: "center",
            gap: "5px",
          }}
        >
          <label>Buscar</label>
          <Search
            placeholder="ingrese algun dato de interes"
            onChange={(e) => handleSearch("name", e.target.value)}
            size="middle"
            name="like-name"
          />
        </div>
      </div>
      <Table dataSource={data?.results || []} columns={columns} />
    </div>
  );
};

export default UsersList;
