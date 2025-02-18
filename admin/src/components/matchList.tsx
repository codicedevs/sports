import { Button, Input, Segmented, Select, Space, Table } from "antd";
import { useState } from "react";
import { useGetMatchesQuery } from "../store/features/match/matchApi";
import { CheckCircleOutlined } from "@ant-design/icons";
const { Search } = Input;
const columns = [
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
    render: (location: any) => (location ? `${location.name}` : "Sin definir"),
  },
  {
    title: "Reserva hecha por",
    dataIndex: "user",
    key: "userId",
    render: (user: any) => `${user?.name}`,
  },
  {
    title: "Abierto",
    dataIndex: "open",
    key: "open",
    render: (open: boolean) => (open ? <CheckCircleOutlined /> : "Cerrado"),
  },
  // {
  //   title: "Jugadores",
  //   dataIndex: "users",
  //   key: "users",
  // },
  {
    title: "Acción",
    key: "action",
    width: "25%",
    align: "right" as const,
    render: (record: any) => (
      <Space
        size="middle"
        style={{
          display: "flex",

          justifyContent: "right",
        }}
      >
        {/* <a>Escribir a {record.userId}</a> */}
        <Button>Editar</Button>
        <Button>Borrar</Button>
      </Space>
    ),
  },
];
const stateOptions = [
  { label: "Abierto", value: true },
  { label: "Cerrado", value: false },
  { label: "Todas", value: "all" },
];
const likeInputs = ["name", "location", "user"];

const MatchList = () => {
  const [filter, setFilter] = useState<{}>();
  const { data } = useGetMatchesQuery(filter);
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

    handleSearch("open", value); // Actualiza el estado del filtro
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

            // suffix={suffix}
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
            onChange={setFilter}
            options={[
              { label: "Opcion 1", value: "Opcion 1" },
              { label: "Opcion 2", value: "Opcion 2" },
              { label: "Opcion 3", value: "Opcion 3" },
            ]}
          />
        </div>
      </div>
      <Table dataSource={data?.results || []} columns={columns} />
    </div>
  );
};

export default MatchList;
