import { Button, Card, Form, Input, message, Spin, Typography } from "antd";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate, useParams } from "react-router-dom";
import { skipToken } from "@reduxjs/toolkit/query";
import { useEffect } from "react";
import styled from "styled-components";
import {
  useCreateZonesMutation,
  useGetZoneQuery,
  useUpdateZonesMutation,
} from "../../store/features/zone";
import { NewZoneDto } from "../../types/zone.type";

const StyledFormContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 5px;
  margin-left: 100px;
`;

type FormValues = {
  name: string;
};

const schema = yup.object({
  name: yup.string().required("El nombre es requerido"),
});

const ZoneForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [createZone, { isLoading: isCreating }] = useCreateZonesMutation();
  const [updateZone, { isLoading: isUpdating }] = useUpdateZonesMutation();
  const {
    data: zoneData,
    isLoading: isFetching,
    refetch,
  } = useGetZoneQuery(id ? { id } : skipToken);

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
    defaultValues: {
      name: "",
    },
    mode: "onBlur",
  });

  useEffect(() => {
    if (zoneData) {
      const { name } = zoneData;
      setValue("name", name);
    }
  }, [zoneData, setValue, id]);

  const onSubmit = async (data: NewZoneDto) => {
    try {
      //coordinates va a estar hardcodeado
      const newData = {
        name: data.name,
      };

      if (isEdit && id) {
        await updateZone({ zoneId: id, zone: newData }).unwrap();
        message.success("Zona actualizado correctamente");
      } else {
        await createZone(newData).unwrap();
        message.success("Zona creado correctamente");
      }
      navigate("/zona");
    } catch (error: any) {
      console.error("Error al guardar la zona:", error);
      message.error(
        error?.data?.message || "Ocurrió un error al guardar la zona"
      );
    }
  };

  return (
    <div>
      <Card
        title={isEdit ? "Editar zona" : "Crear nueva zona"}
        style={{ width: "100%" }}
      >
        {isFetching ? (
          <div
            style={{ display: "flex", justifyContent: "center", padding: 20 }}
          >
            <Spin tip="Cargando zona..." />
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
                      placeholder="Nombre de la zona"
                    />
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

export default ZoneForm;
