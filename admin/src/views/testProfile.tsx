import React from "react";
import { Avatar, Card, List } from "antd";
import { MailOutlined, PhoneOutlined, HomeOutlined } from "@ant-design/icons";
import User from "../interfaces/interfaces";
import UserList from "../components/userLists";

const TestUserProfile = () => {
  return (
    <Card
      style={{ width: 300, marginTop: 50, alignSelf: "center" }}
      bodyStyle={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Avatar
        size={100}
        src="https://img.freepik.com/vector-gratis/ilustracion-joven-principe-vector_1308-174367.jpg"
        style={{ marginBottom: 20 }}
      />
      <h2>Juan Perez</h2>
      <List>
        <List.Item>
          <List.Item.Meta
            avatar={<MailOutlined />}
            title="juanperez@gmail.com"
          />
        </List.Item>
        <List.Item>
          <List.Item.Meta avatar={<PhoneOutlined />} title="3413800988" />
        </List.Item>
        <List.Item>
          <List.Item.Meta
            avatar={<HomeOutlined />}
            title="Junin 288, Rosario"
          />
        </List.Item>
      </List>
    </Card>
  );
};

export default TestUserProfile;
