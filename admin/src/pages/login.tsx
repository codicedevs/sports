import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Form, Input, message, Card, Button, Image } from "antd";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import styled from "styled-components";
import { useLoginMutation } from "../store/features/auth/authApi";
import { setCredentials } from "../store/features/auth/authSlice";
import logo from "../assets/Pelota Logo negro.png";

const validationSchema = yup.object().shape({
  email: yup
    .string()
    .email("Es necesario ingresar un email")
    .required("Es obligatorio ingresar un email"),
  password: yup
    .string()
    .min(8, "La contraseña debe tener al menos 8 caracteres")
    .required("La contraseña es obligatoria"),
});

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const StyledImage = styled.img`
  width: 200px;
  margin-bottom: 20px;
`;

const StyledCard = styled(Card)`
  border: 1px solid #595959;
  width: 400px;
  background-color: #d9d9d9;
  border-radius: 4px;
`;

const StyledInput = styled(Input)`
  /* Aquí puedes añadir estilos específicos para el Input */
`;

const StyledPasswordInput = styled(Input.Password)`
  /* Aquí puedes añadir estilos específicos para el Input.Password */
`;

const StyledButton = styled(Button)`
  width: 100%; /* Hace que el botón sea del ancho completo del Card */
`;

const LoginPage = () => {
  const [login] = useLoginMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const onSubmit = async (data: { email: string; password: string }) => {
    try {
      const response = await login(data).unwrap();
      const userData = {
        user: { id: response.user.id, name: response.user.name },
        token: response.access_token,
        refreshToken: response.refresh_token,
      };
      dispatch(setCredentials(userData));
      navigate("/home");
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      message.error("Error en el inicio de sesión.");
    }
  };

  return (
    <StyledContainer className="homePageBackground">
      <StyledCard
        style={{
          backgroundColor: "#EEEEEE",
          border: "none",
          borderRadius: "10px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            marginBottom: 20,
          }}
        >
          <StyledImage
            src={logo}
            alt="Logo"
            style={{ width: 150, margin: 0 }}
          />
          <h2>Iniciar sesión</h2>
        </div>
        <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
          <Form.Item
            label="Email"
            validateStatus={errors.email ? "error" : ""}
            help={errors.email?.message}
          >
            <Controller
              name="email"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <StyledInput {...field} placeholder="Ingresa tu email" />
              )}
            />
          </Form.Item>
          <Form.Item
            label="Password"
            validateStatus={errors.password ? "error" : ""}
            help={errors.password?.message}
          >
            <Controller
              name="password"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <StyledPasswordInput
                  {...field}
                  placeholder="Ingresa tu contraseña"
                />
              )}
            />
          </Form.Item>
          <Form.Item>
            <StyledButton type="primary" htmlType="submit" block>
              Iniciar Sesión
            </StyledButton>
          </Form.Item>
        </Form>
      </StyledCard>
    </StyledContainer>
  );
};

export default LoginPage;
