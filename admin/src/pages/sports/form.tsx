import { Button, Card, Form, Input, message, Spin, Typography } from "antd";
import { Controller, useForm } from "react-hook-form";
import {
  useCreateSportMutation,
  useGetSportQuery,
  useUpdateSportMutation,
} from "../../store/features/sports";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate, useParams } from "react-router-dom";
import { skipToken } from "@reduxjs/toolkit/query";
import { useEffect } from "react";
import styled from "styled-components";
import { NewSportDto } from "../../types/sport.type"; // Asegurate de tener este tipo creado

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

const SportForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const isEdit = Boolean(id);

  const [createSport, { isLoading: isCreating }] = useCreateSportMutation();
  const [updateSport, { isLoading: isUpdating }] = useUpdateSportMutation();

  const { data: sportData, isLoading: isFetching } = useGetSportQuery(
    id ? { id } : skipToken
  );

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
    if (sportData) {
      const values = {
        name: sportData.name,
      };

      Object.entries(values).forEach(([key, value]) => {
        setValue(key as keyof FormValues, value);
      });
    }
  }, [sportData]);

  const onSubmit = async (data: NewSportDto) => {
    try {
      if (isEdit && id) {
        console.log("Actualizando deporte:", data);
        await updateSport({
          sportId: id,
          sport: { ...data, _id: id },
        }).unwrap();
        message.success("Deporte actualizado correctamente");
      } else {
        await createSport(data).unwrap();
        message.success("Deporte creado correctamente");
      }
      navigate("/deportes");
    } catch (error: any) {
      console.error("Error al guardar el deporte:", error);
      message.error(
        error?.data?.message || "Ocurrió un error al guardar el deporte"
      );
    }
  };

  return (
    <div>
      <Card
        title={isEdit ? "Editar Deporte" : "Crear Nuevo Deporte"}
        style={{ width: "100%" }}
      >
        {isFetching ? (
          <div
            style={{ display: "flex", justifyContent: "center", padding: 20 }}
          >
            <Spin tip="Cargando deporte..." />
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
                    <Input {...field} placeholder="Nombre del deporte" />
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

export default SportForm;
