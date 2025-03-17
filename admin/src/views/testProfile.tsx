import { Card, Avatar, Row, Col, Table } from "antd";
import { lightColors } from "../utils/colors";
import { useParams } from "react-router-dom";
import { useGetUserQuery } from "../store/features/user/userApi";
import { formatDate, formatTime } from "../utils/functions";

export const columns = [
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "Fecha",
    dataIndex: "date",
    key: "date",
    render: (date: string) => formatDate(date),
  },
  {
    title: "Hora",
    dataIndex: "date",
    key: "hour",
    render: (date: string) => formatTime(date),
  },
  {
    title: "Sport Mode",
    dataIndex: "sportMode",
    key: "sportMode",
  },
  {
    title: "Location",
    key: "location",
    render: () => "Sin ubicación",
  },
];

const TestUserProfile = (filter: any) => {
  const { id } = useParams();
  const { data: usuario } = useGetUserQuery({ id, populate: "matches" });
  const data = usuario?.matches;

  const user = {
    avatar: "https://i.pravatar.cc/150?img=3",
    nombre: "Juan Pérez",
    numeroUsuario: "12345",
    telefono: "+1 555-1234",
    edad: 30,
    direccion: "Calle Falsa 123",
  };

  return (
    <Card
      style={{
        borderTop: `5px solid ${lightColors.secondary}`,
        display: "flex",
        flexDirection: "column",
        height: "80%",
        margin: 40,
      }}
    >
      <Row
        gutter={[16, 16]}
        style={{ display: "flex", justifyContent: "space-around" }}
      >
        <Col
          span={8}
          style={{
            display: "flex",
            flexDirection: "row",
            gap: 16,
            alignItems: "center",
          }}
        >
          <Avatar size={100} src={user.avatar} />
          <div style={{ marginTop: 8, fontWeight: "bold" }}>
            {usuario?.name}
          </div>
        </Col>
        <Col span={16} style={{ textAlign: "right" }}>
          <div>
            <strong>Número de usuario:</strong> {usuario?._id}
          </div>
          <div>
            <strong>Teléfono:</strong> {usuario?.phone}
          </div>
          <div>
            <strong>Email:</strong> {usuario?.email}
          </div>
        </Col>
      </Row>
      <div style={{ marginTop: 16, flex: 1 }}>
        <Table columns={columns} dataSource={data} pagination={false} />
      </div>
    </Card>
  );
};

export default TestUserProfile;
