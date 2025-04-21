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
  useDeleteSportMutation,
  useGetSportsQuery,
} from "../../store/features/sports";
import { Sport } from "../../types/sport.type";
const { Search } = Input;

const getColumns = (
  handleDeleteSport: (id: string) => void,
  navigate: NavigateFunction
): ColumnType<Sport>[] => {
  return [
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
      render: (record: Sport) => (
        <Space
          size="middle"
          style={{
            display: "flex",

            justifyContent: "right",
          }}
        >
          <Button onClick={() => navigate(`../deportes/${record._id}`)}>
            Editar
          </Button>

          <Delete handleDelete={handleDeleteSport} id={record._id} />
        </Space>
      ),
    },
  ];
};

const likeInputs = ["name", "location", "user"];
const SportList = () => {
  const navigate = useNavigate();
  const [deleteSport] = useDeleteSportMutation();
  const [filter, setFilter] = useState<{}>();
  const { data } = useGetSportsQuery(filter);
  const handleDeleteSport = (id: string) => {
    deleteSport(id).unwrap();
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

  const columns = getColumns(handleDeleteSport, navigate);

  return (
    <div>
      <h2>Deportes</h2>

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
              navigate("/deportes/nuevo");
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

export default SportList;
