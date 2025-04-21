import { Button, Input, Segmented, Select, Space, Table } from "antd";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useDeleteUserMutation,
  useGetUsersQuery,
} from "../../store/features/users";
import { ColumnType } from "antd/es/table";
import Delete from "../../components/actions/delete";
import { User } from "../../types/users.types";
import { NavigateFunction } from "react-router-dom";
import {
  StyledSearchContainer,
  StyledSearchHeader,
} from "../../styled/globalStyled";
const { Search } = Input;

const getColumns = (
  handleDeleteUser: (id: string) => void,
  navigate: NavigateFunction
): ColumnType<User>[] => {
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

          <Button onClick={() => navigate(`../usuarios/${record._id}`)}>
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

      <StyledSearchHeader id="searchHeader">
        <StyledSearchContainer>
          <label>Buscar</label>
          <Search
            placeholder="ingrese algun dato de interes"
            onChange={(e) => handleSearch("name", e.target.value)}
            size="middle"
            name="like-name"
          />
          <Button
            type="primary"
            style={{
              boxShadow: "none",
              color: "#ffffff",
              background:"#1a1a1a"
            }}
            onClick={() => {
              navigate("/usuarios/nuevo");
            }}
          >
            Nuevo
          </Button>
        </StyledSearchContainer>
      </StyledSearchHeader>
      <Table dataSource={data?.results || []} columns={columns} />
    </div>
  );
};

export default UsersList;
