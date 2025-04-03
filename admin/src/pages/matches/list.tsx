import { Button, Input, Segmented, Select, Space, Table } from "antd";
import { useState } from "react";
import {
  useDeleteMatchMutation,
  useGetMatchesQuery,
} from "../../store/features/matches";
import { CheckCircleTwoTone, CloseCircleTwoTone } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { ColumnType } from "antd/es/table";
import Delete from "../../components/actions/delete";
import { Match } from "../../types/matches.type";
import { Location } from "../../types/locations.type";
import { User } from "../../types/users.types";
import { NavigateFunction } from "react-router-dom";
const { Search } = Input;

const getColumns = (
  handleDeleteMatch: (id: string) => void,
  navigate: NavigateFunction
): ColumnType<Match>[] => {
  return [
    {
      title: "Nombre del partido",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Fecha",
      dataIndex: "date",
      key: "date",
      render: (date: Date) => {
        const dateObj = new Date(date);
        const day = ("0" + dateObj.getDate()).slice(-2);
        const month = ("0" + (dateObj.getMonth() + 1)).slice(-2);
        const year = dateObj.getFullYear();
        return `${day}/${month}/${year}`;
      },
    },
    {
      title: "Hora",
      dataIndex: "date",
      key: "time",
      render: (date: Date) => {
        const dateObj = new Date(date);
        const hours = ("0" + dateObj.getHours()).slice(-2);
        const minutes = ("0" + dateObj.getMinutes()).slice(-2);
        return `${hours}:${minutes}`;
      },
    },
    {
      title: "Cancha",
      dataIndex: "location",
      key: "location",
      render: (location: Location) =>
        location ? `${location.name}` : "Sin definir",
    },
    {
      title: "Reserva hecha por",
      dataIndex: "user",
      key: "userId",
      render: (user: User) => `${user?.name}`,
    },
    {
      title: "Abierto",
      dataIndex: "open",
      key: "open",
      render: (open: boolean) => {
        return (
          <div style={{ display: "flex", justifyContent: "center" }}>
            {open ? (
              <CheckCircleTwoTone twoToneColor="#52c41a" />
            ) : (
              <CloseCircleTwoTone twoToneColor="#c4521a" />
            )}
          </div>
        );
      },
    },
    {
      title: "Acción",
      key: "action",
      width: "25%",
      align: "right" as const,
      render: (record: Match) => (
        <Space
          size="middle"
          style={{
            display: "flex",

            justifyContent: "right",
          }}
        >
          {record.user ? (
            <a onClick={() => navigate(`../usuarios/${record.user._id}`)}>
              Escribir a {record.user.name}
            </a>
          ) : (
            <p>No hay usuario</p>
          )}

          <Button onClick={() => navigate(`../partidos/${record._id}`)}>
            Editar
          </Button>

          <Delete handleDelete={handleDeleteMatch} id={record._id} />
        </Space>
      ),
    },
  ];
};

const stateOptions = [
  { label: "Abierto", value: true },
  { label: "Cerrado", value: false },
  { label: "Todas", value: "all" },
];
const likeInputs = ["name", "location", "user"];

const MatchesList = () => {
  const navigate = useNavigate();

  const [filter, setFilter] = useState<{}>();
  const { data } = useGetMatchesQuery(filter);
  const [deleteMatch] = useDeleteMatchMutation();

  const handleDeleteMatch = (id: string) => {
    deleteMatch(id);
  };
  const columns = getColumns(handleDeleteMatch, navigate);

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
      <h2>Partidos</h2>

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

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "5px",
          }}
        >
          <label htmlFor="switchBordered">Estado</label>

          <Select
            placeholder="Elegí un estado"
            optionFilterProp="label"
            onChange={handleOpenChange}
            defaultValue={"all"}
            options={stateOptions}
            style={{ width: 150, textAlign: "center" }}
          />
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "5px",
          }}
        >
          <label htmlFor="switchBordered">Turno</label>
          <Segmented
            value={filter}
            options={[
              { label: "Mañana", value: "Opcion 1" },
              { label: "Tarde", value: "Opcion 2" },
              { label: "Noche", value: "Opcion 3" },
            ]}
          />
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "5px",
          }}
        >
          <label htmlFor="switchBordered">Turno</label>
          <Button
            type="primary"
            onClick={() => {
              navigate("/partidos/nuevo");
            }}
          >
            Nuevo Partido
          </Button>
        </div>
      </div>
      <Table dataSource={data?.results || []} columns={columns} />
    </div>
  );
};

export default MatchesList;
