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
import UserList from "./userLists";
import { useGetMatchesQuery } from "../store/features/match/matchApi";

type SearchProps = GetProps<typeof Input.Search>;

const { Search } = Input;

const onSearch: SearchProps["onSearch"] = (value, _e, info) =>
  console.log(info?.source, value);

const columns = [
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

const optionsFilter = dataList.map((user) => ({
  label: user.firstName, // Esto se mostrará en el UI
  value: user.firstName, // Esto es el valor que se retorna cuando se selecciona la opción
}));

const TestList = () => {
  const [bordered, setBordered] = useState(true);
  const [filter, setFilter] = useState<string>("");
  const { data, isLoading, error } = useGetMatchesQuery();

  console.log(data, isLoading, error);

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
            <label htmlFor="switchBordered">Jugados</label>
            <div
              style={{
                display: "block",
                alignItems: "center",
              }}
            >
              <Switch
                checked={bordered}
                onChange={() => setBordered(!bordered)}
                checkedChildren="Jugados"
                unCheckedChildren="Sin jugar"
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
      <Table dataSource={dataList} columns={columns} />;
    </div>
  );
};

export default TestList;
