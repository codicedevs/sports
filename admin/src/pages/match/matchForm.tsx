import {
  Button,
  Card,
  Col,
  DatePicker,
  Form,
  Input,
  InputNumber,
  message,
  Row,
  Select,
  Spin,
  Switch,
  Typography,
} from "antd";
import { Controller, useForm } from "react-hook-form";
import {
  useGetUserQuery,
  useGetUsersQuery,
  useLazyGetUsersQuery,
  useRegisterUserMutation,
} from "../../store/features/user/userApi";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate, useParams } from "react-router-dom";
import { skipToken } from "@reduxjs/toolkit/query";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { Option } from "antd/es/mentions";
import { useCreateMatchMutation } from "../../store/features/match/matchApi";

type FormValues = {
  name: string;
  open: boolean;
  date: string;
  userId: string;
  sportMode: string;
  playersLimit: number;
  location: string;
};

const schema = yup.object({
  name: yup.string().required("El nombre es requerido"),
  open: yup.boolean().required("El estado es requerido"),
  date: yup.string().required("La fecha es requerida"),
  userId: yup.string().required("El usuario es requerido"),
  sportMode: yup.string().required("El modo de deporte es requerido"),
  playersLimit: yup.number().required("El limite de jugadores es requerido"),
  location: yup.string().required("El establecimiento es requerido"),
});

const MatchForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: yupResolver(schema, {
      context: { isEdit },
    }),
    defaultValues: {
      name: "",
      open: false,
      date: "",
      userId: "",
      sportMode: "",
      playersLimit: 10,
      location: "",
    },
    mode: "onBlur",
  });

  const [createMatch] = useCreateMatchMutation();
  const [trigger, { data, isFetching }] = useLazyGetUsersQuery({});
  const [userList, setUserList] = useState([{}]);
  const [fetching, setFetching] = useState(false);

  const fetchUsers = async (searchText: string = "") => {
    const result = await trigger({ q: searchText }).unwrap();
    const mappedOptions = result.results.map((user) => ({
      label: user.name,
      value: user._id,
    }));

    setUserList(mappedOptions);
    setFetching(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const onSubmit = async (data: any) => {
    try {
      await createMatch(data);
      message.success("Usuario creado correctamente");
      navigate("/home/partidos");
    } catch (error) {
      console.error("Error al crear usuario:", error);
      message.error("Error al crear el usuario");
    }
  };
  return (
    <Card
      title={id ? "Editar Partido" : "Crear Nuevo Partido"}
      style={{ width: "100%" }}
    >
      <Form
        layout="vertical"
        onFinish={handleSubmit(onSubmit)}
        style={{ width: "100%" }}
      >
        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item
              label="Nombre"
              validateStatus={errors.name && "error"}
              help={errors.name?.message}
            >
              <Controller
                name="name"
                control={control}
                render={({ field }) => <Input {...field} />}
              />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              label="Estado"
              validateStatus={errors.open && "error"}
              help={errors.open?.message}
            >
              <Controller
                name="open"
                control={control}
                render={({ field }) => (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    <p>Cerrado</p>
                    <Switch checked={field.value} onChange={field.onChange} />
                    <p>Abierto</p>
                  </div>
                )}
              />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              label="Fecha"
              validateStatus={errors.date && "error"}
              help={errors.date?.message}
            >
              <Controller
                name="date"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    style={{ width: "100%" }}
                    value={field.value ? dayjs(field.value) : null}
                    onChange={(date) =>
                      field.onChange(date ? date.toISOString() : "")
                    }
                  />
                )}
              />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              label="Organizador"
              validateStatus={errors.userId && "error"}
              help={errors.userId?.message}
            >
              <Controller
                name="userId"
                control={control}
                render={({ field }) => (
                  <Select
                    showSearch
                    labelInValue={false}
                    placeholder="Buscar organizador"
                    onSearch={fetchUsers}
                    loading={isFetching}
                    onChange={field.onChange}
                    value={field.value}
                    options={userList}
                  />
                )}
              />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              label="Modo de Deporte"
              validateStatus={errors.sportMode && "error"}
              help={errors.sportMode?.message}
            >
              <Controller
                name="sportMode"
                control={control}
                render={({ field }) => (
                  <Select {...field} placeholder="Seleccionar">
                    <Option value="676d903173a26a0de5f38bda">Fútbol</Option>
                  </Select>
                )}
              />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              label="Límite de jugadores"
              validateStatus={errors.playersLimit && "error"}
              help={errors.playersLimit?.message}
            >
              <Controller
                name="playersLimit"
                control={control}
                render={({ field }) => (
                  <InputNumber
                    {...field}
                    min={1}
                    defaultValue={10}
                    style={{ width: "100%" }}
                  />
                )}
              />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              label="Establecimiento"
              validateStatus={errors.location && "error"}
              help={errors.location?.message}
            >
              <Controller
                name="location"
                control={control}
                render={({ field }) => <Input {...field} />}
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Enviar
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default MatchForm;
