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
import { Zone } from "../../types/zone.type";
import {
  useDeleteZonesMutation,
  useGetZonesQuery,
  useLazyGetZonesQuery,
} from "../../store/features/zone";
const { Search } = Input;

const getColumns = (
  handleDeleteZone: (id: string) => void,
  navigate: NavigateFunction
): ColumnType<Zone>[] => {
  return [
    {
      title: "ID",
      dataIndex: "_id",
      key: "_id",
    },
    {
      title: "Nombre",
      dataIndex: "name",
      key: "name",
    },

    {
      title: "Acción",
      key: "action",
      width: "25%",
      align: "right" as const,
      render: (record: Zone) => (
        <Space
          size="middle"
          style={{
            display: "flex",

            justifyContent: "right",
          }}
        >
          <Button onClick={() => navigate(`../zona/${record._id}`)}>
            Editar
          </Button>

          <Delete handleDelete={handleDeleteZone} id={record._id} />
        </Space>
      ),
    },
  ];
};

const likeInputs = ["name", "location", "user"];
const ZoneList = () => {
  const navigate = useNavigate();
  const [deleteZone] = useDeleteZonesMutation();
  const [filter, setFilter] = useState<{}>();

  // const { data } = useGetZonesQuery(filter);

  const [trigger, { data }] = useLazyGetZonesQuery();

  const handleDeleteZone = (id: string) => {
    deleteZone(id).unwrap();
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
    setTimeout(() => {
      trigger({ name: { LIKE: filter } });
    }, 1000);
  };
  const columns = getColumns(handleDeleteZone, navigate);

  return (
    <div>
      <h2>Zonas</h2>

      <StyledSearchHeader id="searchHeader">
        <StyledSearchContainer>
          <label>Buscar</label>
          <Search
            placeholder="ingrese algun dato de interes"
            onChange={(e) => handleSearch("name", e.target.value)}
            onSearch={(value) => console.log("nabde")}
            size="middle"
            name="like-name"
          />
          <Button
            type="primary"
            onClick={() => {
              navigate("/zona/nuevo");
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

export default ZoneList;
