import React from "react";
import { Input, Select, Checkbox, Button } from "antd";
import styled from "styled-components";

const StyledTitle = styled.h2`
  display: flex;
  justify-content: center;
  text-align: center;
  color: black;
  margin-bottom: 20px;
`;

const StyledContainer = styled.div`
  padding: 30px;
  max-width: 600px;
  justifycontent: "center";
`;

const StyledContainerButton = styled.div`
  max-width: 600px;
  margin-bottom: 20px;
`;

const StyledInput = styled(Input)`
  margin-bottom: 20px;
  background-color: rgb(236, 227, 227);
  border: 3px solidrgb(82, 81, 81);
`;

const StyledCheckboxContainer = styled.div`
  color: black;
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
`;

const StyledCheckbox = styled.input`
  margin-right: 5px;
`;

const StyledLabel = styled.label`
  margin-bottom: 20px;
  font-weight: bold;
  color: black;
`;

const StyledSelect = styled(Select)`
  margin-bottom: 20px;
  background-color: rgb(236, 227, 227);
  border: 10px solidrgb(82, 81, 81);
`;

const StyledContainerSelect = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 20px;
  color: black;
  font-weight: bold;
`;

//simular las opciones pa!
const optionsSelect = [
  { label: "Loyal", value: "1" },
  { label: "Chacagol", value: "2" },
];

const optionsCheckbox = [
  { label: "futbol5", value: "futbol5" },
  { label: "Green", value: "Green" },
  { label: "Blue", value: "Blue" },
];

const NewForm = () => {
  return (
    <StyledContainer>
      <StyledTitle>Crea tu partido</StyledTitle>
      <StyledLabel>Completar</StyledLabel>
      <StyledInput placeholder="Nombre" />
      <StyledInput placeholder="Tipo" />
      <StyledContainerSelect>
        Escoge entre las canchas disponibles
      </StyledContainerSelect>
      <StyledSelect
        placeholder="Elegir una opcion"
        options={optionsSelect}
        style={{ width: 150 }}
      />
      <StyledContainerButton>
        <Button>Guardar</Button>
      </StyledContainerButton>
      <StyledCheckboxContainer>
        <StyledLabel>Elegir color camiseta</StyledLabel>
        <Checkbox.Group options={optionsCheckbox} />
      </StyledCheckboxContainer>
      <StyledContainerButton>
        <Button type="link" href="https://www.youtube.com/watch?v=Osa4iNPJx1s">
          Videos de partidos jugados
        </Button>
      </StyledContainerButton>
    </StyledContainer>
  );
};

export default NewForm;
