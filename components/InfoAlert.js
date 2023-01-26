import { Space, Alert } from "@mantine/core";
import { IconAlertCircle } from "@tabler/icons";

export function InfoAlert(props) {
  return (
    <>
      <Space h={"xs"} />
      <Alert icon={<IconAlertCircle size={16} />} title="Info" radius="xs">
        {props.text}
      </Alert>
    </>
  );
}
