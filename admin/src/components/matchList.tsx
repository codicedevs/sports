import {
  Button,
  GetProps,
  Input,
  Segmented,
  Select,
  Space,
  Switch,
  Table,
} from "antd";
import dataList from "../assets/users.json";
import { useState } from "react";
import { useGetMatchesQuery } from "../store/features/match/matchApi";

type SearchProps = GetProps<typeof Input.Search>;

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
  },
  {
    title: "Ciudad",
    dataIndex: "location",
    key: "location",
    render: (location: any) => `${location.name}`,
  },
  {
    title: "Reserva hecha por",
    dataIndex: "userId",
    key: "userId",
    render: (user: any) => `${user.name}`,
  },
  {
    title: "Estado",
    dataIndex: "open",
    key: "open",
    render: (open: boolean) => (open ? <h3>Abierto</h3> : "Cerrado"),
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

const optionsFilter = dataList.map((user) => ({
  label: user.firstName,
  value: user.firstName,
}));

const stateOptions = [
  { label: "Abierto", value: true },
  { label: "Cerrado", value: false },
  { label: "Todas", value: "all" },
];

const likeInputs = ["name", "location", "user"];

const MatchList = () => {
  const [bordered, setBordered] = useState(true);
  const [filter, setFilter] = useState<{}>();
  const { data, isLoading, error } = useGetMatchesQuery(filter);

  const handleFilterChange = (filterName: string, value: any) => {};

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
            // onSearch={onSearch}
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
