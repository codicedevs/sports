import { Button, Card, Form, Input, message, Typography } from "antd";
import { Controller, useForm } from "react-hook-form";
import { NewUserDto } from "../../interfaces/interfaces";
import {
  useGetUserQuery,
  useRegisterUserMutation,
} from "../../store/features/user/userApi";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { replace, useNavigate, useParams } from "react-router-dom";
import { skipToken } from "@reduxjs/toolkit/query";
import { useEffect } from "react";
import styled from "styled-components";

const StyledDiv = styled.div`
  display: "flex",
  flexDirection: "row",
  gap: 5,
  marginLeft: 20,
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
  const [updateUser] = useRegisterUserMutation();
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
    resolver: yupResolver(isEdit ? schemaNew : schemaEdit, {
      context: { isEdit },
    }),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
    },
    mode: "onBlur",
  });

  useEffect(() => {
    if (userData) {
      const values = {
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        password: "", // nunca precargues password real
      };

      Object.entries(values).forEach(([key, value]) => {
        setValue(key as keyof FormValues, value);
      });
    }
  }, [userData]);

  const onSubmit = async (data: any) => {
    if (isEdit) {
      // updateUser({ data: id, params: userData });
    } else {
      try {
        await registerUser(data);
        message.success("Usuario creado correctamente");
        navigate("/home/users");
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
        <StyledDiv>
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
        </StyledDiv>
      </Card>
    </div>
  );
};

export default UserForm;
