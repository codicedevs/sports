import { Button, message, Popconfirm, PopconfirmProps } from "antd";

interface DeleteProps {
  handleDelete: (id: string) => void;
  id: string;
}
const Delete = ({ handleDelete, id }: DeleteProps) => {
  const confirm: PopconfirmProps["onConfirm"] = (e) => {
    console.log("entre", id, handleDelete);
    handleDelete(id);
    message.success("Se borro el registro");
  };

  const cancel: PopconfirmProps["onCancel"] = (e) => {
    console.log(e);
    message.error("Cancelado");
  };
  return (
    <div>
      <Popconfirm
        title="Borrar registro"
        description="Estas seguro de borrar el registro?"
        onConfirm={confirm}
        onCancel={cancel}
        okText="Si"
        cancelText="No"
      >
        <Button danger>Borrar</Button>
      </Popconfirm>
    </div>
  );
};

export default Delete;
