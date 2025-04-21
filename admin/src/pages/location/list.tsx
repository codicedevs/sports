import { Button, Input, Space, Table } from "antd";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ColumnType } from "antd/es/table";
import Delete from "../../components/actions/delete";
import { NavigateFunction } from "react-router-dom";
import {
  StyledSearchContainer,
  StyledSearchHeader,
} from "../../styled/globalStyled";
import {
  useDeleteLocationsMutation,
  useGetLocationsQuery,
} from "../../store/features/locations";
import { Location } from "../../types/locations.type";

const { Search } = Input;

const getColumns = (
  handleDeleteLocation: (id: string) => void,
  navigate: NavigateFunction
): ColumnType<Location>[] => {
  return [
    {
      title: "Nombre",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Dirección",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "Latitud",
      key: "latitude",
      dataIndex: "location",
      render: (location: Location["location"]) =>
        location?.coordinates?.[0] ?? "No disponible",
    },
    {
      title: "Longitud",
      key: "longitude",
      dataIndex: "location",
      render: (location: Location["location"]) =>
        location?.coordinates?.[1] ?? "No disponible",
    },
    {
      title: "Acción",
      key: "action",
      width: "25%",
      align: "right" as const,
      render: (record: Location) => (
        <Space
          size="middle"
          style={{
            display: "flex",

            justifyContent: "right",
          }}
        >
          <Button onClick={() => navigate(`../establecimiento/${record._id}`)}>
            Editar
          </Button>

          <Delete handleDelete={handleDeleteLocation} id={record._id} />
        </Space>
      ),
    },
  ];
};

const likeInputs = ["name", "location", "user"];
const LocationList = () => {
  const navigate = useNavigate();
  const [deleteLocation] = useDeleteLocationsMutation();
  const [filter, setFilter] = useState<{}>();
  const { data } = useGetLocationsQuery(filter);
  
  const handleDeleteLocation = (id: string) => {
    deleteLocation(id).unwrap();
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
  const columns = getColumns(handleDeleteLocation, navigate);

  return (
    <div>
      <h2>Establecimientos</h2>

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
              navigate("/establecimiento/nuevo");
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

export default LocationList;
