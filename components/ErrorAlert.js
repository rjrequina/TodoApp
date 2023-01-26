import { Space, Alert } from "@mantine/core";
import { IconAlertCircle } from "@tabler/icons";

export function ErrorAlert(props) {
  return (
    <>
      <Space h={"xs"} />
      <Alert
        icon={<IconAlertCircle size={16} />}
        title="Error"
        color="red"
        radius="xs"
      >
        {props.text}
      </Alert>
    </>
  );
}
