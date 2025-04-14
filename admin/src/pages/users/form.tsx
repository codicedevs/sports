import { Button, Card, Form, Input, message, Typography } from "antd";
import { Controller, useForm } from "react-hook-form";
import {
  useGetUserQuery,
  useRegisterUserMutation,
  useUpdateUserMutation,
} from "../../store/features/users";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate, useParams } from "react-router-dom";
import { skipToken } from "@reduxjs/toolkit/query";
import { useEffect } from "react";
import { NewUserDto } from "../../types/users.types";
import styled from "styled-components";

const StyledFormContainer = styled.div`
  display: flex,
  flexDirection: row,
  gap: 5,
  marginLeft: 100,
`;

type FormValues = {
  name: string;
  email: string;
  phone: string;
  password: string;
};

const schemaNew = yup.object({
  name: yup.string().required("El nombre es requerido"),
  email: yup
    .string()
    .email("Ingrese un email valido")
    .required("El email es requerido"),
  phone: yup.string().required("El telefono es requerido"),
  password: yup.string().required("La contraseña es requerida"),
});
const schemaEdit = yup.object({
  name: yup.string().required("El nombre es requerido"),
  email: yup
    .string()
    .email("Ingrese un email valido")
    .required("El email es requerido"),
  phone: yup.string().required("El telefono es requerido"),
  password: yup.string(),
});

const UserForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [registerUser, { isLoading }] = useRegisterUserMutation();
  const [updateUser] = useUpdateUserMutation();
  const { data: userData, isLoading: isFetching } = useGetUserQuery(
    id ? { id } : skipToken
  );
  const isEdit = Boolean(id);
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: yupResolver(isEdit ? schemaEdit : schemaNew, {
      context: { isEdit },
    }),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
    },
    mode: "onBlur",
  });

  useEffect(() => {
    if (userData) {
      const values = {
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        password: userData.password,
      };

      Object.entries(values).forEach(([key, value]) => {
        setValue(key as keyof FormValues, value);
      });
    }
  }, [userData]);

  const onSubmit = async (data: any) => {
    if (isEdit) {
      updateUser({ id, user: data });
      message.success("Usuario editado correctamente");
      navigate("/usuarios");
    } else {
      try {
        await registerUser(data);
        message.success("Usuario creado correctamente");
        navigate("/usuarios");
      } catch (error) {
        console.error("Error al crear usuario:", error);
        message.error("Error al crear el usuario");
      }
    }
  };
  return (
    <div>
      <Card
        title={id ? "Editar Usuario" : "Crear Nuevo Usuario"}
        style={{ width: "100%" }}
      >
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
                  <Input {...field} placeholder="Nombre" />
                )}
              />
            </Form.Item>
            <Form.Item
              label="Email"
              help={
                <Typography className="error-text">
                  {errors.email?.message}
                </Typography>
              }
            >
              <Controller
                name="email"
                control={control}
                render={({ field }) => <Input {...field} placeholder="Email" />}
              />
            </Form.Item>
            <Form.Item
              label="Telefono"
              help={
                <Typography className="error-text">
                  {errors.phone?.message}
                </Typography>
              }
            >
              <Controller
                name="phone"
                control={control}
                render={({ field }) => (
                  <Input {...field} placeholder="Telefono" />
                )}
              />
            </Form.Item>
            <Form.Item
              label="Contraseña"
              help={
                <Typography className="error-text">
                  {errors.password?.message}
                </Typography>
              }
            >
              <Controller
                name="password"
                control={control}
                render={({ field }) => (
                  <Input.Password {...field} placeholder="Contraseña" />
                )}
              />
            </Form.Item>

            <Button
              type="primary"
              htmlType="submit"
              disabled={isLoading}
              loading={isLoading}
            >
              {isEdit ? "Guardar Cambios" : "Crear"}
            </Button>
          </Form>
        </StyledFormContainer>
      </Card>
    </div>
  );
};

export default UserForm;
