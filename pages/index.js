import Head from "next/head";
import { useEffect, useState } from "react";
import { database } from "../firebaseApp";
import {
  collection,
  addDoc,
  getDocs,
  onSnapshot,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import {
  Input,
  Container,
  Button,
  Grid,
  Text,
  Space,
  Divider,
  Select,
} from "@mantine/core";
import { debounce } from "lodash";
import { ErrorAlert } from "../components/ErrorAlert";
import { InfoAlert } from "../components/InfoAlert";
import { Todo } from "../components/Todo";

const databaseInstance = collection(database, "todos");
export default function Home() {
  const [todoText, setTodoText] = useState("");
  const [addTodoLoading, setAddTodoLoading] = useState(false);
  const [addTodoFailed, setAddTodoFailed] = useState(false);
  const [todos, setTodos] = useState([]);
  const [sortBy, setSortBy] = useState("a-to-z");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    let updatedTodos = [...todos];
    updatedTodos.sort(sortFunction);
    setTodos(updatedTodos);
  }, [sortBy]);

  useEffect(() => {
    const unsubscribe = onSnapshot(databaseInstance, (docs) => {
      let updatedTodos = [];
      docs.forEach((doc) => {
        const data = doc.data();
        const cleanedSearchTerm = searchTerm.trim().toUpperCase();
        if (cleanedSearchTerm.length > 0) {
          if (data.search_term.startsWith(cleanedSearchTerm)) {
            updatedTodos.push({
              ...data,
              id: doc.id,
            });
          }
        } else {
          updatedTodos.push({
            ...data,
            id: doc.id,
          });
        }
      });

      updatedTodos.sort(sortFunction);
      setTodos(updatedTodos);
    });
    return () => {
      unsubscribe();
    };
  }, [sortBy, searchTerm]);

  const sortFunction = (a, b) => {
    const value = sortBy === "a-to-z" ? 0 : 2;
    if (a.title.toUpperCase() < b.title.toUpperCase()) {
      return -1 + value;
    }

    if (a.title.toUpperCase() > b.title.toUpperCase()) {
      return 1 - value;
    }
    return 0;
  };

  const handleOnTodoTextChange = (e) => {
    setTodoText(e.target.value);
  };

  const handleOnAddTodoButtonClick = (e) => {
    e.preventDefault();
    setAddTodoFailed(false);
    setAddTodoLoading(true);

    addDoc(databaseInstance, {
      title: todoText,
      search_term: todoText.trim().toUpperCase(),
    })
      .then((_) => {
        setAddTodoLoading(false);
        setTodoText("");
      })
      .catch((_) => {
        setAddTodoFailed(true);
        setAddTodoLoading(false);
      });
  };

  const search = (term) => {
    const q = query(
      databaseInstance,
      orderBy("search_term"),
      where("search_term", ">=", term.trim().toUpperCase()),
      where("search_term", "<=", term.trim().toUpperCase() + "\uf8ff")
    );

    let updatedTodos = [];
    getDocs(q).then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        updatedTodos.push({
          ...doc.data(),
          id: doc.id,
        });
      });
      updatedTodos.sort(sortFunction);
      setTodos(updatedTodos);
    });
  };

  const handleOnSearchTermChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);

    const debouncedSearch = debounce(() => {
      search(term);
    }, 300);
    debouncedSearch();
  };

  return (
    <Container>
      <Head>
        <title>Todo List</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Container size="xs" px="xs">
        <Text weight={500} ta="center" fz={"xl"}>
          Todo App
        </Text>
        <Space h={"lg"} />
      </Container>
      <Container size="xs" px="xs">
        <Grid>
          <Grid.Col span={10}>
            <Input
              placeholder="Create todo..."
              value={todoText}
              onChange={handleOnTodoTextChange}
              disabled={addTodoLoading}
            />
          </Grid.Col>
          <Grid.Col span={2}>
            <Button
              disabled={!todoText}
              loading={addTodoLoading}
              onClick={handleOnAddTodoButtonClick}
            >
              Add
            </Button>
          </Grid.Col>
        </Grid>
        {addTodoFailed && (
          <ErrorAlert text="An error occurred while adding a new todo." />
        )}
        <Divider my="xs" label="Your Todo List" labelPosition="center" />
        <Input
          placeholder="Search here..."
          radius="xs"
          size="xs"
          value={searchTerm}
          onChange={handleOnSearchTermChange}
        />
        <Select
          label="Sort list"
          placeholder="Sort alphabetically"
          size="xs"
          data={[
            { value: "a-to-z", label: "A-to-Z" },
            { value: "z-to-a", label: "Z-to-A" },
          ]}
          value={sortBy}
          onChange={(value) => {
            setSortBy(value);
          }}
        />
      </Container>
      {todos.length > 0 &&
        todos.map((todo) => (
          <Todo title={todo.title} id={todo.id} key={todo.id} />
        ))}
      {todos.length <= 0 && (
        <Container size="xs" px="xs">
          <InfoAlert text="Nothing to find here." />
        </Container>
      )}
    </Container>
  );
}
