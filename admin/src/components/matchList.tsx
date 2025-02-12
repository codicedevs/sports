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

const MatchList = () => {
  const [bordered, setBordered] = useState(true);
  const [filter, setFilter] = useState<{}>();
  const { data, isLoading, error } = useGetMatchesQuery(filter);

  const handleFilterChange = (filterName: string, value: any) => {
    setFilter((prevFilter) => ({
      ...prevFilter,
      [filterName]: value,
    }));
  };

  const handleSearch = (value: string) => {
    console.log("lo que sale", value);
    setFilter((prevFilter) => ({ ...prevFilter, name: value }));
  };
  const handleOpenChange = () => {
    setBordered(!bordered);
    handleFilterChange("open", !bordered); // Actualiza el estado del filtro
  };

  const onSearch: SearchProps["onSearch"] = (value, _e, info) => {
    useGetMatchesQuery(value);
    console.log(value);
  };

  return (
    <div>
      <h2>Partidos</h2>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 20,
          gap: 10,
        }}
      >
        <Search
          placeholder="ingrese algun dato de interes"
          onChange={(e) => handleSearch(e.target.value)}
          enterButton="Buscar"
          size="middle"
          style={{ width: "20%" }}
          // suffix={suffix}
          onSearch={onSearch}
        />
        <div
          style={{
            display: "flex",
            gap: 20,
            justifyContent: "space-between",
            alignItems: "center",
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
            <label htmlFor="switchBordered">Persona</label>

            <Select
              placeholder="Elegi una persona"
              optionFilterProp="label"
              // onChange={onChange}
              // onSearch={onSearch}
              options={optionsFilter}
            />
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyItems: "space-between",
              alignItems: "center",
              gap: "5px",
            }}
          >
            <label htmlFor="switchBordered">Estado</label>
            <div
              style={{
                display: "block",
                alignItems: "center",
              }}
            >
              <Switch
                checked={bordered}
                onChange={() => handleOpenChange()}
                checkedChildren="Abiertos"
                unCheckedChildren="Cerrados"
              />
            </div>
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
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "5px",
            }}
          >
            <label htmlFor="switchBordered">Filtro Custom</label>
            <Search
              placeholder="ingrese algun dato de interes"
              size="middle"
              // suffix={suffix}
              onSearch={onSearch}
            />
          </div>
        </div>
      </div>
      <Table dataSource={data?.results || []} columns={columns} />
    </div>
  );
};

export default MatchList;
