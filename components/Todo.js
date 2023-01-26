import { useState, useEffect } from "react";
import {
  Input,
  Container,
  Button,
  Group,
  Flex,
  Grid,
  Card,
  Image,
  Text,
  Badge,
  Space,
  Divider,
  Select,
  Alert,
} from "@mantine/core";
import { database } from "../firebaseApp";
import { collection, updateDoc, deleteDoc, doc } from "firebase/firestore";

export function Todo(props) {
  const [title, setTitle] = useState("");
  const [id, setId] = useState();
  const [draftTitle, setDraftTitle] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editTodoLoading, setEditTodoLoading] = useState(false);
  const [deleteTodoLoading, setDeleteTodoLoading] = useState(false);

  useEffect(() => {
    setTitle(props.title);
    setId(props.id);
    setDraftTitle(props.title);
  }, []);

  useEffect(() => {
    setTitle(props.title);
    setDraftTitle(props.title);
  }, [props.title]);

  const handleOnEditTodoButtonClick = (e) => {
    e.preventDefault();
    setIsEditing(true);
    setDraftTitle(title);
  };

  const handleOnCancelButtonClick = (e) => {
    e.preventDefault();
    setIsEditing(false);
  };

  const handleOnSaveButtonClick = (e) => {
    e.preventDefault();

    // If title is not edited, just skip the saving part
    // To prevent stress on the server
    if (draftTitle === title) {
      setIsEditing(false);
      return;
    }

    const collectionById = doc(database, "todos", id);
    setEditTodoLoading(true);
    updateDoc(collectionById, {
      title: draftTitle,
      search_term: draftTitle.trim().toUpperCase(),
    })
      .then((_) => {
        setIsEditing(false);
        setEditTodoLoading(false);
      })
      .catch((_) => {
        setEditTodoLoading(false);
      });
  };

  const handleOnDraftTitleChange = (e) => {
    setDraftTitle(e.target.value);
  };

  const handleOnDeleteButtonClick = (e) => {
    e.preventDefault();
    const collectionById = doc(database, "todos", id);

    setDeleteTodoLoading(true);

    setTimeout(() => {
      deleteDoc(collectionById)
        .then((_) => {
          setDeleteTodoLoading(false);
        })
        .catch((_) => {
          setDeleteTodoLoading(false);
        });
    }, 500);
  };

  return (
    <Container size="xs" px="xs">
      <Card shadow="sm" p="lg" radius="md" width="100" mt="md">
        {!isEditing && (
          <>
            <Text weight={500}>{title}</Text>
            <Divider my="sm" />
            <Group position="right">
              <Button
                variant="light"
                color="blue"
                size="xs"
                onClick={handleOnEditTodoButtonClick}
                disabled={deleteTodoLoading}
              >
                Edit
              </Button>
              <Button
                variant="light"
                color="red"
                size="xs"
                onClick={handleOnDeleteButtonClick}
                loading={deleteTodoLoading}
              >
                Delete
              </Button>
            </Group>
          </>
        )}

        {isEditing && (
          <>
            <Input
              placeholder="Edit your todo..."
              value={draftTitle}
              onChange={handleOnDraftTitleChange}
              disabled={editTodoLoading}
            />
            <Space h="sm" />
            <Group position="right">
              <Button
                variant="light"
                color="blue"
                size="xs"
                onClick={handleOnSaveButtonClick}
                disabled={!draftTitle}
                loading={editTodoLoading}
              >
                Save
              </Button>
              <Button
                variant="light"
                color="blue"
                size="xs"
                onClick={handleOnCancelButtonClick}
                disabled={editTodoLoading}
              >
                Cancel
              </Button>
            </Group>
          </>
        )}
      </Card>
    </Container>
  );
}
