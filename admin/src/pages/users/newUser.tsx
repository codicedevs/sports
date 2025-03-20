import { Button, Card, Form, Input, message, Typography } from "antd";
import { Controller, useForm } from "react-hook-form";
import { NewUserDto } from "../../interfaces/interfaces";
import { useRegisterUserMutation } from "../../store/features/user/userApi";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";

const schema = yup.object({
  name: yup.string().required("El nombre es requerido"),
  email: yup
    .string()
    .email("Ingrese un email valido")
    .required("El email es requerido"),
  phone: yup.string().required("El telefono es requerido"),
  password: yup.string().required("La contraseña es requerida"),
});

const NewUser = () => {
  const navigate = useNavigate();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onBlur",
  });
  const [registerUser, { isLoading }] = useRegisterUserMutation();

  const onSubmit = async (data: any) => {
    console.log("data", data);
    try {
      await registerUser(data);
      message.success("Usuario creado correctamente");
      navigate("/home/users");
    } catch (error) {
      console.error("Error al crear usuario:", error);
      message.error("Error al crear el usuario");
    }
  };
  return (
    <div>
      <Card title="Crear Nuevo Usuario" style={{ width: "100%" }}>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            gap: 5,
            marginLeft: 20,
          }}
        >
          <Form
            onFinish={handleSubmit(onSubmit)}
            layout="vertical"
            style={{ width: 300 }}
            autoComplete="off"
          >
            <Form.Item
              hasFeedback
              label="Nombre"
              validateTrigger="onBlur"
              rules={[{ max: 3 }]}
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
                  <>
                    <Input {...field} placeholder="Nombre" />
                  </>
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
              Crear
            </Button>
          </Form>
        </div>
      </Card>
    </div>
  );
};

export default NewUser;
