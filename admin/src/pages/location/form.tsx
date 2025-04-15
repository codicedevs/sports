import { Button, Card, Form, Input, message, Spin, Typography } from "antd";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate, useParams } from "react-router-dom";
import { skipToken } from "@reduxjs/toolkit/query";
import { useEffect } from "react";
import styled from "styled-components";

import {
  useCreateLocationsMutation,
  useGetLocationQuery,
  useUpdateLocationsMutation,
} from "../../store/features/locations";
import { NewLocationDto } from "../../types/locations.type";

const StyledFormContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 5px;
  margin-left: 100px;
`;

type FormValues = {
  name: string;
  address: string;
  latitude: string;
  longitude: string;
};

const schema = yup.object({
  name: yup.string().required("El nombre es requerido"),
  address: yup.string().required("La dirección es requerida"),
  latitude: yup
    .string()
    .required("La latitud es requerida")
    .test(
      "is-valid-number",
      "La latitud debe ser un número",
      (value) => !isNaN(Number(value))
    ),
  longitude: yup
    .string()
    .required("La longitud es requerida")
    .test(
      "is-valid-number",
      "La longitud debe ser un número",
      (value) => !isNaN(Number(value))
    ),
});

const LocationForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [createLocation, { isLoading: isCreating }] =
    useCreateLocationsMutation();
  const [updateLocation, { isLoading: isUpdating }] =
    useUpdateLocationsMutation();
  const {
    data: locationData,
    isLoading: isFetching,
    refetch,
  } = useGetLocationQuery(id ? { id } : skipToken);

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
    defaultValues: {
      name: "",
      address: "",
      latitude: "",
      longitude: "",
    },
    mode: "onBlur",
  });

  useEffect(() => {
    if (locationData) {
      const { name, address, location } = locationData;
      setValue("name", name);
      setValue("address", address);
      if (location && Array.isArray(location.coordinates)) {
        setValue("latitude", String(location.coordinates[0]));
        setValue("longitude", String(location.coordinates[1]));
      }
    }
  }, [locationData, setValue, id]);

  const onSubmit = async (data: NewLocationDto) => {
    try {
      //coordinates va a estar hardcodeado
      const newData = {
        name: data.name,
        address: data.address,
        coordinates: [-32.96262764365664, -60.62611040288317],
      };

      console.log("Establecimiento a guardar:", newData);

      if (isEdit && id) {
        await updateLocation({ locationId: id, location: newData }).unwrap();
        message.success("Establecimiento actualizado correctamente");
      } else {
        await createLocation(newData).unwrap();
        message.success("Establecimiento creado correctamente");
      }
      navigate("/establecimiento");
    } catch (error: any) {
      console.error("Error al guardar el establecimiento:", error);
      message.error(
        error?.data?.message || "Ocurrió un error al guardar el establecimiento"
      );
    }
  };

  return (
    <div>
      <Card
        title={
          isEdit ? "Editar Establecimiento" : "Crear Nuevo Establecimiento"
        }
        style={{ width: "100%" }}
      >
        {isFetching ? (
          <div
            style={{ display: "flex", justifyContent: "center", padding: 20 }}
          >
            <Spin tip="Cargando establecimiento..." />
          </div>
        ) : (
          <StyledFormContainer>
            <Form
              onFinish={handleSubmit(onSubmit)}
              layout="vertical"
              style={{ width: 300 }}
              autoComplete="off"
            >
              <Form.Item
                label="Nombre"
                help={
                  <Typography className="error-text">
                    {errors.name?.message}
                  </Typography>
                }
              >
                <Controller
                  name="name"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      placeholder="Nombre del establecimiento"
                    />
                  )}
                />
              </Form.Item>

              <Form.Item
                label="Dirección"
                help={
                  <Typography className="error-text">
                    {errors.address?.message}
                  </Typography>
                }
              >
                <Controller
                  name="address"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      placeholder="Dirección del establecimiento"
                    />
                  )}
                />
              </Form.Item>

              <Form.Item
                label="Latitud"
                help={
                  <Typography className="error-text">
                    {errors.latitude?.message}
                  </Typography>
                }
              >
                <Controller
                  name="latitude"
                  control={control}
                  render={({ field }) => (
                    <Input {...field} placeholder="-32.96262764365664" />
                  )}
                />
              </Form.Item>

              <Form.Item
                label="Longitud"
                help={
                  <Typography className="error-text">
                    {errors.longitude?.message}
                  </Typography>
                }
              >
                <Controller
                  name="longitude"
                  control={control}
                  render={({ field }) => (
                    <Input {...field} placeholder="-60.62611040288317" />
                  )}
                />
              </Form.Item>

              <Button
                type="primary"
                htmlType="submit"
                disabled={isCreating || isUpdating}
                loading={isCreating || isUpdating}
              >
                {isEdit ? "Guardar Cambios" : "Crear"}
              </Button>
            </Form>
          </StyledFormContainer>
        )}
      </Card>
    </div>
  );
};

export default LocationForm;
