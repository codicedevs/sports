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
  Switch,
} from "antd";
import { Controller, useForm } from "react-hook-form";
import { useLazyGetUsersQuery } from "../../store/features/users";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate, useParams } from "react-router-dom";
import { useRef, useState } from "react";
import dayjs from "dayjs";
import { useCreateMatchMutation } from "../../store/features/matches";
import { useGetLocationsQuery } from "../../store/features/locations";
import { useGetSportModeQuery } from "../../store/features/sportModes";
import { SportMode } from "../../types/sportModes.type";
import { Location } from "../../types/locations.type";
import { User } from "../../types/users.types";

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
  } = useForm({
    defaultValues: {
      name: "",
      open: false,
      date: "",
      hour: "",
      userId: "",
      sportMode: "",
      playersLimit: 10,
      location: "",
    },
  });

  const [filter, setFilter] = useState({});
  const [createMatch] = useCreateMatchMutation();
  const [triggerSearchUsers, { data: userData }] = useLazyGetUsersQuery(filter);
  const { data: sportModeData } = useGetSportModeQuery(filter);
  const { data: locationData } = useGetLocationsQuery({});
  const searchTimeoutRef = useRef<number | null>(null);

  const handleSearch = (value: string) => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      if (value) {
        triggerSearchUsers({
          where: { name: { $regex: value, $options: "i" } },
        });
      } else {
        triggerSearchUsers({});
      }
    }, 200);
  };

  const handleDropdownOpen = (open: boolean) => {
    if (open && !userData) {
      triggerSearchUsers({});
    }
  };

  const onSubmit = (data: FormValues) => {
    data.date = JSON.stringify(data.date).slice(1, -1);
    createMatch(data);
    message.success("Partido creado correctamente");
    navigate("/partidos");
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
              // validateStatus={errors.date && "error"}
              help={errors.date?.message}
            >
              <Controller
                name="date"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    showTime
                    style={{ width: "100%" }}
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
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
                render={({ field }) => {
                  return (
                    <Select
                      showSearch
                      allowClear
                      placeholder="Buscar organizador"
                      onChange={field.onChange}
                      onSearch={handleSearch}
                      filterOption={false}
                      value={field.value}
                      loading={!userData}
                      onDropdownVisibleChange={handleDropdownOpen}
                      notFoundContent={"No se encontraron resultados"}
                      options={(userData?.results || []).map((user: User) => ({
                        label: user.name,
                        value: user._id,
                      }))}
                    />
                  );
                }}
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
                  <Select
                    {...field}
                    placeholder="Seleccionar"
                    options={sportModeData?.results.map(
                      (sportMode: SportMode) => ({
                        label: sportMode.name,
                        value: sportMode._id,
                      })
                    )}
                  />
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
                render={({ field }) => (
                  <Select
                    showSearch
                    labelInValue={false}
                    placeholder="Buscar Establecimiento"
                    onChange={field.onChange}
                    value={field.value}
                    options={locationData?.results.map(
                      (location: Location) => ({
                        label: location.name,
                        value: location._id,
                      })
                    )}
                  />
                )}
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
